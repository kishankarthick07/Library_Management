import cron from 'node-cron';
import { Transaction } from '../models/Transaction.js';
import { calculateFineForOpenLoan } from '../utils/fine.js';

/**
 * Runs daily at 00:00 — updates `fine` on open loans based on days past dueDate.
 */
export function startFineCron() {
  const schedule = process.env.FINE_CRON_SCHEDULE || '0 0 * * *';

  cron.schedule(schedule, async () => {
    try {
      const open = await Transaction.find({ returnDate: null });
      let updated = 0;
      for (const t of open) {
        const fine = calculateFineForOpenLoan(t.dueDate);
        if (fine !== t.fine) {
          t.fine = fine;
          await t.save();
          updated++;
        }
      }
      console.log(`[fineCron] Updated fines on ${updated} open loan(s).`);
    } catch (err) {
      console.error('[fineCron]', err);
    }
  });

  console.log(`Fine cron scheduled: ${schedule}`);
}
