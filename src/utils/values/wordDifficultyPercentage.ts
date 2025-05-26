import { App } from "obsidian";

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

function wordComplexity(word: string): number {
  return word.length + countSyllables(word);
}

function scaleToPercentage(value: number, min = 4, max = 20): number {
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}

export async function calculateWordComplexityStats(app: App) {
  const files = app.vault.getMarkdownFiles();
  let totalWords = 0;
  let totalComplexity = 0;

  for (const file of files) {
    const content = await app.vault.cachedRead(file);
    const words = content.toLowerCase().match(/\b[a-z]+\b/g);
    if (!words) continue;

    for (const word of words) {
      totalWords++;
      totalComplexity += wordComplexity(word);
    }
  }

  const averageWordComplexity = totalWords > 0 ? totalComplexity / totalWords : 0;
  const wordDifficultyPercentage = scaleToPercentage(averageWordComplexity);

  return {
    totalWords,
    totalComplexity,
    averageWordComplexity,
    wordDifficultyPercentage
  };
}
