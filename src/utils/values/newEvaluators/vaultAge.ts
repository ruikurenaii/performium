import { App } from "obsidian";

export function getVaultAge(app: App): number {
	const allNotes = app.vault.getMarkdownFiles();

	let earliestTimestamp = Date.now();

	for (const note of allNotes) {
		const noteCreated = note.stat.ctime;
		if (noteCreated < earliestTimestamp) {
			earliestTimestamp = noteCreated;
		}
	}

	const now = Date.now();
	const millisecondsSinceCreation = now - earliestTimestamp;
	const daysSinceCreation = Math.floor(millisecondsSinceCreation / (1000 * 60 * 60 * 24));

	return daysSinceCreation;
}
