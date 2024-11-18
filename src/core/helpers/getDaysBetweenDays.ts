export function getDaysBetweenDates(date1: Date, date2: Date): number {
  const time1 = date1.getTime();
  const time2 = date2.getTime();

  const diffInMs = Math.abs(time1 - time2);

  const msInDay = 24 * 60 * 60 * 1000;
  return Math.floor(diffInMs / msInDay);
}
