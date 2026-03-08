import { App } from "obsidian";
import { getAllNumberValues } from "./extractJSONNumbers";

export async function getWeightedPP(app: App): Promise<number> {
  const path = `${app.vault.configDir}/pp-entries.json`;

  const jsonString = await app.vault.adapter.read(path);
  const data = JSON.parse(jsonString);

  const array = await getAllNumberValues(data);

  const totalPP: number = array
  .sort((a: number, b: number) => b - a)
  .reduce((acc: number, value: number, index: number) => {
    return acc + value * Math.pow(0.95, index);
  }, 0);
  
  return totalPP;
}