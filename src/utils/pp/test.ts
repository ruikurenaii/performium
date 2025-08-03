/*

  test.ts: the test version of the pp system.
  
*/

import PerformiumPlugin from "../../main";
import { calculateVaultStats } from "../../functions/vaultStats";


// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(plugin: PerformiumPlugin): Promise<number> {
  const app = plugin.app;
  
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

  // pi, obviously
  const pi = Math.PI;

  const AIM_MULTIPLIER = 1.02;
  const SPEED_MULTIPLIER = 1.01;
  const STRAIN_MULTIPLIER = 1.01;
  const ACCURACY_MULTIPLIER = 1.02;
  const FLASHLIGHT_MULTIPLIER = 1.01;

  const OVERALL_MULTIPLIER = 1.05;

  function calculateAim() {
    let aimValue = 0;
    return aimValue * AIM_MULTIPLIER;
  }

  function calculateSpeed() {
    let speedValue = 0;
    return speedValue * SPEED_MULTIPLIER;
  }

  function calculateStrain() {
    let strainValue = 0;
    return strainValue * STRAIN_MULTIPLIER;
  }

  function calculateAccuracy() {
    let accuracyValue = 0;
    return accuracyValue * ACCURACY_MULTIPLIER;
  }

  function calculateFlashlight() {
    let flashValue = 0;
    return flashValue * FLASHLIGHT_MULTIPLIER;
  }

  function calculateCombinedPerformance() {
    const aim = calculateAim();
    const speed = calculateSpeed();
    const strain = calculateStrain();
    const accuracy = calculateAccuracy();
    const flashlight = calculateFlashlight();

    return (aim + speed + strain + accuracy + flashlight) * OVERALL_MULTIPLIER;
  }

  let performanceValue: number = calculateCombinedPerformance();

  // if the pp is below 0 and is a negative number
  if (performanceValue < 0) {
    console.log("The value is 0pp or negative... Setting it to 0pp...")
	performanceValue = 0;
  }

  return performanceValue;
}
