import { App, getAllTags } from 'obsidian';

export async function calculateVaultBpm(app: App, totalTags: number, totalWords: number, totalFiles: number): Promise <number> {
  const bpm = (totalWords + totalTags + totalFiles * 8) / 60;
	return Math.round(bpm);
}