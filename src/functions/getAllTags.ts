import { TFile, normalizePath } from 'obsidian';

export async function getAllTags(app: App): Promise<Set<string>> {
	const allTags = new Set<string>();
	const metadataCache = app.metadataCache;
	const vault = app.vault;

	const files = vault.getMarkdownFiles();

	for (const file of files) {
		const cache = metadataCache.getFileCache(file);
		if (!cache) continue;

		const tagsInFile = getAllTags(cache);
		for (const tag of tagsInFile) {
			allTags.add(tag);
		}
	}

	return allTags;
}
