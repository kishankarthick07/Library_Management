import mongoose from 'mongoose';
import { Book } from '../models/Book.js';
import { Transaction } from '../models/Transaction.js';
import { Reservation } from '../models/Reservation.js';
import {
  calculateFineForOpenLoan,
  getLoanDays,
} from '../utils/fine.js';

async function getQueuePosition(bookId, memberId) {
  const list = await Reservation.find({ bookId })
    .sort({ createdAt: 1 })
    .select('_id memberId createdAt')
    .lean();
  const idx = list.findIndex(
    (r) => r.memberId.toString() === memberId.toString()
  );
  if (idx === -1) return null;
  return { position: idx + 1, total: list.length };
}

export async function issueBook(req, res, next) {
  try {
    const { bookId } = req.body;
    const memberId = req.member._id;

    if (!bookId) {
      res.status(400);
      throw new Error('bookId is required');
    }

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    if (book.availableCopies <= 0) {
      res.status(400);
      throw new Error(
        'No copies available. Use reserve to join the queue.'
      );
    }

    const queue = await Reservation.find({ bookId })
      .sort({ createdAt: 1 })
      .lean();

    if (queue.length > 0) {
      const first = queue[0];
      if (first.memberId.toString() !== memberId.toString()) {
        res.status(403);
        throw new Error(
          'Another member is next in the reservation queue for this book.'
        );
      }
    }

    const open = await Transaction.findOne({
      bookId,
      memberId,
      returnDate: null,
    });
    if (open) {
      res.status(400);
      throw new Error('You already have an active loan for this book.');
    }

    const loanDays = getLoanDays();
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + loanDays);

    // Update book availability
    book.availableCopies -= 1;
    await book.save();

    // Remove from reservation queue if present
    if (queue.length > 0) {
      await Reservation.deleteOne({ _id: queue[0]._id });
    }

    // Create transaction
    const transaction = await Transaction.create({
      bookId,
      memberId,
      issueDate,
      dueDate,
      returnDate: null,
      fine: 0,
    });

    const populated = await Transaction.findById(transaction._id).populate([
      { path: 'bookId', select: 'title author isbn' },
      { path: 'memberId', select: 'name email' },
    ]);

    res.status(201).json({
      success: true,
      transaction: populated,
    });
  } catch (e) {
    next(e);
  }
}

export async function returnBook(req, res, next) {
  try {
    const { id } = req.params;
    const memberId = req.member._id;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      res.status(404);
      throw new Error('Transaction not found');
    }

    if (transaction.memberId.toString() !== memberId.toString()) {
      if (req.member.role !== 'admin') {
        res.status(403);
        throw new Error('Not allowed to return this loan');
      }
    }

    if (transaction.returnDate) {
      res.status(400);
      throw new Error('Book already returned');
    }

    const returnDate = new Date();
    let fine = calculateFineForOpenLoan(transaction.dueDate, returnDate);

    const book = await Book.findById(transaction.bookId);
    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    book.availableCopies = Math.min(book.availableCopies + 1, book.totalCopies);
    await book.save();

    transaction.returnDate = returnDate;
    transaction.fine = fine;
    await transaction.save();

    const populated = await Transaction.findById(transaction._id).populate([
      { path: 'bookId', select: 'title author isbn availableCopies' },
      { path: 'memberId', select: 'name email' },
    ]);

    res.json({ success: true, transaction: populated, fine });
  } catch (e) {
    next(e);
  }
}

export async function listTransactions(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.member.role !== 'admin') {
      filter.memberId = req.member._id;
    } else if (req.query.memberId) {
      filter.memberId = req.query.memberId;
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ issueDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('bookId', 'title author isbn category')
        .populate('memberId', 'name email')
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function listOverdue(req, res, next) {
  try {
    const overdue = await Transaction.find({
      returnDate: null,
      dueDate: { $lt: new Date() },
    })
      .sort({ dueDate: 1 })
      .populate('bookId', 'title author isbn')
      .populate('memberId', 'name email')
      .lean();

    const withProjectedFine = overdue.map((t) => ({
      ...t,
      projectedFine: calculateFineForOpenLoan(t.dueDate),
      daysOverdue: Math.max(
        0,
        Math.ceil(
          (new Date() - new Date(t.dueDate)) / (24 * 60 * 60 * 1000)
        )
      ),
    }));

    res.json({ success: true, overdue: withProjectedFine });
  } catch (e) {
    next(e);
  }
}

export async function myActiveLoans(req, res, next) {
  try {
    const loans = await Transaction.find({
      memberId: req.member._id,
      returnDate: null,
    })
      .populate('bookId')
      .lean();

    const enriched = loans.map((t) => ({
      ...t,
      currentFineIfReturnedNow: calculateFineForOpenLoan(t.dueDate),
    }));

    res.json({ success: true, loans: enriched });
  } catch (e) {
    next(e);
  }
}
