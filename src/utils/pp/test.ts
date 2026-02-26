/*

  test.ts: the test version of the pp system.
  this will be an attempt to fully rewrite the performance values and rebalance them until it's ready for publish.
  certain variables will be commented out until it's possible for use.
  
*/

import PerformiumPlugin from "../../main";
import { calculateVaultStats } from "src/functions/vaultStats";

// the new evaluators used for the rewritten code
import { getOrphanCount } from "../values/newerEvaluators/orphanCount";
import { calculateVaultCleanliness } from "../values/newerEvaluators/vaultCleanliness";
import { getAllFiles, getAllFolders } from "../values/newerEvaluators/itemCount";
// simport { countAllLinks, countAllWikiLinks } from "../values/newerEvaluators/linkCount";
import { getTotalWordCount } from "../values/newerEvaluators/newVaultStats";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(plugin: PerformiumPlugin): Promise<number> {
  const app = plugin.app;

  let vaultStats = await calculateVaultStats(app);

  let performanceValue = 0;

  let totalWords = await getTotalWordCount(app);

  async function calculateReadability(): Promise<number> {
    // readability function
    let value = 0;

    // make use of the character-to-word ratio
    let characterToWordRatio: number = totalWords / vaultStats.totalChars;

    // add a variable similar to the visual calculation of the cs (circle size) formula from the osu! game
    let wordRadiusValue = 64 * (1 - (0.7 * ((characterToWordRatio - 2.5) / 5)));

    // debug
    // console.log('wordRadiusValue: ' + wordRadiusValue);

    // add a bonus with the use of the recently made value
    let wordLengthMultiplier = Math.max(1.0, 1.0 + (30 - wordRadiusValue) / 40);

    // add it as a bonus
    value += wordRadiusValue * wordLengthMultiplier;

    return value;
  }

  async function calculateVaultRating(): Promise<number> {
    // vault rating function
    let value = 1;

    // for the multiplier of the value
    let vaultCleanlinessValue = await calculateVaultCleanliness(vaultStats.totalFiles, vaultStats.totalFolders, vaultStats.totalParagraphs);

    return value + (vaultCleanlinessValue / 9.95);
  }

  async function calculateInformability() {
    // function to get values from equations with uses of the vault stats
    let value = 1;

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

    return value
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

    console.log(value);

    // let wikiLinkCount = await countAllWikiLinks(app);
    // let allLinkCount = await countAllLinks(app);

    // let allLinkTowikiLinkRatio = allLinkCount / wikiLinkCount;
    // let wikiLinkToAllLinkRatio = wikiLinkCount / allLinkCount;

    // apply certain values as pieces of a penalty
    // value += ((allLinkTowikiLinkRatio + wikiLinkToAllLinkRatio) / Math.E) - 10;

    // add some value with the use of total characters typed in the vault
    let characterBonus = Math.log(vaultStats.totalChars) + (vaultStats.totalChars / 3000);

    value += characterBonus * Math.pow(Math.PI, 0.625);

    value += ((417 - (1 / 3)) / 4) * (1 - Math.pow(0.9975, plugin.settings.totalExecutionCount));

    return value;
  }

  // calculate the full value
  let readabilityValue = await calculateReadability();
  let vaultRatingValue = await calculateVaultRating();
  let statRatingValue = await calculateStatRating();
  let informabilityValue = await calculateInformability();

  performanceValue += ((readabilityValue + statRatingValue + informabilityValue) * vaultRatingValue) / 1.1;

  // debug
  console.log('readabilityValue: ' + readabilityValue);
  console.log('statRatingValue: ' + statRatingValue);
  console.log('informabilityValue: ' + informabilityValue);
  console.log('vaultRatingValue: ' + vaultRatingValue);

  // console.log('performanceValue: ' + performanceValue);

  // cleaner value handling
  if (!Number.isFinite(performanceValue) || performanceValue <= 0) {
    console.log("Invalid performance value. Setting to 0pp...");
    performanceValue = 0;
  }

  return performanceValue;
}
