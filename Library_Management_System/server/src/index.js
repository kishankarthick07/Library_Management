import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { startFineCron } from './jobs/fineCron.js';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';

const app = express();

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'digital-library-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reservations', reservationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function main() {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET is not set');
    process.exit(1);
  }
  await connectDB();
  startFineCron();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
