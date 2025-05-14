/*

  test.ts: the test version of the pp system.
  
*/

import { TFile } from "obsidian";
import PerformiumPlugin from "../../main";
import { calculateVaultStats } from "../../functions/vaultStats";
import { calculateVaultAngle } from "../values/vaultAngle";
import { calculateStarRating } from "../values/starRating";
import { calculateVaultDifficultyFactors } from "../values/vaultDifficultyFactors";
import { calculateVaultPenalties } from "../values/vaultPenalties"
import { calculateVaultObjects } from "../values/vaultObjects";
import { calculateBurstScore } from "../values/burstScore";
import { getDaysSinceLastEdit } from "src/functions/getDaysSinceLastEdit";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(plugin: PerformiumPlugin): Promise<number> {
  const app = plugin.app;
  
  const vaultStats = await calculateVaultStats(app);
  const difficultyFactors = await calculateVaultDifficultyFactors(vaultStats);

  const lastEdit = getDaysSinceLastEdit()
  
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

  const totalFocusTime = plugin.settings.totalFocusTime ?? 0;
  const totalPluginTime = plugin.settings.totalPluginTime ?? 0;

  const focusedTime = Math.trunc(totalFocusTime % (1000 * 60 * 60)) / (1000 * 60);
  const overallTime = Math.trunc(totalPluginTime % (1000 * 60 * 60)) / (1000 * 60);

  let aimValue = Math.sqrt(totalLinks);
  const accuracyValue = Math.min(100, (focusedTime / overallTime) * 100);
  let speedValue = totalWords / overallTime;
  let strainValue = totalWords + totalHeaders * 2 + totalTasks * 3;
  let flashlightValue = (daysSinceLastEdit)

  const angleValue = calculateVaultAngle(vaultStats.totalFiles, vaultStats.totalFolders, vaultStats.totalParagraphs);

  const finalAccuracyValue = (accuracyValue * 0.75) + (((angleValue / 360) * 100) * 0.25);

  const combinedValue = (
    Math.pow(aimValue, 1.1) +
    Math.pow(speedValue, 1.1) +
    Math.pow(strainValue, 1.1)
  ) * (finalAccuracyValue / 100);

  // scale aim value with accuracy value
  aimValue *= finalAccuracyValue;

  // scale aim value with approach rate
  aimValue *= 1 + 0.04 * (12 - approachRate);

  let performanceValue: number = combinedValue;

  // if the pp is below 0 and is a negative number
  if (performanceValue < 0) {
    performanceValue = 0;
  }

  return performanceValue;
}