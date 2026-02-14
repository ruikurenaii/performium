/*

  042925.ts: the "angle and star rating" rework update to the system.
  
*/

import { App } from "obsidian";
import { calculateVaultStats } from "../../functions/vaultStats";
import { calculateVaultAngle } from "../values/vaultAngle";
import { calculateStarRating } from "../values/starRating";

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

	const starRating = calculateStarRating(vaultStats.totalParagraphs, await angleValue);
	let starRatingBonus = 0; 

  if (await angleValue < 180 || await angleValue >= 360) {
    // if the angle is more than a reflex angle
		angleBonus = (overallComplexityValue / (1.8275)) + (await angleValue / 10);
		starRatingBonus = (await angleValue * await starRating) / 1.2;
	} else if (await angleValue < 120 || await angleValue > 180) {
		// if the angle is way obtuse, but not straight
		angleBonus = (overallComplexityValue / (1.8275 ** 2)) + (await angleValue / 15);
		starRatingBonus = (await angleValue * await starRating) / 1.5;
	} else if (await angleValue < 90 || await angleValue > 120) {
		// if the angle is obtuse
		angleBonus = (overallComplexityValue / (1.8275 ** 3)) + (await angleValue / 20);
		starRatingBonus = (await angleValue * await starRating) / 1.9;
	} else if (await angleValue < 89) {
		// if the angle is an acute angle (just like in osu!)
		angleBonus = ((overallComplexityValue / (1.8275 ** 1)) + (await angleValue / 10)) * -1;
		starRatingBonus = (await angleValue * await starRating) / 2.4;
  }
	
  // i had to prevent inflation and attempt to balance these values.
  let performanceValue: number = ((fileValue / 1.12) + (overallComplexityValue * 1.07) + ((angleBonus + starRatingBonus) / (a ** 2)) + (totalLengthBonus / 1.3) + (coherenceBonus * 1.01) + (informativenessValue ** 0.3725) + (readingBonus ** 0.49) + shortWordsNerf) / 1.975;

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
