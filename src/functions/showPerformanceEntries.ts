import { App } from "obsidian";
import { HighestPerformanceModal } from "./modals/highestPerformanceModal";
import { getTopPerformanceEntries } from "./functions/getTopPerformanceEntries";

export async function showAllPerformanceEntries(app: App) {
  const entries = await getAllPerformanceEntries(app);
  new HighestPerformanceModal(app, entries).open();
} 
