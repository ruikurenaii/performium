/*

  test.ts: the test version of the pp system.
  
*/

import { App } from "obsidian";
import { calculateVaultStats } from "../../functions/vaultStats";
import { calculateVaultAngle } from "../values/vaultAngle";
import { calculateStarRating } from "../values/starRating";
import { calculateVaultDifficultyFactors } from "../../functions/vaultDifficultyFactors";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(app: App): Promise<number> {
  const vaultStats = await calculateVaultStats(app);
  const difficultyFactors = await calculateVaultDifficultyFactors(vaultStats);

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

  let a = 1.7349285739;
  let b = 1.6893741205;
  let c = 1.6228493017;
  let d = 1.3428593012;
  let e = 1.8753012946;
  let f = 1.2109483725;

  const sentenceComplexityValue = vaultStats.totalWords / vaultStats.totalSentences;
  const sentenceDensityValue = vaultStats.totalSentences / vaultStats.totalWords;
  const fileComplexityValue = sentenceComplexityValue * vaultStats.averageWordsPerFile;
  const wordComplexityValue = vaultStats.totalChars / vaultStats.totalWords;

  let sentenceBonus = 0;

  if (vaultStats.averageSentencesPerFile > vaultStats.averageSentencesPerParagraph) {
    sentenceBonus = vaultStats.averageSentencesPerFile / vaultStats.averageSentencesPerParagraph;
  } else if (vaultStats.averageSentencesPerFile < vaultStats.averageSentencesPerParagraph) {
	  sentenceBonus = vaultStats.averageSentencesPerParagraph / vaultStats.averageSentencesPerFile;
  }

  const readabilityMultiplier = 100 - ((vaultStats.averageWordsPerSentence * (vaultStats.averageCharsPerSentence / vaultStats.averageWordsPerSentence)) / 10);
  const readabilityBonus = (sentenceComplexityValue / sentenceDensityValue) * (readabilityMultiplier / 10);
	
  const overallComplexityValue = a * sentenceComplexityValue + b * sentenceDensityValue + c * (vaultStats.totalWords / vaultStats.totalFiles) + d * wordComplexityValue + e * sentenceBonus + f * readabilityBonus;


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

  const scale = (v: number, max: number) => Math.min(100, (v / max) * 100);

  const aimValue = scale(aim, 79.2374918532);
  const strainValue = scale(strain, 149.6821400294);
  const speedValue = scale(speed, 199.3149785217);
  const sliderValue = scale(slider, 99.8703294731);
  const accuracyValue = scale(accuracy, 119.1038649715);

  const combinedValue: number = aimValue + strainValue + speedValue + sliderValue + accuracyValue;

	const angleValue = calculateVaultAngle(vaultStats.totalFiles, vaultStats.totalFolders, vaultStats.totalParagraphs);
	let angleBonus = 0;

	const starRating = calculateStarRating(vaultStats.totalParagraphs, angleValue);
	let starRatingBonus = 0; 

  if (angleValue < 180 || angleValue >= 360) {
    // if the angle is more than a straight angle, but a reflex angle
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

	const averageToLongestSentenceRatio = longestSentenceLength / averageSentenceLength;
	const averageToLongestParagraphRatio = longestParagraphLength / averageParagraphLength;
	
	const roughnessPenalty = (((sentenceComplexityValue / sentenceDensityValue) * (sentenceDensityValue / sentenceComplexityValue)) * scale(combinedValue / 6.9420, averageToLongestSentenceRatio)) / -1;
	
  const performanceValue: number = ((angleBonus + starRatingBonus) / 1.85) + (combinedValue * (starRating / 2)) + (roughnessPenalty / 3.1415926535);
	  
  return performanceValue;
}  
