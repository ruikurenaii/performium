import { App, Modal, Notice } from "obsidian";

interface PerformanceEntry {
  value: number;
  date: string;
}

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
        text: `on ${entry.date}`,
        cls: "pp-date"
      });
    });

    if (this.entries.length === 0) {
      contentEl.createEl("p", {
        text: "Shucks, looks there are no calculated performance entries...",
        cls: "pp-empty"
      });
    }

    new Notice("")
  }

  onClose() {
    this.contentEl.empty();
  }
}
