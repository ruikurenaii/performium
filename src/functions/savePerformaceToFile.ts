import { TFile } from "obsidian";

export async function savePerformanceToFile(value: number) {
  const filePath = `.obsidian/pp-entries.json`;

  const now = new Date();
  const year = now.getFullYear().toString();
  const monthDay = `${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

  let data: Record<string, Record<string, number[]>> = {};

  const file = this.app.vault.getAbstractFileByPath(filePath);
  if (file && file instanceof TFile) {
    const fileContent = await this.app.vault.read(file);
    try {
      data = JSON.parse(fileContent);
    } catch (e) {
      console.error("Failed to parse pp-entries.json:", e);
      data = {};
    }
  }

  if (!data[year]) data[year] = {};
  if (!data[year][monthDay]) data[year][monthDay] = [];

  data[year][monthDay].push(value);

  const newContent = JSON.stringify(data, null, 2);

  if (file && file instanceof TFile) {
    await this.app.vault.modify(file, newContent);
  } else {
    await this.app.vault.create(filePath, newContent);
  }

  // this log is unnecessary
  // new Notice(`Performance saved to ${filePath}`);
}
