/*

  test.ts: the test version of the pp system.
  
*/

import { App } from "obsidian";
import PerformiumPlugin from "../../main";
import { calculateVaultStats } from "../../functions/vaultStats";
import { calculateVaultAngle } from "../values/vaultAngle";
import { calculateStarRating } from "../values/starRating";
import { calculateVaultDifficultyFactors } from "../values/vaultDifficultyFactors";
import { calculateVaultPenalties } from "../values/vaultPenalties"
import { calculateVaultObjects } from "../values/vaultObjects";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(plugin: PerformiumPlugin): Promise<number> {
  const app = plugin.app;
  
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
  
  const vaultPenalties = await calculateVaultPenalties({
    totalFiles: totalFiles,
    totalFolders: totalFolders,
    totalWords: totalWords,
    totalParagraphs: totalParagraphs
  });

  const vaultObjects = await calculateVaultObjects({
    totalFiles: totalFiles,
    totalWords: totalWords,
    averageParagraphLength: averageParagraphLength,
    averageSentencesPerParagraph: averageSentencesPerParagraph,
	averageWordsPerSentence: averageWordsPerSentence,
	longestSentenceLength: longestSentenceLength,
	longestParagraphLength: longestParagraphLength,
	averageWordsPerFile: averageWordsPerFile,
	totalSentences: totalSentences
  });
  
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
  
  let aimValue = scale(aim, 79.2374918532);
  let strainValue = scale(strain, 149.6821400294);
  let speedValue = scale(speed, 199.3149785217);
  let sliderValue = scale(slider, 99.8703294731);
  let accuracyValue = scale(accuracy, 119.1038649715);

  aimValue *= 1 + ((vaultObjects.circles + (vaultObjects.sliders * 2) + (vaultObjects.spinners / 2) / 1000));

  sliderValue *= 1 + ((vaultObjects.sliders * 2.25) / 1000);
  
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
  
  const ArBonus = (combinedValue * 0.1) * (1 + (difficultyFactors.AR / 10));
  const OdBonus = combinedValue * (difficultyFactors.OD * (difficultyFactors.AR / 10));
  
  const factorBonus = Math.pow(ArBonus, 0.45) + Math.pow(OdBonus, 0.575);
  
  const overallPenalty = vaultPenalties.shit + Math.pow(vaultPenalties.meh, 0.6666666667) + Math.pow(vaultPenalties.okay, 0.3333333333);
  
  const totalFocusTime = plugin.settings.totalFocusTime ?? 0;
  
  const timeBonus: number = Math.sqrt(Math.sqrt(totalFocusTime / (Math.sqrt(totalFocusTime) / totalFocusTime)));

  // const bonusValue = (417 - (1 / 3)) * (1 - (0.995 ** Math.min(1000, totalFiles)));
  const bonusValue = (417 - (1 / 3)) * (1 - (0.9996 ** totalFiles));
  
  const performanceValue: number = ((angleBonus + starRatingBonus) / 2.05) + (combinedValue * (starRating / 2.3)) + (roughnessPenalty * (3.1415926535 / 0.875)) + (factorBonus / (2.7182818284 * 1.05)) + (overallPenalty / -1.1) + (timeBonus / 9.8) + bonusValue;
  
  return performanceValue;
}
