/*

  test.ts: the test version of the osu! pp system integrated into obsidian.
  the previous test version didn't get to be released, and due to countless hours of working on the issue why it didn't work, i decided to move it somewhere else.
  don't worry, it won't be included to the plugin itself, but unless other people want to help me test it once more and tell what the issue was.
  the pp rewrite didn't seem to go well, so we'll just continue what we're gonna focus on.
  
*/

import { App } from "obsidian";
import { calculateVaultStats } from "../../functions/vaultStats";
import { calculateVaultAngle } from "../values/vaultAngle";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(app: App): Promise<number> {
  const vaultStats = await calculateVaultStats(app);

  // weights
  let a = 1.7349285739;
  let b = 1.6893741205;
  let c = 1.6228493017;
  let d = 1.3428593012;
  let e = 1.8753012946;
  let f = 1.2109483725;

  // factors
  let penaltyFactor = 9.129727134;
	
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

	const angleValue = calculateVaultAngle(vaultStats.totalFiles, vaultStats.totalFolders, vaultStats.totalParagraphs);
	let angleBonus = 0;

  if (angleValue < 180 || angleValue >= 360) {
    // if the angle is more than a reflex angle
		angleBonus = (overallComplexityValue / (1.8275)) + (angleValue / 10);
	} else if (angleValue < 120 || angleValue > 180) {
		// if the angle is way obtuse, but not straight
		angleBonus = (overallComplexityValue / (1.8275 ** 2)) + (angleValue / 15);
	} else if (angleValue < 90 || angleValue > 120) {
		// if the angle is obtuse
		angleBonus = (overallComplexityValue / (1.8275 ** 3)) + (angleValue / 20);
	} else if (angleValue < 89) {
		// if the angle is an acute angle (just like in osu!)
		angleBonus = ((overallComplexityValue / (1.8275 ** 1)) + (angleValue / 10)) * -1;
  }
  // i had to prevent inflation and attempt to balance these values.
  const performanceValue: number = (fileValue + (overallComplexityValue * 1.07) + angleBonus + totalLengthBonus + coherenceBonus + (informativenessValue ** 0.3825) + (readingBonus ** 0.5) + shortWordsNerf) / 1.8275;

  return performanceValue;
}  
