import { Router } from 'express';
import {
  reserveBook,
  cancelReservation,
  myReservations,
  getBookQueue,
} from '../controllers/reservationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, reserveBook);
router.delete('/', protect, cancelReservation);
router.get('/mine', protect, myReservations);
router.get('/queue/:bookId', protect, getBookQueue);

export default router;
