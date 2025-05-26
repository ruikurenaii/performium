import { App } from "obsidian";

export async function calculateDifficultWordStats(
  app: App,
  commonWordSet: Set<string>
): Promise<{
  totalWords: number;
  difficultWords: number;
  percentage: number;
}> {
  const files = app.vault.getMarkdownFiles();

  let totalWords = 0;
  let difficultWords = 0;

  for (const file of files) {
    const content = await app.vault.read(file);
    const words = extractWords(content);

    for (const word of words) {
      totalWords++;
      if (!commonWordSet.has(word)) {
        difficultWords++;
      }
    }
  }

  const percentage = totalWords > 0 ? (difficultWords / totalWords) * 100 : 0;

  return {
    totalWords,
    difficultWords,
    percentage: +percentage.toFixed(2),
  };
}

function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[#*>\-`[\](){}:;'"!?.,]/g, "")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 1 && /^[a-z]+$/.test(word));
}
