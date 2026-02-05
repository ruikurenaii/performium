/*

  040625.ts: the first version of the osu! pp system integrated into obsidian.
  it may vary depending on the demands.

*/

import { App } from "obsidian";
import { calculateVaultStats } from "../../functions/vaultStats";

// the function to calculate the pp values from the entire vault
export async function calculatePerformance(app: App): Promise<number> {
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

  let performanceValue: number = fileValue + overallComplexityValue;

  // if the pp is below 0 and is a negative number
  if (performanceValue < 0) {
    console.log("The calculated value is 0pp or negative... Setting it to 0pp...")
	  performanceValue = 0;
  } else if (Number.isNaN(performanceValue)) {
    // otherwise, if the value is not a number
    console.log("The calculated value is not a number... Setting it to 0pp...");
    performanceValue = 0;
  } else if (performanceValue === Infinity) {
    // if the value doesn't meet any of the previous conditions, execute this
    console.log("The calculated value is an infinite number, setting it to 0pp..");
    performanceValue = 0;
  } else {
    performanceValue = performanceValue;
  }

  return performanceValue;
}
