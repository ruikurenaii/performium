import { App } from "obsidian";
import { HighestPerformanceModal } from "../modals/highestPerformanceModal";
import { getTopPerformanceEntries } from "./getTopPerformanceEntries";

export async function showAllPerformanceEntries(app: App) {
  const entries = await getTopPerformanceEntries(app);
  new HighestPerformanceModal(app, entries).open();
} 
