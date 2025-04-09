import { timeFormat } from "../utils/values/timeFormat";

export function getTimeSinceDate(installDate: number): string {
  const timeElapsed = Date.now() - installDate;

  return timeFormat(timeElapsed);
}
