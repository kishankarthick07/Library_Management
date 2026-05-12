/**
 * Create an admin user: node src/scripts/seedAdmin.js
 * Requires MONGODB_URI, JWT_SECRET in .env (or env)
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Member } from '../models/Member.js';

const email = process.env.ADMIN_EMAIL || 'admin@library.local';
const password = process.env.ADMIN_PASSWORD || 'admin123';
const name = process.env.ADMIN_NAME || 'Librarian';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const exists = await Member.findOne({ email });
  if (exists) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }
  const hashed = await bcrypt.hash(password, 12);
  await Member.create({
    name,
    email,
    password: hashed,
    role: 'admin',
  });
  console.log('Admin created:', email);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
