export function getTodayISOString() {
  const now = new Date();
  const offset = now.getTimezoneOffset(); // Offset in minutes from UTC
  const localNow = new Date(now.getTime() - offset * 60 * 1000);
  const isoDateTime = localNow.toISOString().slice(0, 19).replace("T", " ");
  return isoDateTime;
}
