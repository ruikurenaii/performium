/*

  040625.ts: the first version of the osu! pp system integrated into obsidian.
  it may vary depending on the demands.

*/

import { App } from "obsidian";
import { calculateVaultStats } from "../src/main";

// the function to calculate the pp values from a single note
export async function calculatePerformance(app: App): Promise<string> {
  const vaultStats = await calculateVaultStats(app);

  // some values for the system
  const fileValue = vaultStats.totalFiles * (1 + (vaultStats.totalFolders / 25));
  const sentenceComplexityValue;
  const complexityValue;

  // const performanceValue: number;
}
