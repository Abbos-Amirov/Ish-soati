/** Formats a date as a "YYYY-MM" payroll period label. */
export function formatPeriodLabel(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  return `${year}-${month}`;
}
