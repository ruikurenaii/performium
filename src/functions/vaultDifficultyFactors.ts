function calculateVaultDifficultyFactors(stats: {
  totalFiles: number,
  totalFolders: number,
  totalWords: number,
  totalParagraphs: number,
  totalTags: number
}) {
  const { totalFiles, totalFolders, totalWords, totalParagraphs, totalTags } = stats;

  const averageWordsPerFile = totalWords / (totalFiles || 1);

  const rawAR = Math.sqrt(totalFiles / (totalFolders + 1)) * 1.5 + Math.log2(totalFiles + 1) - Math.log2(totalFolders + 2);
  const rawOD = Math.pow(totalTags / (totalFiles + 1), 0.7) * 7 + Math.log2(totalTags + 2);
  const rawHP = Math.pow(totalFiles / (totalParagraphs + 1), 0.8) * 12 - Math.log2(totalParagraphs + 2);
  const rawCS = 8 - Math.log10(averageWordsPerFile + 10) * 3 + (Math.sqrt(averageWordsPerFile) / 50);

  const AR = Math.max(0, rawAR);
  const OD = Math.max(0, rawOD);
  const HP = Math.max(0, rawHP);
  const CS = Math.max(0, rawCS);
  return {
    AR: Math.round(AR * 100) / 100,
    OD: Math.round(OD * 100) / 100,
    HP: Math.round(HP * 100) / 100,
    CS: Math.round(CS * 100) / 100,
  };
}
