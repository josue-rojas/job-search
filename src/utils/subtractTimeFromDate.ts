export function subtractTimeFromDate(date: Date, { hours, minutes, seconds }: { hours?: number; minutes?: number; seconds?: number; }): Date {
  const resultDate = new Date(date.getTime());

  resultDate.setHours(resultDate.getHours() - (hours || 0));
  resultDate.setMinutes(resultDate.getMinutes() - (minutes || 0));
  resultDate.setSeconds(resultDate.getSeconds() - (seconds || 0));

  return resultDate;
}
