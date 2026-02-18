import { App } from "obsidian";

export async function countAllLinks(app: App): Promise<number> {
  let total = 0;

  const files = app.vault.getMarkdownFiles();

  for (const file of files) {
    const cache = app.metadataCache.getFileCache(file);
    total += cache?.links?.length ?? 0;
  }

  return total;
}

export async function countAllWikiLinks(app: App): Promise<number> {
  let total = 0;

  for (const file of app.vault.getMarkdownFiles()) {
    const cache = app.metadataCache.getFileCache(file);
    total += cache?.links?.filter(l => l.original.startsWith("[[")).length ?? 0;
  }

  return total;
}