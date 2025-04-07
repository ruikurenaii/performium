/*

  test.ts: the test version of the osu! pp system integrated into obsidian.
  this is where the pp system is being reworked before releasing as a separate pp system version, but it still may vary depending on the demands.

*/

import { App } from "obsidian";
import { calculateVaultStats } from "../../functions/vaultStats";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(app: App): Promise<number> {
  const vaultStats = await calculateVaultStats(app);

  // weights
	let a: number = 1.7349285739;
	let b: number = 1.6893741205;
	let c: number = 1.6228493017;
	let d: number = 1.3428593012;
	let e: number = 1.8753012946;
	let f: number = 1.2109483725;
	
  // note complexity values for the system
  const fileValue: number = vaultStats.totalFiles * (1 + (vaultStats.totalFolders / 25));
	
  const sentenceComplexityValue: number = vaultStats.totalWords / vaultStats.totalSentences;
  const sentenceDensityValue: number = vaultStats.totalSentences / vaultStats.totalWords;
  const fileComplexityValue: number = sentenceComplexityValue * vaultStats.averageWordsPerFile;
  const wordComplexityValue: number = vaultStats.totalChars / vaultStats.totalWords;

  // bonuses and nerfs
  let sentenceBonus: number = 0;

  if (vaultStats.averageSentencesPerFile > vaultStats.averageSentencesPerParagraph) {
    sentenceBonus = vaultStats.averageSentencesPerFile / vaultStats.averageSentencesPerParagraph;
  } else if (vaultStats.averageSentencesPerFile < vaultStats.averageSentencesPerParagraph) {
	sentenceBonus = vaultStats.averageSentencesPerParagraph / vaultStats.averageSentencesPerFile;
  }

  const readabilityMultiplier: number = 100 - ((vaultStats.averageWordsPerSentence * (vaultStats.averageCharsPerSentence / vaultStats.averageWordsPerSentence)) / 10);
  const readabilityBonus: number = (sentenceDensityValue / sentenceDensityValue) * (readabilityMultiplier / 10);
	
  const overallComplexityValue: number = a * sentenceComplexityValue + b * sentenceDensityValue + c * (vaultStats.totalWords / vaultStats.totalFiles) + d * wordComplexityValue + e * sentenceBonus + f * readabilityBonus;

  const lengthBonus: number = vaultStats.longestParagraphLength / vaultStats.longestSentenceLength;
  const sLengthBonus: number = vaultStats.longestSentenceLength / vaultStats.averageSentenceLength;
  const paragraphBonus: number = vaultStats.longestParagraphLength / vaultStats.averageParagraphLength;

  const totalLengthBonus: number = (sLengthBonus + paragraphBonus) / lengthBonus;

  const coherenceBonus: number = vaultStats.averageWordsPerSentence > 0 ? vaultStats.averageSentencesPerParagraph / vaultStats.averageWordsPerSentence : 0;

  const informativenessValue: number = vaultStats.totalWords * (vaultStats.totalChars / vaultStats.totalWords);
	  
  const performanceValue: number = fileValue + overallComplexityValue + totalLengthBonus + coherenceBonus + (informativenessValue ** 0.3825);

  return performanceValue;
} 
