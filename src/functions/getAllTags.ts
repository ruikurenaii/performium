import { App, TFile } from 'obsidian';

async function getAllTags(app: App): Promise<number> {
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

	return allTags.size;
}
