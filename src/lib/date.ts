/** Calendar date key in the user's local time zone. Avoid ISO UTC conversion,
 * which can assign a local evening or midnight to the neighboring date. */
export function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
