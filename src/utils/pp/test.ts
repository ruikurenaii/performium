/*

  test.ts: the test version of the pp system.
  this will be an attempt to use some unused variables and rebalance them until it's ready for publish.
  certain variables will be commented out until it's possible for use.
  
*/

import PerformiumPlugin from "../../main";
import { calculateVaultStats } from "src/functions/vaultStats";

// the new evaluators used for the rewritten code
import { getOrphanCount } from "../values/newerEvaluators/orphanCount";
import { calculateVaultCleanliness } from "../values/newerEvaluators/vaultCleanliness";
import { getAllFiles, getAllFolders } from "../values/newerEvaluators/itemCount";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(plugin: PerformiumPlugin): Promise<number> {
  const app = plugin.app;

  let vaultStats = await calculateVaultStats(app);

  let performanceValue = 0;

  async function calculateReadability(): Promise<number> {
    // readability function
    let value = 0;

    // use various vault stats to make a readable value
    let wordToSentenceRatio = vaultStats.totalWords / vaultStats.totalSentences;
    let sentencetoParagraphRatio = vaultStats.totalSentences / vaultStats.totalParagraphs;

    value += (wordToSentenceRatio * sentencetoParagraphRatio) / vaultStats.totalFiles;

    let fileToFolderRatio = getAllFiles() / getAllFolders();

    value += fileToFolderRatio;

    // add some value with the use of total characters typed in the vault
    let characterBonus = Math.log(vaultStats.totalChars) + (vaultStats.totalChars / 2775);

    value += characterBonus * Math.pow(Math.PI, 2);

    value += ((417 - (1 / 3)) / 4) * (1 - Math.pow(0.9975, plugin.settings.totalExecutionCount));

    return value;
  }

  async function calculateVaultRating(): Promise<number> {
    // vault rating function
    let value = 1;

    // for the multiplier of the value
    let vaultCleanlinessValue = calculateVaultCleanliness(vaultStats.totalFiles, vaultStats.totalFolders, vaultStats.totalParagraphs);

    return value + (vaultCleanlinessValue / 9.95);
  }

  async function calculateStatRating(): Promise<number> {
    // stat rating function
    let value = 0;

    // get the bonus value of the vault's file count with mathematic logarithms
    value += Math.log(vaultStats.totalFiles) * Math.PI;

    // get the total amount of orphans in the vault
    let orphanCount: number = getOrphanCount(app);

    // apply it to the value as a penalty
    value -= orphanCount;

    return value;
  }

  // calculate the full value
  let readabilityValue = await calculateReadability();
  let vaultRatingValue = await calculateVaultRating();
  let statRatingValue = await calculateStatRating();

  performanceValue += ((readabilityValue + statRatingValue) * vaultRatingValue) / 1.1;

  console.log(performanceValue);

  // if the pp is below 0 and is a negative number
  if (performanceValue <= 0) {
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
