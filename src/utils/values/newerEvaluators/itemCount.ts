import { TAbstractFile, TFile, TFolder } from "obsidian";

export function getAllFolders() {
  const allItems: TAbstractFile[] = this.app.vault.getAllLoadedFiles();

  return allItems.filter(
    (item: TAbstractFile): item is TFolder => item instanceof TFolder
  ).length;
}

export function getAllFiles() {
  const allItems: TAbstractFile[] = this.app.vault.getAllLoadedFiles();

  return allItems.filter(
    (item: TAbstractFile): item is TFile => item instanceof TFile
  ).length;
}