function timeFormat(time: number): string {
  const seconds = time / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const months = days / 30;
  const years = days / 365;

  if (years >= 1) {
    return `${Math.floor(years)} year(s)`;
  } else if (months >= 1) {
    return `${Math.floor(months)} month(s)`;
  } else if (weeks >= 1) {
    return `${Math.floor(weeks)} week(s)`;
  } else if (days >= 1) {
    return `${Math.floor(days)} day(s)`;
  } else if (hours >= 1) {
    return `${Math.floor(hours)} hour(s)`;
  } else if (minutes >= 1) {
    return `${Math.floor(minutes)} minute(s)`;
  } else {
    return `${Math.floor(seconds)} second(s)`;
  }
}
