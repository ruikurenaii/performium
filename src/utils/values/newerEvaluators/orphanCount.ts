import { App } from "obsidian";

export async function getOrphanCount(app: App): Promise<number> {
  const files = app.vault.getMarkdownFiles();

  let count = 0;

  for (const file of files) {
    const backlinks = this.app.metadataCache.getBacklinksForFile(file);

    if (!backlinks || backlinks.data.size === 0) {
      count++;
    }
  }

  return count;
}