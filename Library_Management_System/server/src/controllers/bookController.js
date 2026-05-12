import { Book } from '../models/Book.js';

export async function createBook(req, res, next) {
  try {
    const {
      title,
      author,
      category,
      isbn,
      totalCopies,
      availableCopies,
      description,
    } = req.body;

    if (!title || !author || !category || !isbn || totalCopies == null) {
      res.status(400);
      throw new Error('title, author, category, isbn, and totalCopies are required');
    }

    const tc = Number(totalCopies);
    const ac =
      availableCopies != null ? Number(availableCopies) : tc;

    const book = await Book.create({
      title,
      author,
      category,
      isbn: String(isbn).trim(),
      totalCopies: tc,
      availableCopies: Math.min(ac, tc),
      description: description || '',
    });

    res.status(201).json({ success: true, book });
  } catch (e) {
    if (e.code === 11000) {
      res.status(400);
      e.message = 'ISBN already exists';
    }
    next(e);
  }
}

export async function updateBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    const {
      title,
      author,
      category,
      isbn,
      totalCopies,
      availableCopies,
      description,
    } = req.body;

    if (title != null) book.title = title;
    if (author != null) book.author = author;
    if (category != null) book.category = category;
    if (isbn != null) book.isbn = String(isbn).trim();
    if (description != null) book.description = description;

    if (totalCopies != null) {
      const tc = Number(totalCopies);
      book.totalCopies = tc;
      if (availableCopies != null) {
        book.availableCopies = Math.min(Number(availableCopies), tc);
      } else {
        book.availableCopies = Math.min(book.availableCopies, tc);
      }
    } else if (availableCopies != null) {
      book.availableCopies = Math.min(
        Number(availableCopies),
        book.totalCopies
      );
    }

    await book.save();
    res.json({ success: true, book });
  } catch (e) {
    if (e.code === 11000) {
      res.status(400);
      e.message = 'ISBN already exists';
    }
    next(e);
  }
}

export async function deleteBook(req, res, next) {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }
    res.json({ success: true, message: 'Book removed' });
  } catch (e) {
    next(e);
  }
}

export async function getBooks(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = new RegExp(req.query.category, 'i');
    if (req.query.author) filter.author = new RegExp(req.query.author, 'i');

    const [books, total] = await Promise.all([
      Book.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Book.countDocuments(filter),
    ]);

    res.json({
      success: true,
      books,
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

export async function getBookById(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }
    res.json({ success: true, book });
  } catch (e) {
    next(e);
  }
}

/**
 * MongoDB text search + optional filters (category, author partial match)
 */
export async function searchBooks(req, res, next) {
  try {
    const q = req.query.q || '';
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = {};
    if (q.trim()) {
      filter.$text = { $search: q.trim() };
    }
    if (req.query.category) {
      filter.category = new RegExp(req.query.category, 'i');
    }
    if (req.query.author) {
      filter.author = new RegExp(req.query.author, 'i');
    }

    const sort = q.trim() ? { score: { $meta: 'textScore' } } : { createdAt: -1 };

    const query = Book.find(filter);
    if (q.trim()) {
      query.select({ score: { $meta: 'textScore' } });
    }
    const [books, total] = await Promise.all([
      query.sort(sort).skip(skip).limit(limit).lean(),
      Book.countDocuments(filter),
    ]);

    res.json({
      success: true,
      books,
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
