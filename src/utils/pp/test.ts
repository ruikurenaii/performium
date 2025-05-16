/*

  test.ts: the test version of the pp system.
  
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

  const focusedTime = Math.trunc(totalFocusTime % (1000 * 60 * 60)) / (1000 * 60);
  const overallTime = Math.trunc(totalPluginTime % (1000 * 60 * 60)) / (1000 * 60);

  let aimValue = Math.sqrt(totalLinks);
  let accuracyValue = Math.min(100, (focusedTime / overallTime) * 100);
  let speedValue = totalWords / overallTime;
  let strainValue = totalWords + totalHeaders * 2 + totalTasks * 3;

  const importance = totalWords + totalLinks * 10;
  let flashlightValue = (totalWords / 100) * Math.log2(importance + 1);

  const angleValue = calculateVaultAngle(vaultStats.totalFiles, vaultStats.totalFolders, vaultStats.totalParagraphs);

  const finalAccuracyValue = (accuracyValue * 0.05) + (((angleValue / 360) * 100) * 0.95);

  let starRating = calculateStarRating(totalParagraphs, angleValue);

  // add the wide angle bonus
  const clampedAngleBonus = Math.max(pi / 6, Math.min((5 * pi) / 6, angleValue));
  const finalAngleValue = Math.pow(Math.sin((3 / 4) * (clampedAngleBonus - pi / 6)), 2);

  // scale aim value with accuracy value
  aimValue *= finalAccuracyValue;

  // scale aim value with approach rate
  aimValue *= 1 + 0.04 * ((12 - approachRate) / 2);

  // scale aim pp with the wide angle bonus
  aimValue *= 1 + 0.25 * (finalAngleValue / 150);

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

  // scale aim and accuracy pp (no game modifiers support at the moment...)
  aimValue *= 1.08;
  accuracyValue *= 1.08;

  // scale aim and speed pp with high ar bonus
  aimValue *= 1 + 0.04 * (approachRate - 12); 

  let combinedValue = (
    Math.pow(aimValue, 1.1) +
    Math.pow(speedValue, 1.1) +
    Math.pow(strainValue, 1.1) + flashlightValue
  ) * (finalAccuracyValue / 100);

  // scale the combined pp with star rating
  combinedValue += 1 + (starRating / 100);

  // add time bonus to the overall pp value
  combinedValue += (Math.sqrt(Math.sqrt(totalFocusTime / (Math.sqrt(totalFocusTime) / totalFocusTime)))) / 10;

  let performanceValue: number = Math.sqrt(combinedValue) * 3.25;

  // if the pp is below 0 and is a negative number
  if (performanceValue < 0) {
    console.log("The value is 0pp or negative... Setting it to 0pp...");
    performanceValue = 0;
  }

  return performanceValue;
}
