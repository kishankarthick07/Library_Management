import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    totalCopies: { type: Number, required: true, min: 1 },
    availableCopies: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

bookSchema.pre('validate', function (next) {
  if (this.availableCopies > this.totalCopies) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

bookSchema.index({ title: 'text', author: 'text', category: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ author: 1 });

export const Book = mongoose.model('Book', bookSchema);
