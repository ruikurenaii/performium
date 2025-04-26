import { App, TFile } from "obsidian";

function getAllTags(cache: any): string[] {
  const tags: string[] = [];

  if (cache?.tags) {
    for (const tagObj of cache.tags) {
      if (tagObj.tag) tags.push(tagObj.tag);
    }
  }

  return tags;
}

export function getAllUsedTagsCount(app: App): Promise<number> {
  const tags = new Set<string>();
  const files = app.vault.getMarkdownFiles();

  for (const file of files) {
    const cache = app.metadataCache.getFileCache(file);
    const fileTags = getAllTags(cache);

    for (const tag of fileTags) {
      tags.add(tag);
    }
  }

  return tags.size;
}
