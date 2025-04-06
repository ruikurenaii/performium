import { TFile, TFolder, App } from "obsidian";

export async function calculateVaultStats(app: App) {
  const vault = app.vault;

  let totalFiles = 0;
  let totalFolders = 0;
  let totalWords = 0;
  let totalChars = 0;
  let totalSentences = 0;
  let totalParagraphs = 0;

  let longestSentenceLength = 0;
  let longestParagraphLength = 0;

  const processFolder = async (folder: TFolder) => {
    totalFolders++;

    for (const child of folder.children) {
      if (child instanceof TFolder) {
        await processFolder(child);
      } else if (child instanceof TFile && child.extension === "md") {
        totalFiles++;
        const content = await vault.read(child);

        totalChars += content.length;

        const words = content.split(/\s+/).filter(word => word.length > 0);
        totalWords += words.length;

        const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
        totalSentences += sentences.length;
        for (const sentence of sentences) {
          if (sentence.length > longestSentenceLength) {
            longestSentenceLength = sentence.length;
          }
        }

        const paragraphs = content.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 0);
        totalParagraphs += paragraphs.length;
        for (const paragraph of paragraphs) {
          if (paragraph.length > longestParagraphLength) {
            longestParagraphLength = paragraph.length;
          }
        }
      }
    }
  };

  await processFolder(vault.getRoot());

  const averageWordsPerFile = totalFiles ? totalWords / totalFiles : 0;
  const averageSentencesPerFile = totalFiles ? totalSentences / totalFiles : 0;
  const averageWordsPerSentence = totalSentences ? totalWords / totalSentences : 0;
  const averageSentencesPerParagraph = totalParagraphs ? totalSentences / totalParagraphs : 0;

  return {
    totalFiles,
    totalFolders,
    totalWords,
    totalChars,
    totalSentences,
    totalParagraphs,
    averageWordsPerFile,
    averageSentencesPerFile,
    averageWordsPerSentence,
    averageSentencesPerParagraph,
    longestSentenceLength,
    longestParagraphLength
  };
}
