const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getFinePerDay() {
  const n = Number(process.env.FINE_PER_DAY);
  return Number.isFinite(n) && n >= 0 ? n : 2;
}

export function getLoanDays() {
  const n = Number(process.env.LOAN_DAYS);
  return Number.isFinite(n) && n > 0 ? n : 14;
}

/** Full days overdue from dueDate (exclusive of due day if same calendar logic) */
export function daysOverdue(dueDate, asOf = new Date()) {
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const today = new Date(asOf);
  today.setHours(0, 0, 0, 0);
  const diff = today - due;
  if (diff <= 0) return 0;
  return Math.ceil(diff / MS_PER_DAY);
}

export function calculateFineForOpenLoan(dueDate, asOf = new Date()) {
  const d = daysOverdue(dueDate, asOf);
  return d * getFinePerDay();
}
