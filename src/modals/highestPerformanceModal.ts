import { App, Modal, Notice } from "obsidian";
import { PerformanceEntry } from "../interfaces/performanceEntry";

export class HighestPerformanceModal extends Modal {
  entries: PerformanceEntry[];

  constructor(app: App, entries: PerformanceEntry[]) {
    super(app);
    this.entries = entries;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("highest-performance-window-class");

    this.setTitle("Highest performance entries");

    const listEl = contentEl.createEl("ol", { cls: "pp-leaderboard-list" });

    this.entries.forEach((entry, index) => {
      const item = listEl.createEl("li", { cls: "pp-leaderboard-entry" });
      item.createEl("span", {
        text: `${index + 1}.`,
        cls: "pp-rank"
      });
      item.createEl("span", {
        text: `${entry.value}pp`,
        cls: "pp-value"
      });
      item.createEl("span", {
        text: `Set on: ${entry.date}`,
        cls: "pp-date"
      });
    });

    if (this.entries.length === 0) {
      this.setContent("Shucks, it seems like there are no recorded performance entries at the moment...");
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}
