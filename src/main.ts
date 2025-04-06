import { TFile, TFolder, Vault, App } from "obsidian";

export async function calculateVaultStats(app: App) {
	const vault = app.vault;
	let totalFiles = 0;
	let totalFolders = 0;
	let totalWords = 0;
	let totalChars = 0;
	let totalSentences = 0;

	const processFolder = async (folder: TFolder) => {
		totalFolders++;
		for (const child of folder.children) {
			if (child instanceof TFolder) {
				await processFolder(child);
			} else if (child instanceof TFile && child.extension === "md") {
				totalFiles++;
				const content = await vault.read(child);
				totalChars += content.length;
				totalWords += content.split(/\s+/).filter(word => word.length > 0).length;
				totalSentences += content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
			}
		}
	};

	await processFolder(vault.getRoot());

	return {
		totalFiles,
		totalFolders,
		totalWords,
		totalChars,
		totalSentences,
		averageWordsPerFile: totalFiles ? totalWords / totalFiles : 0,
		averageSentencesPerFile: totalFiles ? totalSentences / totalFiles : 0
	};
}
