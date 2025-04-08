import { timeFormat } from "../utils/values/timeFormat";
import { PerformiumBaseSettings } from "../options/base";

export function getTimeSinceCreation(): number {
  const installDate = this.settings.installTimestamp ?? Date.now();
  const timeElapsed = now - installDate;

  return timeFormat(timeElapsed);
}
