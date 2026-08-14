import { App } from "obsidian";

export async function savePerformanceToFile(app: App, value: number) {
  const filePath = `${app.vault.configDir}/pp-entries.json`;
  const adapter = app.vault.adapter;

  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString();
  const day = now.getDate().toString();
  const monthDay = `${month.length === 1 ? `0${month}` : month}-${day.length === 1 ? `0${day}` : day}`;

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

  const fixedValue: number = parseFloat(value.toFixed(2));

  data[year][monthDay].push(fixedValue);

  await adapter.write(filePath, JSON.stringify(data, null, 2));
}
