import { TFile } from "obsidian";

export async function getDaysSinceLastEdit(file: TFile) {
  for (const file of this.app.vault.getMarkdownFiles()) {
    const modifyTime = file.stat.mtime;
    let daysSinceLastEdit = Math.floor(modifyTime / (1000 * 60 * 60 * 24));
    return { daysSinceLastEdit };
  }
}