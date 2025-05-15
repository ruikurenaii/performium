import { TFile } from "obsidian";

export async function getTopPerformanceEntries(limit: number = 5): Promise<{ value: number, date: string }[]> {
  const filePath = `.obsidian/pp-entries.json`;
  const file = this.app.vault.getAbstractFileByPath(filePath);

  if (!file || !(file instanceof TFile)) return [];

  try {
    const content = await this.app.vault.read(file);
    const data: Record<string, Record<string, number[]>> = JSON.parse(content);

    const allEntries: { value: number, date: string }[] = [];

    for (const year of Object.keys(data)) {
      for (const date of Object.keys(data[year])) {
        const fullDate = `${year}-${date}`;
        for (const value of data[year][date]) {
          allEntries.push({ value, date: fullDate });
        }
      }
    }

    return allEntries
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  } catch (e) {
    console.error("Failed to read or parse the JSON file:", e);
    return [];
  }
}
