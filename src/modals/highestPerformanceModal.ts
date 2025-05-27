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

  const grouped = new Map<string, number[]>();

  this.entries.forEach(({ value, date }) => {
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(value);
  });

  for (const [date, values] of grouped.entries()) {
    const section = contentEl.createEl("div", { cls: "pp-date-group" });
    section.createEl("h3", { text: date });

    const list = section.createEl("ol", { cls: "pp-leaderboard-list" });

    values.sort((a, b) => b - a).forEach((value, index) => {
      const item = list.createEl("li", { cls: "pp-leaderboard-entry" });
      item.setText(`#${index + 1}: ${value}pp`);
    });
  }

    if (this.entries.length === 0) {
      this.setContent("Shucks, seems like there are no recorded performance entries...");
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}
