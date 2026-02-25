/*

  test.ts: the pp system used for update v1.7.0.
  this should be the final rewrite for this update, but that does not mean that there won't be any more rewrites for future systems.
  
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

    // context bonus
    let contextBonus = 0;

    if (sentencetoParagraphRatio >= 3) {
      contextBonus += (Math.log(sentencetoParagraphRatio) + Math.log(sentencetoParagraphRatio * 1.5)) * 2;
    } else {
      contextBonus += Math.log(sentencetoParagraphRatio) * 2;
    }

    value += contextBonus;

    value += ((wordToSentenceRatio * sentencetoParagraphRatio) / 5) / vaultStats.totalFiles;

    let fileToFolderRatio = await getAllFiles() / await getAllFolders();

    value += fileToFolderRatio;

    // add some value with the use of total characters typed in the vault
    let characterBonus = Math.log(vaultStats.totalChars) + (vaultStats.totalChars / 3000);

    value += characterBonus * Math.pow(Math.PI, 0.65);

    value += ((417 - (1 / 3)) / 4) * (1 - Math.pow(0.9975, plugin.settings.totalExecutionCount));

    return value;
  }

  async function calculateVaultRating(): Promise<number> {
    // vault rating function
    let value = 1;

    // for the multiplier of the value
    let vaultCleanlinessValue = await calculateVaultCleanliness(vaultStats.totalFiles, vaultStats.totalFolders, vaultStats.totalParagraphs);

    return value + (vaultCleanlinessValue / 9.95);
  }

  async function calculateStatRating(): Promise<number> {
    // stat rating function
    let value = 0;

    // get the bonus value of the vault's file count with mathematic logarithms
    value += Math.log(vaultStats.totalFiles) * Math.PI;

    // as well as making use of the vault's folders
    value += Math.log(vaultStats.totalFolders) * 1.5;

    // get the total amount of orphans in the vault
    let orphanCount: number = await getOrphanCount(app);

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

  // cleaner value handling
  if (!Number.isFinite(performanceValue) || performanceValue <= 0) {
    console.log("Invalid performance value. Setting to 0pp...");
    performanceValue = 0;
  }

  return performanceValue;
}
