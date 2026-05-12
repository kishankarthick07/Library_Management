import { Router } from 'express';
import {
  issueBook,
  returnBook,
  listTransactions,
  listOverdue,
  myActiveLoans,
} from '../controllers/transactionController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/issue', protect, issueBook);
router.post('/return/:id', protect, returnBook);
router.get('/overdue', protect, adminOnly, listOverdue);
router.get('/my-active', protect, myActiveLoans);
router.get('/', protect, listTransactions);

export default router;
