import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
  },
  { timestamps: true }
);

export const Member = mongoose.model('Member', memberSchema);
