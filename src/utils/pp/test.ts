/*

  test.ts: the test version of the osu! pp system integrated into obsidian.
  this is where the pp system is being reworked before releasing as a separate pp system version, but it still may vary depending on the demands.

*/

import { App } from "obsidian";
import { calculateVaultStats } from "../../functions/vaultStats";
import { PerformiumBaseSettings, PerformiumSettingsTab, DEFAULT_SETTINGS } from "../../options/base";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(app: App): Promise<number> {
	const vaultStats = await calculateVaultStats(app);
  
  // variables
  let files = vaultStats.totalFiles;
  let tags = vaultStats.totalTags;
  let words = vaultStats.totalWords;
  let sentences = vaultStats.totalSentences;
  let characters = vaultStats.totalChars;
  let paragraphs = vaultStats.totalParagraphs;
  
  let wordsPerFile = vaultStats.averageWordsPerFile;

  const totalFocusTime = this.settings.totalFocusTime ?? 0;
  
  // for star rating
  const wordsPerSentence = words / sentences;
  const sentencesPerParagraph = sentences / paragraphs;
  const wordComplexity = characters / words;
  const patternDifficulty = vaultStats.longestParagraphLength / (vaultStats.averageParagraphLength + 1);
  
  const starRating: number = Math.min(15, (wordsPerSentence * sentencesPerParagraph * wordComplexity * patternDifficulty) ** 0.25);
	
  // bonuses
  const lengthBonus = vaultStats.longestParagraphLength / vaultStats.longestSentenceLength;
  // const timeBonus: number = Math.sqrt(Math.sqrt(totalFocusTime / (Math.sqrt(totalFocusTime) / totalFocusTime)));

  const performanceValue: number = files + wordsPerFile + tags + lengthBonus + (1 + (starRating * 0.1)) + /* (timeBonus / 9.8) */;

  return performanceValue;
}
