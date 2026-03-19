import { App } from 'obsidian';

export async function getListItemCount(app: App): Promise<number> {
  const allFiles = app.vault.getMarkdownFiles();
  let totalListItemCount = 0;

  for (const file of allFiles) {
    const cache = this.app.metadataCache.getFileCache(file);
    totalListItemCount += cache?.listItems?.length || 0;
  }

  return totalListItemCount;
}