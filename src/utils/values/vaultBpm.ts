export async function calculateVaultBpm(totalTags: number, totalWords: number, totalFiles: number): Promise <number> {
  const bpm = (totalWords + totalTags + totalFiles * 8) / 60;
	return Math.round(bpm);
}