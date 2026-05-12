import 'dotenv/config';
import mongoose from 'mongoose';
import { Book } from '../models/Book.js';

const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    isbn: '978-0-7432-7356-5',
    totalCopies: 5,
    availableCopies: 5,
    description: 'A classic American novel set in the Jazz Age.'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    isbn: '978-0-06-112008-4',
    totalCopies: 4,
    availableCopies: 4,
    description: 'A gripping tale of racial injustice and childhood innocence.'
  },
  {
    title: '1984',
    author: 'George Orwell',
    category: 'Dystopian',
    isbn: '978-0-452-26234-2',
    totalCopies: 3,
    availableCopies: 3,
    description: 'A dystopian novel about totalitarianism and surveillance.'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Romance',
    isbn: '978-0-14-143951-8',
    totalCopies: 6,
    availableCopies: 6,
    description: 'A timeless love story of Elizabeth Bennet and Mr. Darcy.'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    category: 'Fiction',
    isbn: '978-0-316-76948-0',
    totalCopies: 3,
    availableCopies: 3,
    description: 'The story of teenage rebellion and alienation.'
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'Non-Fiction',
    isbn: '978-0-06-231609-7',
    totalCopies: 4,
    availableCopies: 4,
    description: 'A brief history of humankind.'
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Psychology',
    isbn: '978-0-374-27563-1',
    totalCopies: 3,
    availableCopies: 3,
    description: 'Insights into the two systems of human thought.'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    isbn: '978-0-547-92822-8',
    totalCopies: 5,
    availableCopies: 5,
    description: 'The prequel to The Lord of the Rings trilogy.'
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    category: 'Biography',
    isbn: '978-0-399-59065-8',
    totalCopies: 2,
    availableCopies: 2,
    description: 'A memoir about a woman who leaves her survivalist family to pursue education.'
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    category: 'Fiction',
    isbn: '978-0-525-55803-3',
    totalCopies: 4,
    availableCopies: 4,
    description: 'A story about possibilities and second chances.'
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books');

    // Insert sample books
    await Book.insertMany(sampleBooks);
    console.log('✅ Seeded 10 sample books');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
