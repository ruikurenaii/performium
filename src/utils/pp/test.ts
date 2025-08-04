/*

  test.ts: the test version of the pp system.
  
*/

import PerformiumPlugin from "../../main";

import { getVaultAge } from "../values/newEvaluators/vaultAge";
import { calculateVaultStats } from "../../functions/vaultStats";
import { calculateWPM } from "../values/newEvaluators/wordsPerMinute";
import { calculateVaultDifficultyFactors } from "../values/vaultDifficultyFactors";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(plugin: PerformiumPlugin): Promise<number> {
  const app = plugin.app;
  
  const vaultStats = await calculateVaultStats(app);

  const vaultAge = getVaultAge(app);

  const difficultyFactors = await calculateVaultDifficultyFactors(vaultStats);

  const totalFocusTime = plugin.settings.totalFocusTime || 0;
  
  const totalFiles = vaultStats.totalFiles;
  // const totalFolders = vaultStats.totalFolders;
  const totalWords = vaultStats.totalWords;
  // const totalChars = vaultStats.totalChars;
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

  const OVERALL_MULTIPLIER = 1.05;

  const circleSize = difficultyFactors.CS;

  async function calculateAim() {
    let aimValue = 0;

    for (const file of this.app.vault.getMarkdownFiles()) {
      const content = await this.app.vault.cachedRead(file);

      const wikiLinks = content.match(/\[\[.*?\]\]/g);
      const mdLinks = content.match(/\[.*?\]\(.*?\)/g);

      const totalLinks = wikiLinks + mdLinks;

      aimValue += totalLinks;

      const linkDistance = totalLinks / ((wikiLinks.length * 0.8) + (mdLinks.length * 1.1));
      aimValue += linkDistance;

      return aimValue * AIM_MULTIPLIER;
    }
  }

  async function calculateSpeed() {
    let speedValue = 0;

    const wpm = await calculateWPM(plugin);

    speedValue += wpm;

    const averageNotesPerDay = totalFiles / vaultAge.daysSinceCreation;

    speedValue += averageNotesPerDay;

    return speedValue * SPEED_MULTIPLIER;
  }

  async function calculateStrain() {
    let strainValue = 0;

    for (const file of this.app.vault.getMarkdownFiles()) {
      const content = await this.app.vault.cachedRead(file);

      const wikiLinks = content.match(/\[\[.*?\]\]/g);
      const mdLinks = content.match(/\[.*?\]\(.*?\)/g);

      const totalLinks = wikiLinks + mdLinks;

      strainValue += totalWords * (totalLinks + 1);

      return strainValue * STRAIN_MULTIPLIER;
    }
  }

  async function calculateAccuracy() {
    let accuracyValue = 0;

    const totalNotes = this.app.vault.getMarkdownFiles().length;

    accuracyValue += totalNotes * (1 + (circleSize / 10));

    let objectRadius = 54.4 - 4.48 * circleSize;
    let smallCircleSizeBonus: number = Math.max(1.0, 1.0 + (30 - objectRadius) / 40);
    
    accuracyValue *= smallCircleSizeBonus;

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

    let calculatedPerformance = Math.pow((aim + speed + strain + accuracy + flashlight) * OVERALL_MULTIPLIER, 1 + (pi / 150));

    const totalExecutionCount = plugin.settings.totalExecutionCount;
    const executionBonus: number = ((417 - (1 / 3)) / 2) * (1 - Math.pow(0.9975, totalExecutionCount));

    const executionBonusMultiplier = 1 + (executionBonus / 100);
    calculatedPerformance *= executionBonusMultiplier;

    return calculatedPerformance;
  }

  let performanceValue: number = await calculateCombinedPerformance();

  // if the pp is below 0 and is a negative number
  if (performanceValue < 0) {
    console.log("The value is 0pp or negative... Setting it to 0pp...")
	  performanceValue = 0;
  } else if (Number.isNaN(performanceValue)) {
    // otherwise, if the value is not a number
    console.log("The value is not a number... Setting it to 0pp...");
    performanceValue = 0;
  }

  return performanceValue;
}
