import PerformiumPlugin from "../../../main";
import { calculateVaultStats } from "../../../functions/vaultStats";

export async function calculateWPM(plugin: PerformiumPlugin): Promise<number> {
  const app = plugin.app;
  
  const vaultStats = await calculateVaultStats(app);
  
  const totalWords = vaultStats.totalWords;
  const totalFocusTime = plugin.settings.totalFocusTime || 0; // returns the value in milliseconds
  
  if (totalFocusTime === 0) return 0; // avoid division by zero
  
  // convert focus time from milliseconds to minutes
  const focusTimeInMinutes = totalFocusTime / (1000 * 60);
  
  // calculate the average words per minute
  const wpm = totalWords / focusTimeInMinutes;
  
  return wpm;
}