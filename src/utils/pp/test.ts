/*

  test.ts: the test version of the pp system.
  this will be an attempt to fully rewrite the performance values and rebalance them until it's ready for publish.
  while it might use some older evaluators, most of the code uses the new ones.
  certain variables will be commented out until it's possible for use.
  
*/

import PerformiumPlugin from "../../main";
import { calculateVaultStats } from "src/functions/vaultStats";

// the new evaluators used for the rewritten code
import { getOrphanCount } from "../values/newerEvaluators/orphanCount";
import { calculateVaultCleanliness } from "../values/newerEvaluators/vaultCleanliness";
import {
	getAllFiles,
	getAllFolders,
} from "../values/newerEvaluators/itemCount";
// import { countAllLinks, countAllWikiLinks } from "../values/newerEvaluators/linkCount";
import { getFileExtensionCount } from "src/functions/getFileExtensionCount";
import {
	getTotalSentences,
	getTotalWordCount,
} from "../values/newerEvaluators/newVaultStats";
import { getListItemCount } from "../values/newerEvaluators/listItemCount";
import { getTaskCount } from "../values/newerEvaluators/taskCount";

// the function to calculate the pp values from the entire vault (confusion, my bad)
export async function calculatePerformance(
	plugin: PerformiumPlugin,
): Promise<number> {
	const app = plugin.app;

	const vaultStats = await calculateVaultStats(app);

	let performanceValue = 0;

	const totalWords = await getTotalWordCount(app);
	const totalSentences = vaultStats.totalSentences;
	const totalFiles = vaultStats.totalFiles;
	const totalFolders = vaultStats.totalFolders;

	const characterToWordRatio = vaultStats.totalChars / totalWords;
	const wordToSentenceRatio = totalWords / totalSentences;
	const sentenceToParagraphRatio = totalSentences / vaultStats.totalParagraphs;

	// -------------------------
	// CALCULATORS
	// -------------------------

	function calculateReadability(): number {
		const wordRadiusValue = 64 * (1 - 0.7 * ((characterToWordRatio - 2.5) / 5));

		const wordLengthMultiplier = Math.max(
			1.0,
			1.0 + (30 - wordRadiusValue) / 40,
		);

		return wordRadiusValue * wordLengthMultiplier;
	}

	async function calculateVaultRating(): Promise<number> {
		let baseMultiplier = 1;

		const vaultCleanlinessValue = await calculateVaultCleanliness(
			totalFiles,
			totalFolders,
			vaultStats.totalParagraphs,
		);

		baseMultiplier += vaultCleanlinessValue / 9.95;

		let taskCount = await getTaskCount(this.app);

		baseMultiplier += taskCount.completedTasks / taskCount.totalTasks / 25;

		return baseMultiplier;
	}

	async function calculateInformability(): Promise<number> {
		let value = 1;

		const contextBonus =
			sentenceToParagraphRatio >= 3
				? (Math.log(sentenceToParagraphRatio) +
						Math.log(sentenceToParagraphRatio * 1.5)) *
					2
				: Math.log(sentenceToParagraphRatio) * 2;

		value += contextBonus;

		value += (wordToSentenceRatio * sentenceToParagraphRatio) / 5 / totalFiles;

		const [fileCount, folderCount, listItemCount] = await Promise.all([
			getAllFiles(),
			getAllFolders(),
			getListItemCount(app),
		]);

		const fileToFolderRatio = fileCount / folderCount;
		value += fileToFolderRatio;

		value += Math.log(totalSentences);

		const paragraphWordCount = wordToSentenceRatio * sentenceToParagraphRatio;

		value += Math.log(paragraphWordCount) * (1 + paragraphWordCount / 250);

		console.log("List item count: " + listItemCount);

		value += Math.log(listItemCount) + Math.PI;

		return value;
	}

	async function calculatePenalties(): Promise<number> {
		let value = 0;

		value += Math.E ** ((4 - characterToWordRatio) / 2) * 50;

		const [orphanCount, totalSentencesLocal] = await Promise.all([
			getOrphanCount(app),
			getTotalSentences(app),
		]);

		value += orphanCount;

		value *= 1 + 0.055 * Math.log(1 + vaultStats.totalChars);

		value += (characterToWordRatio / 2) * (characterToWordRatio * (1 / 125));

		const characterToSentenceRatio =
			vaultStats.totalChars / totalSentencesLocal;

		value += Math.max(
			10,
			Math.log(characterToSentenceRatio) * 3 -
				characterToSentenceRatio * 0.0025 +
				20,
		);

		return value;
	}

	function calculateStatBonuses(): number {
		let value = 0;

		value += Math.log(totalFiles) * Math.PI;
		value += Math.log(totalFolders) * 1.5;

		const characterBonus =
			Math.log(vaultStats.totalChars) + vaultStats.totalChars / 3000;

		value += characterBonus * Math.pow(Math.PI, 0.6);

		value +=
			((417 - 1 / 3) / 4) *
			(1 - Math.pow(0.9975, plugin.settings.totalExecutionCount));

		value += (Math.log(value) + (1 + value * 0.025)) / 125;

		return value;
	}

	const [
		readabilityValue,
		vaultRatingValue,
		statBonusValue,
		informabilityValue,
		penaltyValue,
	] = await Promise.all([
		Promise.resolve(calculateReadability()),
		calculateVaultRating(),
		Promise.resolve(calculateStatBonuses()),
		calculateInformability(),
		calculatePenalties(),
	]);

	// -------------------------
	// FINAL CALCULATION
	// -------------------------

	performanceValue =
		((readabilityValue + statBonusValue + informabilityValue - penaltyValue) *
			vaultRatingValue) /
		1.075;

	// DEBUG
	console.log(
		`readabilityValue: ${(readabilityValue * vaultRatingValue) / 1.075}pp`,
	);
	console.log(
		`statBonusValue: ${(statBonusValue * vaultRatingValue) / 1.075}pp`,
	);
	console.log(
		`informabilityValue: ${(informabilityValue * vaultRatingValue) / 1.075}pp`,
	);
	console.log(`penaltyValue: ${(penaltyValue * vaultRatingValue) / 1.075}pp`);
	console.log(`vaultRatingValue: ${vaultRatingValue / 1.075}x`);

	if (!Number.isFinite(performanceValue) || performanceValue <= 0) {
		console.log("Invalid performance value. Setting to 0pp...");
		performanceValue = 0;
	}

	return performanceValue;
}
