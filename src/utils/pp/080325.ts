/*

  080325.ts: the pp system used for v1.6.0.
  
*/

import PerformiumPlugin from "../../main";
import { calculateVaultStats } from "../../functions/vaultStats";
import { calculateVaultAngle } from "../values/vaultAngle";
import { calculateStarRating } from "../values/starRating";
import { calculateVaultDifficultyFactors } from "../values/vaultDifficultyFactors";
import { calculateVaultPenalties } from "../values/vaultPenalties"
import { calculateVaultObjects } from "../values/vaultObjects";
import { calculateBurstScore } from "../values/burstScore";
import { calculateVaultBpm } from "../values/vaultBpm";
import { calculateWordComplexityStats } from "../values/wordComplexityStatistics";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(plugin: PerformiumPlugin): Promise<number> {
  const app = plugin.app;

  const wordComplexityStatistics = await calculateWordComplexityStats(app);
  
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

  const burstScore = await calculateBurstScore({
    totalFiles: totalFiles,
    totalParagraphs: totalParagraphs,
    averageSentencesPerParagraph: averageSentencesPerParagraph,
    averageWordsPerSentence: averageWordsPerSentence
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

  // multipliers!!!
  const AIM_MULTIPLIER = 1.02;
  const SPEED_MULTIPLIER = 1.01;
  const STRAIN_MULTIPLIER = 1.01;
  const ACCURACY_MULTIPLIER = 1.02;

  // pi, obviously
  const pi = Math.PI;

  // ppv3 rewrite when? lmao
  let approachRate = difficultyFactors.AR;
  let overallDifficulty = difficultyFactors.OD;
  let circleSize = difficultyFactors.CS;
  let healthDrain = difficultyFactors.HP;

  // length bonus
  let lengthBonus = 0;

  if (totalWords <= 2000) {
    lengthBonus = 0.95 + 0.4 * (totalWords / 2000);
  } else {
    lengthBonus = 0.95 + 0.4 + 0.5 * Math.log10(totalWords / 2000);
  }

  let totalHeaders: number = 0;
  let totalLinks: number = 0;
  let totalTasks: number = 0;

  for (const file of this.app.vault.getMarkdownFiles()) {
    const content = await this.app.vault.cachedRead(file);

    // headers count (not to be confused by tags)
    const headers = content.match(/^#{1,6}\s+/gm);

    // link counts (wiki ahh and markdown ones)
    const wikiLinks = content.match(/\[\[.*?\]\]/g);
    const mdLinks = content.match(/\[.*?\]\(.*?\)/g);

    // tasks count (checklists and stuff)
    const tasks = content.match(/^\s*-\s*\[.\]/gm);

    totalHeaders += headers ? headers.length : 0;
    totalLinks += (wikiLinks ? wikiLinks.length : 0) + (mdLinks ? mdLinks.length : 0);
    totalTasks += tasks ? tasks.length : 0;
  }

  const vaultBpm = await calculateVaultBpm(app, totalTags, totalWords, totalFiles);

  const totalFocusTime = plugin.settings.totalFocusTime ?? 0;
  const installTimestamp = plugin.settings.installTimestamp ?? Date.now();
  const totalPluginTime = Date.now() - installTimestamp;

  const totalExecutionCount = plugin.settings.totalExecutionCount;

  const focusedTime = Math.trunc(totalFocusTime % (1000 * 60 * 60)) / (1000 * 60);
  const overallTime = Math.trunc(totalPluginTime % (1000 * 60 * 60)) / (1000 * 60);

  const angleValue = calculateVaultAngle(vaultStats.totalFiles, vaultStats.totalFolders, vaultStats.totalParagraphs);

  const strainCount = (averageSentenceLength * averageSentencesPerParagraph) + (longestSentenceLength * 0.25) + (longestParagraphLength * 0.1);

  // declare these separate, initial values
  let aimValue = (Math.sqrt(totalLinks) + Math.sqrt(totalHeaders / 4)) * AIM_MULTIPLIER;
  let accuracyValue = angleValue > 0 ? ((angleValue / 360) * 100 + (1 / (angleValue / 360))) * ACCURACY_MULTIPLIER : 0;
  let speedValue = (totalWords / (strainCount * 1.25)) * SPEED_MULTIPLIER;
  let strainValue = (totalWords + totalHeaders * 2 + totalTasks * 3) * STRAIN_MULTIPLIER;

  const importance = totalWords + totalLinks * 10;
  let flashlightValue = (totalWords / 100) * Math.log2(importance + 1);
	
  let starRating = calculateStarRating(totalParagraphs, angleValue);

  // add the wide angle bonus
  const clampedAngleBonus = Math.max(pi / 6, Math.min((5 * pi) / 6, angleValue));
  const finalAngleValue = Math.pow(Math.sin((3 / 4) * (clampedAngleBonus - pi / 6)), 2);

  // scale aim value with accuracy value
  aimValue *= accuracyValue;

  // punish aim and speed pp with slow vault bpm
  aimValue /= Math.max(0.1, 1 + ((vaultBpm - 200) / 98));
  speedValue /= Math.max(0.1, 1 + ((vaultBpm - 200) / 102) * 0.97775); 

  // scale aim value with approach rate
  aimValue *= 1 + 0.04 * ((12 - approachRate) / 2);

  // scale aim pp with the wide angle bonus
  aimValue *= 1 + 0.25 * (finalAngleValue / 152.5);

  // add tag bonus to speed pp
  speedValue += Math.log10(totalTags);

  // scale flashlight pp with length bonus
  if (lengthBonus >= 125) {
	flashlightValue += 125 + ((lengthBonus - 125) / 2);
  } else {
	flashlightValue += lengthBonus;
  }

  if (averageSentencesPerFile > 12) {
    flashlightValue *= 1 + 0.15 * (12 - averageSentencesPerFile);
  } else {
    flashlightValue *= 1 + 0.075 * (averageSentencesPerFile - 12);
  }

  // add file count bonus to strain pp
  strainValue += (100 - (1 / 3)) * (1 - (0.994 ** totalFiles));

  // for the speed pp bonus (ranging from 200 to 330bpm)
  let minSpeedBpmBonus = 75;
  let maxSpeedBpmBonus = 45;
  const speedBpmBalancingFactor = 40;

  const bpmStreamClicks = (vaultBpm / 60) * 4;
  let deltaTime: number = 1000 / bpmStreamClicks;

  let deltaClampedValue = Math.max(maxSpeedBpmBonus, deltaTime);

  if (deltaClampedValue < minSpeedBpmBonus) {
    speedValue += 1 + Math.pow((maxSpeedBpmBonus = deltaClampedValue) / speedBpmBalancingFactor, 2);
  } else {
    speedValue += 1;
  }

  const wordComplexityBonus: number = wordComplexityStatistics.averageWordComplexity * (1 + (wordComplexityStatistics.wordDifficultyPercentage / 200));

  // scale strain with the percentage of difficult words
  strainValue *= 1 + (Math.sqrt(wordComplexityBonus) / 150);

  // scale aim and accuracy pp (no game modifiers support at the moment...)
  aimValue *= 1.08;
  accuracyValue *= 1.08;

  // scale the strain pp with high precision (if cs > 5.5)
  let objectRadius = 54.4 - 4.48 * circleSize;
  let smallCircleSizeBonus: number = Math.max(1.0, 1.0 + (30 - objectRadius) / 40);
  strainValue *= smallCircleSizeBonus;

  // add note rhythm to the system
  const rawRhythm = (averageSentencesPerParagraph * averageWordsPerSentence) / averageSentenceLength;
  const rhythmScore = Math.min(10, Math.max(0, rawRhythm * 1.8));
  const noteRhythmMultiplier = 1.0;

  // apply this rhythm to aim and speed values
  aimValue *= (1 + (rhythmScore / 10)) * (noteRhythmMultiplier / 1.1);
  speedValue *= (1 + (rhythmScore / 10)) * (noteRhythmMultiplier / 0.975);
  accuracyValue *= (1 + (rhythmScore / 10)) * (noteRhythmMultiplier / 0.95);

  // scale aim and speed pp with high ar bonus
  aimValue *= 1 + 0.04 * (approachRate - 12);

  // add a bonus for slider complexity
  const sliderBonus = 1 + ((0.2 * Math.log2(1 + averageWordsPerSentence) + 0.2 * Math.log2(1 + averageSentenceLength) + 0.15 * Math.log2(1 + longestSentenceLength) + 0.15 * Math.log2(1 + longestParagraphLength) + 0.1 * Math.log2(1 + totalTags) + 0.2 * Math.log2(1 + vaultObjects.sliders)) / 5);
  const sliderDensity = vaultObjects.sliders / (totalWords / (pi * 100));
  const sliderBonusPenalty = sliderDensity > 0.1 ? 0.25 : vaultObjects.sliders === 0 ? 0.15 : 0;
  const sliderComplexityMultiplier = sliderBonus * (1 - sliderBonusPenalty);

  aimValue *= sliderComplexityMultiplier / (1.2 * 125);
  strainValue *= sliderComplexityMultiplier / (1.1 * 125);
	
  let combinedValue = (
    Math.pow(aimValue, 1.1) +
    Math.pow(speedValue, 1.1) +
    Math.pow(strainValue, 1.1) + flashlightValue
  ) * (accuracyValue / 100);

  // scale the total pp with star rating
  combinedValue += 1 + (starRating / 100);
	
  // add bonus pp based on how many total characters a user's vault contains
  // multiply it depending on how clean the user's vault is (using the vault angle, with 360 degrees describing the cleanest vault)
  const charAngleBonus: number = (totalChars / 968.75) * (1 + (0.45 * (angleValue / 360)));
	
  // add bonus pp based on how many times the performance points calculation has been executed.
  const executionBonus: number = ((417 - (1 / 3)) / 2) * (1 - Math.pow(0.9975, totalExecutionCount));

  // add a file count pp bonus, which should stop at around 27,608 files
  const fileCountBonus: number = (417 - (1 / 3)) * (1 - Math.pow(0.9996, totalFiles));

  let performanceValue: number = Math.pow(combinedValue, 0.565);

  // add bonuses for the final pp
  performanceValue += charAngleBonus + executionBonus;

  // add a bit more pp to the final value
  performanceValue *= 1.006;

  // add the time bonus pp to the final value
  performanceValue += (Math.sqrt(Math.sqrt(totalFocusTime / (Math.sqrt(totalFocusTime) / (totalFocusTime * 0.00025)))) ** 1.05) / 4;

  // if the pp is below 0 and is a negative number
  if (performanceValue < 0) {
    console.log("The calculated value is 0pp or negative... Setting it to 0pp...")
	  performanceValue = 0;
  } else if (Number.isNaN(performanceValue)) {
    // otherwise, if the value is not a number
    console.log("The calculated value is not a number... Setting it to 0pp...");
    performanceValue = 0;
  } else if (performanceValue = Infinity) {
    // if the value doesn't meet any of the previous conditions, execute this
    console.log("The calculated value is an infinite number, setting it to 0pp..");
    performanceValue = 0;
  } else {
    performanceValue = performanceValue;
  }

  return performanceValue;
}
