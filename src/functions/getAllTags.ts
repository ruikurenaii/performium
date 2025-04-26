import { App, TFile } from "obsidian";

export async function getAllUsedTags(app: App): Promise<number> {
  let tagCount = 0;
  const files = app.vault.getMarkdownFiles();

  for (const file of files) {
    const cache = app.metadataCache.getFileCache(file);
    const fileTags = getAllTags(cache);
    tagCount += fileTags.length;
  }

  return tagCount;
}
