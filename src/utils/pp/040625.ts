/*

  040625.ts: the first version of the osu! pp system integrated into obsidian.
  it may vary depending on the demands.

*/

import { App } from "obsidian";
import { calculateVaultStats } from "../../main";

// the function to calculate the pp values from a single note
export async function calculatePerformance(app: App): Promise<string> {
  const vaultStats = await calculateVaultStats(app);

  // weights
	let a: number = 1;
	const b: number = 1.2247448713;
	const c: number = 1.0488088481;
	const d: number = 1.4142135623;
	
  // note complexity values for the system
  const fileValue: number = vaultStats.totalFiles * (1 + (vaultStats.totalFolders / 25));
	
  const sentenceComplexityValue: number = vaultStats.totalWords / vaultStats.totalSentences;
  const sentenceDensityValue: number = vaultStats.totalSentences / vaultStats.totalWords;
  const fileComplexityValue: number = sentenceComplexityValue * vaultStats.averageWordsPerFile;
  const wordComplexityValue: number = vaultStats.totalChars / vaultStats.totalWords;
	
  const overallComplexityValue: number = a * sentenceComplexityValue + b * sentenceDensityValue + c * (vaultStats.totalWords / vaultStats.totalFiles) + d * wordComplexityValue;

  const performanceValue: number = fileValue + overallComplexityValue;

  return performanceValue;
}
