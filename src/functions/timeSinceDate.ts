import { timeFormat } from "../utils/values/timeFormat";

export async function getTimeSinceDate(installDate: number): Promise<string> {
  const timeElapsed = Date.now() - installDate;

  return timeFormat(timeElapsed);
}
