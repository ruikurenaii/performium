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
  let a = 1.5837436485;
  let b = 1.1893746023;
  let c = 1.8547246344;
  let d = 2.1229384374;
  let e = 1.4857347224;
  let f = 2.0729158372;

  // factors
  let penaltyFactor = 8.8657445948;
	
  // note complexity values for the system
  const fileValue = vaultStats.totalFiles * (1 + (vaultStats.totalFolders / 25));
	
  const sentenceComplexityValue = vaultStats.totalWords / vaultStats.totalSentences;
  const sentenceDensityValue = vaultStats.totalSentences / vaultStats.totalWords;
  const fileComplexityValue = sentenceComplexityValue * vaultStats.averageWordsPerFile;
  const wordComplexityValue = vaultStats.totalChars / vaultStats.totalWords;

  // bonuses and nerfs
  let sentenceBonus = 0;

  if (vaultStats.averageSentencesPerFile > vaultStats.averageSentencesPerParagraph) {
    sentenceBonus = vaultStats.averageSentencesPerFile / vaultStats.averageSentencesPerParagraph;
  } else if (vaultStats.averageSentencesPerFile < vaultStats.averageSentencesPerParagraph) {
	sentenceBonus = vaultStats.averageSentencesPerParagraph / vaultStats.averageSentencesPerFile;
  }

  const readabilityMultiplier = 100 - ((vaultStats.averageWordsPerSentence * (vaultStats.averageCharsPerSentence / vaultStats.averageWordsPerSentence)) / 10);
  const readabilityBonus = (sentenceDensityValue / sentenceDensityValue) * (readabilityMultiplier / 10);
	
  const overallComplexityValue = a * sentenceComplexityValue + b * sentenceDensityValue + c * (vaultStats.totalWords / vaultStats.totalFiles) + d * wordComplexityValue + e * sentenceBonus + f * readabilityBonus;

  const lengthBonus = vaultStats.longestParagraphLength / vaultStats.longestSentenceLength;
  const sLengthBonus = vaultStats.longestSentenceLength / vaultStats.averageSentenceLength;
  const paragraphBonus = vaultStats.longestParagraphLength / vaultStats.averageParagraphLength;

  const totalLengthBonus = (sLengthBonus + paragraphBonus) / lengthBonus;

  const coherenceBonus = vaultStats.averageWordsPerSentence > 0 ? vaultStats.averageSentencesPerParagraph / vaultStats.averageWordsPerSentence : 0;

  const informativenessValue = vaultStats.totalWords * (vaultStats.totalChars / vaultStats.totalWords);

  const readingLevel = (0.39 * vaultStats.averageWordsPerSentence + 11.8 * (vaultStats.averageCharsPerSentence / vaultStats.averageWordsPerSentence) - 15.59) / 5;

  const readingBonus = readabilityBonus * readingLevel * readabilityMultiplier;

  const alternativeReadabilityValue = 0.39 * vaultStats.averageWordsPerSentence + 11.8 * wordComplexityValue;
  let shortWordsNerf = 0;

  if (alternativeReadabilityValue > 25) {
	shortWordsNerf = alternativeReadabilityValue * (wordComplexityValue / 5);
  } else if (alternativeReadabilityValue < 25) {
	shortWordsNerf = alternativeReadabilityValue - penaltyFactor * (wordComplexityValue / 5);
  }

  const depthFactor = vaultStats.longestParagraphLength / (vaultStats.averageParagraphLength + 1);
  const consistencyFactor = vaultStats.averageSentencesPerParagraph / (vaultStats.longestParagraphLength / (vaultStats.averageSentenceLength + 1));
  const variationFactor = Math.log2(1 + (vaultStats.averageParagraphLength / vaultStats.averageSentenceLength));


  const structureQualityBonus = (depthFactor * consistencyFactor * variationFactor) / 9.85; 

  const originalityBonus = (wordComplexityValue ** 2) * sLengthBonus * paragraphBonus;
														
  // remove more stuff
  const performanceValue: number = (fileValue + overallComplexityValue + (totalLengthBonus * 1.2774364947) + coherenceBonus + (informativenessValue ** 0.3825) + (readingBonus ** 0.475) + shortWordsNerf + originalityBonus + structureQualityBonus) / 1.9658337445;

  return performanceValue;
} 
