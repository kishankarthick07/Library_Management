import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
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
    issueDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },
    fine: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

transactionSchema.index({ memberId: 1, returnDate: 1 });
transactionSchema.index({ dueDate: 1, returnDate: 1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);
