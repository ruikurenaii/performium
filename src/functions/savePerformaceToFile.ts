import { App } from "obsidian";

export async function savePerformanceToFile(app: App, value: number) {
  const filePath = `.obsidian/pp-entries.json`;
  const adapter = app.vault.adapter;

  const now = new Date();
  const year = now.getFullYear().toString();
  const monthDay = `${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

  let data: Record<string, Record<string, number[]>> = {};

  if (await adapter.exists(filePath)) {
    try {
      const fileContent = await adapter.read(filePath);
      data = JSON.parse(fileContent);
    } catch (e) {
      console.error("Error reading/parsing pp-entries.json:", e);
    }
  }

  if (!data[year]) data[year] = {};
  if (!data[year][monthDay]) data[year][monthDay] = [];

  const fixedValue: number = value.toFixed(2);

  data[year][monthDay].push(fixedValue);

  await adapter.write(filePath, JSON.stringify(data, null, 2));
}
