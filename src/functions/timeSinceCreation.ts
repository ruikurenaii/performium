import { timeFormat } from "../utils/values/timeFormat";
import { PerformiumBaseSettings } from "../options/base";

export function getTimeSinceCreation(): string {
  const installDate = this.settings.installTimestamp ?? Date.now();
  const timeElapsed = Date.now() - installDate;

  return timeFormat(timeElapsed);
}
