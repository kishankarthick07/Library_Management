import { Router } from 'express';
import {
  createBook,
  updateBook,
  deleteBook,
  getBooks,
  getBookById,
  searchBooks,
} from '../controllers/bookController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/search', protect, searchBooks);
router.get('/', protect, getBooks);
router.get('/:id', protect, getBookById);
router.post('/', protect, adminOnly, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

export default router;
