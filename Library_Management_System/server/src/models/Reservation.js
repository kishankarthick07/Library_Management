import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
  },
  { timestamps: true }
);

reservationSchema.index({ bookId: 1, memberId: 1 }, { unique: true });
reservationSchema.index({ bookId: 1, createdAt: 1 });

export const Reservation = mongoose.model('Reservation', reservationSchema);
