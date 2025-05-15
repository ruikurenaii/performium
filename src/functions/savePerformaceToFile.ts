import { App, TFile } from "obsidian";

export async function savePerformanceToFile(app: App, value: number) {
  const filePath = `.obsidian/pp-entries.json`;

  const now = new Date();
  const year = now.getFullYear().toString();
  const monthDay = `${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

  let data: Record<string, Record<string, number[]>> = {};

  const file = app.vault.getAbstractFileByPath(filePath);
  if (file && file instanceof TFile) {
    try {
      const fileContent = await app.vault.cachedRead(file);
      data = JSON.parse(fileContent);
    } catch (e) {
      console.error("Failed to parse the JSON file:", e);
      data = {};
    }
  }

  if (!data[year]) data[year] = {};
  if (!data[year][monthDay]) data[year][monthDay] = [];

  data[year][monthDay].push(value);

  const newContent = JSON.stringify(data, null, 2);

  if (file instanceof TFile) {
    await app.vault.modify(file, newContent);
  } else {
    try {
      await app.vault.create(filePath, newContent);
    } catch (e) {
      console.error(`Failed to create ${filePath}:`, e);
    }
  }
}
