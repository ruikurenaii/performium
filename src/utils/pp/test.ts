/*

  test.ts: the test version of the pp system.
  
*/

import { App } from "obsidian";
import { calculateVaultStats } from "../../functions/vaultStats";
import { calculateVaultAngle } from "../values/vaultAngle";
import { calculateStarRating } from "../values/starRating";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(app: App): Promise<number> {
  const vaultStats = await calculateVaultStats(app);

	const totalFiles = vaultStats.totalFiles;
  const totalFolders = vaultStats.totalFolders;
  const totalWords = vaultStats.totalWords;
  const totalChars = vaultStats.totalChars;
  const totalSentences = vaultStats.totalSentences;
  const totalParagraphs = vaultStats.totalParagraphs;
  const totalTags = vaultStats.totalTags;
  const averageWordsPerFile = vaultStats.averageWordsPerFile;
  const averageSentencesPerFile = vaultStats.averageSentencesPerFile;
  const averageWordsPerSentence = vaultStats.averageWordsPerSentence;
  const averageSentencesPerParagraph = vaultStats.averageSentencesPerParagraph;
  const averageCharsPerSentence = vaultStats.averageCharsPerSentence;
  const averageParagraphLength = vaultStats.averageParagraphLength;
  const averageSentenceLength = vaultStats.averageSentenceLength;
  const longestSentenceLength = vaultStats.longestSentenceLength;
  const longestParagraphLength = vaultStats.longestParagraphLength;

	const aimRaw = (1 / averageWordsPerSentence + 1 / averageSentenceLength) * 100;
  const aim = Math.pow(aimRaw, 0.8);

  const strainRaw = Math.log2(totalWords + 1) * (averageParagraphLength + longestParagraphLength);
  const strain = Math.pow(strainRaw, 0.6);

  const speedRaw = totalFiles * Math.log2(averageWordsPerFile + 1);
  const speed = Math.pow(speedRaw, 0.5);

  const sliderRaw = (totalParagraphs * averageSentencesPerParagraph * Math.log2(averageParagraphLength + 2));
  const slider = Math.pow(sliderRaw, 0.6);

  const tagSentenceRatio = totalTags / Math.max(totalSentences, 1);
  const charPerSentencePenalty = averageCharsPerSentence / 100;
  const accuracyRaw = (tagSentenceRatio * 100) / charPerSentencePenalty;
  const accuracy = Math.pow(accuracyRaw, 0.7);

  const scale = (v, max) => Math.min(100, (v / max) * 100);

  const aimValue = scale(aim, 80.2374918532);
  const strainValue = scale(strain, 149.6821400294);
  const speedValue = scale(speed, 200.3149785217);
  const sliderValue = scale(slider, 100.8703294731);
  const accuracyValue = scale(accuracy, 120.1038649715);

  const combinedValue: number = aimValue + strainValue + speedValue + sliderValue + accuracyValue;

	const angleValue = calculateVaultAngle(vaultStats.totalFiles, vaultStats.totalFolders, vaultStats.totalParagraphs);
	let angleBonus = 0;

	const starRating = calculateStarRating(vaultStats.totalParagraphs, angleValue);
	let starRatingBonus = 0; 

  if (angleValue < 180 || angleValue >= 360) {
    // if the angle is more than a reflex angle
		angleBonus = (overallComplexityValue / (1.8275)) + (angleValue / 10);
		starRatingBonus = (angleValue * starRating) / 1.2;
	} else if (angleValue < 120 || angleValue > 180) {
		// if the angle is way obtuse, but not straight
		angleBonus = (overallComplexityValue / (1.8275 ** 2)) + (angleValue / 15);
		starRatingBonus = (angleValue * starRating) / 1.5;
	} else if (angleValue < 90 || angleValue > 120) {
		// if the angle is obtuse
		angleBonus = (overallComplexityValue / (1.8275 ** 3)) + (angleValue / 20);
		starRatingBonus = (angleValue * starRating) / 1.9;
	} else if (angleValue < 89) {
		// if the angle is an acute angle (just like in osu!)
		angleBonus = ((overallComplexityValue / (1.8275 ** 1)) + (angleValue / 10)) * -1;
		starRatingBonus = (angleValue * starRating) / 2.4;
  }
	
  const performanceValue: number = angleBonus + starRatingBonus + (combinedValue * (starRating / 2));
	  
  return performanceValue;
}  
