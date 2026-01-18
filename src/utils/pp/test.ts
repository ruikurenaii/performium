/*

  test.ts: the test version of the pp system.
  Just a reminder though: This is experimental, it'll more likely run into issues, depending on the vault.
  
*/

import PerformiumPlugin from "../../main";

import { getVaultAge } from "../values/newEvaluators/vaultAge";
import { calculateVaultStats } from "../../functions/vaultStats";
// import { calculateWPM } from "../values/newEvaluators/wordsPerMinute";
import { calculateVaultDifficultyFactors } from "../values/vaultDifficultyFactors";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(plugin: PerformiumPlugin): Promise<number> {
  const app = plugin.app;
  
  const vaultStats = await calculateVaultStats(app);

  const vaultAge = getVaultAge(app);

  // const difficultyFactors = await calculateVaultDifficultyFactors(vaultStats);

  const totalFocusTime = plugin.settings.totalFocusTime || 0;
  
  const totalFiles = vaultStats.totalFiles;
  // const totalFolders = vaultStats.totalFolders;
  const totalWords = vaultStats.totalWords;
  const totalChars = vaultStats.totalChars;
  // const totalSentences = vaultStats.totalSentences;
  // const totalParagraphs = vaultStats.totalParagraphs;
  // const totalTags = vaultStats.totalTags;
  // const averageWordsPerFile = vaultStats.averageWordsPerFile;
  // const averageSentencesPerFile = vaultStats.averageSentencesPerFile;
  // const averageWordsPerSentence = vaultStats.averageWordsPerSentence;
  // const averageSentencesPerParagraph = vaultStats.averageSentencesPerParagraph;
  // const averageCharsPerSentence = vaultStats.averageCharsPerSentence;
  // const averageParagraphLength = vaultStats.averageParagraphLength;
  // const averageSentenceLength = vaultStats.averageSentenceLength;
  // const longestSentenceLength = vaultStats.longestSentenceLength;
  // const longestParagraphLength = vaultStats.longestParagraphLength;

  // pi, obviously
  const pi = Math.PI;

  const AIM_MULTIPLIER = 1.02;
  const SPEED_MULTIPLIER = 1.01;
  const STRAIN_MULTIPLIER = 1.01;
  const ACCURACY_MULTIPLIER = 1.02;
  const FLASHLIGHT_MULTIPLIER = 1.01;

  const OVERALL_MULTIPLIER = 1.00;

  // const circleSize = difficultyFactors.CS;

  async function calculateAim() {
    let aimValue = 0;

    const vaultFiles = app.vault.getFiles();
    const vaultFolders = app.vault.getAllFolders();

    aimValue += vaultFiles.length / vaultFolders.length;

    return aimValue * AIM_MULTIPLIER;
  }

  async function calculateSpeed() {
    let speedValue = 0;

    // comment out these unused variables

    // const averageNotesPerDay = totalFiles / vaultAge.daysSinceCreation;
    // const averageWordsPerDay = totalWords / vaultAge.daysSinceCreation;

    // speedValue += averageNotesPerDay;
    // speedValue += averageWordsPerDay;

    speedValue += totalChars / totalWords;

    return speedValue * SPEED_MULTIPLIER;
  }

  async function calculateStrain() {
    let strainValue = 0;

    for (const file of this.app.vault.getMarkdownFiles()) {
      const content = await this.app.vault.cachedRead(file);

      const wikiLinks = content.match(/\[\[.*?\]\]/g);
      const mdLinks = content.match(/\[.*?\]\(.*?\)/g);

      const totalLinks = wikiLinks + mdLinks;

      strainValue += totalWords * ((totalLinks + 1) / 10);

      return strainValue * STRAIN_MULTIPLIER;
    }
  }

  async function calculateAccuracy() {
    let accuracyValue = 0;

    const totalNotes = this.app.vault.getMarkdownFiles().length;

    return accuracyValue * ACCURACY_MULTIPLIER;
  }

  async function calculateFlashlight() {
    let flashValue = 0;

    const vaultTime = vaultAge.millisecondsSinceCreation;
    const focusTime = totalFocusTime;

    if (focusTime > 0) {
      flashValue = (vaultTime - focusTime) / 3600000;
    } else {
      flashValue = 1; // Default value if no focus time is set
    }

    return flashValue * FLASHLIGHT_MULTIPLIER;
  }

  async function calculateCombinedPerformance() {
    const aim = await calculateAim() ?? 0;
    const speed = await calculateSpeed() ?? 0;
    const strain = await calculateStrain() ?? 0;
    const accuracy = await calculateAccuracy() ?? 0;
    const flashlight = await calculateFlashlight() ?? 0;

    // add the combined value
    let calculatedPerformance = ((aim ** 1.1) + (speed ** 1.1) + (strain ** 1.1) + (accuracy ** 1.1) + (flashlight ** 1.1)) ** (1 / 1.1);

    calculatedPerformance *= OVERALL_MULTIPLIER;

    const totalExecutionCount = plugin.settings.totalExecutionCount;
    const executionBonus: number = ((417 - (1 / 3)) / 2) * (1 - Math.pow(0.9975, totalExecutionCount));

    const executionBonusMultiplier = 1 + (executionBonus / 100);
    calculatedPerformance *= executionBonusMultiplier;

    calculatedPerformance *= 1 + (pi / 1000);

    return calculatedPerformance;
  }

  let performanceValue: number = await calculateCombinedPerformance();

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
    console.log("The calculated value is an infinite number, setting it to 0pp..")
  }
  return performanceValue;
}
