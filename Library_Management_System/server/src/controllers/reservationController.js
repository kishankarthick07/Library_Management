import mongoose from 'mongoose';
import { Book } from '../models/Book.js';
import { Reservation } from '../models/Reservation.js';

async function queueInfo(bookId, memberId) {
  const list = await Reservation.find({ bookId })
    .sort({ createdAt: 1 })
    .populate('memberId', 'name email')
    .lean();

  const idx = list.findIndex(
    (r) => r.memberId._id.toString() === memberId.toString()
  );

  return {
    queue: list.map((r, i) => ({
      position: i + 1,
      memberId: r.memberId._id,
      name: r.memberId.name,
      createdAt: r.createdAt,
    })),
    myPosition: idx === -1 ? null : idx + 1,
    queueLength: list.length,
  };
}

export async function reserveBook(req, res, next) {
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

    if (book.availableCopies > 0) {
      res.status(400);
      throw new Error('Book has available copies — issue instead of reserving.');
    }

    try {
      await Reservation.create({ bookId, memberId });
    } catch (e) {
      if (e.code === 11000) {
        res.status(400);
        throw new Error('You are already in the queue for this book.');
      }
      throw e;
    }

    const info = await queueInfo(bookId, memberId);
    res.status(201).json({
      success: true,
      message: 'Added to reservation queue',
      position: info.myPosition,
      queueLength: info.queueLength,
    });
  } catch (e) {
    next(e);
  }
}

export async function cancelReservation(req, res, next) {
  try {
    const { bookId } = req.query;
    const memberId = req.member._id;

    if (!bookId) {
      res.status(400);
      throw new Error('bookId query is required');
    }

    const r = await Reservation.findOneAndDelete({ bookId, memberId });
    if (!r) {
      res.status(404);
      throw new Error('Reservation not found');
    }

    res.json({ success: true, message: 'Reservation cancelled' });
  } catch (e) {
    next(e);
  }
}

export async function myReservations(req, res, next) {
  try {
    const memberId = req.member._id;
    const reservations = await Reservation.find({ memberId })
      .sort({ createdAt: 1 })
      .populate('bookId')
      .lean();

    const withPosition = await Promise.all(
      reservations.map(async (r) => {
        const list = await Reservation.find({ bookId: r.bookId._id })
          .sort({ createdAt: 1 })
          .select('_id memberId')
          .lean();
        const pos =
          list.findIndex((x) => x.memberId.toString() === memberId.toString()) +
          1;
        return {
          ...r,
          queuePosition: pos,
          queueLength: list.length,
        };
      })
    );

    res.json({ success: true, reservations: withPosition });
  } catch (e) {
    next(e);
  }
}

export async function getBookQueue(req, res, next) {
  try {
    const { bookId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      res.status(400);
      throw new Error('Invalid book id');
    }

    const book = await Book.findById(bookId).select('title availableCopies');
    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    const memberId = req.member._id;
    const info = await queueInfo(bookId, memberId);

    res.json({
      success: true,
      book,
      ...info,
    });
  } catch (e) {
    next(e);
  }
}
