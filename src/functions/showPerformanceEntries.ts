import { App } from "obsidian";
import { TopPerformanceModal } from "../modals/topPerformanceModal";

export async function showAllPerformanceEntries(app: App) {
  new TopPerformanceModal(app).open();
} 
