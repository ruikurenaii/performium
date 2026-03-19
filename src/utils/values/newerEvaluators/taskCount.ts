import { App } from "obsidian";

interface TaskCount {
	totalTasks: number;
	completedTasks: number;
}
export async function getTaskCount(app: App): Promise<TaskCount> {
	const files = app.vault.getMarkdownFiles();
	let totalTasks: number = 0;
	let completedTasks: number = 0;

	for (const file of files) {
		const cache = app.metadataCache.getFileCache(file);
		if (cache && cache.listItems) {
			for (const item of cache.listItems) {
				if (item.task) {
					totalTasks++;
					if (item.task === "x" || item.task === "X") {
						completedTasks++;
					}
				}
			}
		}
	}

	// console.log(`Total Tasks: ${totalTasks}, Completed: ${completedTasks}`);

	return {
		totalTasks: totalTasks,
		completedTasks: completedTasks,
	};
}
