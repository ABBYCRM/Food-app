/** Return a calendar key in the user's local timezone (YYYY-MM-DD). */
export function localDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Day of year, calculated in UTC so daylight-saving changes cannot shift it. */
export function localDayOfYear(date: Date = new Date()): number {
  const year = date.getFullYear();
  const current = Date.UTC(year, date.getMonth(), date.getDate());
  const beforeYear = Date.UTC(year, 0, 0);
  return Math.floor((current - beforeYear) / 86_400_000);
}
