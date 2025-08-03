import { App } from "obsidian";

export function getVaultAge(app: App): { daysSinceCreation: number; millisecondsSinceCreation: number } {
	const allNotes = app.vault.getMarkdownFiles();

	let earliestTimestamp = Date.now();

	for (const note of allNotes) {
		const noteCreated = note.stat.ctime;
		if (noteCreated < earliestTimestamp) {
			earliestTimestamp = noteCreated;
		}
	}

	const now = Date.now();
	const millisecondsSinceCreation: number = now - earliestTimestamp;
	const daysSinceCreation: number = Math.floor(millisecondsSinceCreation / (1000 * 60 * 60 * 24));

	return { daysSinceCreation, millisecondsSinceCreation };
}
