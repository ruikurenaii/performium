import { App, TFile, getAllTags } from "obsidian";

export async function getAllUsedTags(app: App): Promise<number> {
  let tagCount = 0;
  const files = app.vault.getMarkdownFiles();

  for (const file of files) {
    const cache = app.metadataCache.getFileCache(file);
	  if (!cache) continue;
    const fileTags = getAllTags(cache);
		if (!fileTags) continue;
    tagCount += fileTags.length;
  }

  return tagCount;
}
