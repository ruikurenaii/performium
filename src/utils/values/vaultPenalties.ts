export async function calculateVaultPenalties({
  totalFiles,
  totalFolders,
  totalWords,
  totalParagraphs
}: {
  totalFiles: number;
  totalFolders: number;
  totalWords: number;
  totalParagraphs: number;
}) {
  const filesToFoldersRatio = totalFiles / Math.max(totalFolders, 1);
  const wordsPerFile = totalWords / Math.max(totalFiles, 1);
  const paragraphsPerFile = totalParagraphs / Math.max(totalFiles, 1);
  const wordsPerParagraph = totalWords / Math.max(totalParagraphs, 1);

  let misses = 0;
  let hundreds = 0;
  let fifties = 0;

  if (wordsPerFile < 7) misses += Math.pow((7 - wordsPerFile) / 7, 1.5) * totalFiles * 0.5;
  if (filesToFoldersRatio < 2) misses += Math.pow((2 - filesToFoldersRatio) / 2, 2) * totalFolders * 0.4;

  if (paragraphsPerFile < 1.8) hundreds += Math.pow((1.8 - paragraphsPerFile) / 1.8, 1.3) * totalFiles * 0.7;
  if (wordsPerParagraph < 30) hundreds += Math.pow((30 - wordsPerParagraph) / 30, 1.1) * totalParagraphs * 0.5;

  if (wordsPerParagraph < 8) fifties += Math.pow((8 - wordsPerParagraph) / 8, 1.8) * totalParagraphs * 0.9;
  if (wordsPerFile < 3) fifties += Math.pow((3 - wordsPerFile) / 3, 2) * totalFiles * 0.8;

  misses = Math.floor(misses);
  hundreds = Math.floor(hundreds);
  fifties = Math.floor(fifties);

  return {
    shit = misses,
    okay = hundreds,
    meh = fifties
  };
}
