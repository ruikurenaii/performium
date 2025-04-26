import { TFile, TFolder, App } from "obsidian";
import { getAllTags } from "./getAllTags";

export async function calculateVaultStats(app: App) {
  const vault = app.vault;

  let totalFiles = 0;
  let totalFolders = 0;
  let totalWords = 0;
  let totalChars = 0;
  let totalSentences = 0;
  let totalParagraphs = 0;
  let totalTags = 0;

  let longestSentenceLength = 0;
  let longestParagraphLength = 0;

  let totalSentenceChars = 0;
  let totalParagraphChars = 0;

  const processFolder = async (folder: TFolder) => {
    totalFolders++;

    for (const child of folder.children) {
      if (child instanceof TFolder) {
        await processFolder(child);
      } else if (child instanceof TFile && child.extension === "md") {
        totalFiles++;
        const content = await vault.cachedRead(child);

        totalChars += content.length;

        const words = content.split(/\s+/).filter(word => word.length > 0);
        totalWords += words.length;

        const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
        totalSentences += sentences.length;
        for (const sentence of sentences) {
          totalSentenceChars += sentence.length;
          if (sentence.length > longestSentenceLength) {
            longestSentenceLength = sentence.length;
          }
        }

        const paragraphs = content.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 0);
        totalParagraphs += paragraphs.length;
        for (const paragraph of paragraphs) {
          totalParagraphChars += paragraph.length;
          if (paragraph.length > longestParagraphLength) {
            longestParagraphLength = paragraph.length;
          }
        }

        const tags = await getAllUsedTags(this.app);
        if (tags) {
          totalTags += tags;
        }
      }
    }
  };

  await processFolder(vault.getRoot());

  const averageWordsPerFile = totalFiles ? totalWords / totalFiles : 0;
  const averageSentencesPerFile = totalFiles ? totalSentences / totalFiles : 0;
  const averageWordsPerSentence = totalSentences ? totalWords / totalSentences : 0;
  const averageSentencesPerParagraph = totalParagraphs ? totalSentences / totalParagraphs : 0;
  const averageCharsPerSentence = totalSentences ? totalSentenceChars / totalSentences : 0;
  const averageParagraphLength = totalParagraphs ? totalParagraphChars / totalParagraphs : 0;
  const averageSentenceLength = totalSentences ? totalSentenceChars / totalSentences : 0;

  return {
    totalFiles,
    totalFolders,
    totalWords,
    totalChars,
    totalSentences,
    totalParagraphs,
    totalTags,
    averageWordsPerFile,
    averageSentencesPerFile,
    averageWordsPerSentence,
    averageSentencesPerParagraph,
    averageCharsPerSentence,
    averageParagraphLength,
    averageSentenceLength,
    longestSentenceLength,
    longestParagraphLength
  };
}
