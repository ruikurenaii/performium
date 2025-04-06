import { TFile, TFolder, Notice, Vault, App, Plugin, Modal } from "obsidian";
import { PerformiumBaseSettings, PerformiumSettingsTab, DEFAULT_SETTINGS } from "options/base";
import { calculatePerformance } from "utils/pp/040625.ts";

export class PerformiumPlugin extends Plugin {
  settings: PerformiumSettings;

  onload() {
    console.log("Commodity Plugin Loaded");
    
    this.loadSettings();
    this.language = this.settings.language || "en";
    this.addSettingTab(new PerformiumSettingsTab(this.app, this));

    this.addCommand({
      id: "calculate-performance",
      name: "Calculate Performance Points",
      callback: async () => {
        const performanceValue = calculatePerformance(this.app);
        new PerformanceModal(this.app, performanceValue);
      },
      hotkeys: [
        {
          modifiers: ["Mod", "Shift"],
          key: "P",
        },
      ],
    });

    this.addRibbonIcon(
      "lucide-chart-line",
      "Calculate performance points",
      async () => {
        const performanceValue = calculatePerformance(this.app);
        new PerformanceModal(this.app, performanceValue);
      },
    );
  }
}

class PerformanceModal extends Modal {
  private performanceValue: number;

  constructor(app: App, performanceValue: number) {
    super(app);
    this.performanceValue = performanceValue;
  }

  onOpen() {
    new Notice("Performance points calculation has started");
    const startTime = performance.now();

    const { contentEl } = this;
    contentEl.empty();
    contentEl.style.textAlign = "center";
    contentEl.style.fontFamily = "var(--font-interface, var(--default-font))";

    contentEl.createEl("h4", {
      text: "Calculated Points",
      cls: "window-header",
    });

    const formatter = new Intl.NumberFormat(this.language, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    
    const fullValue = this.performanceValue.toFixed(25);
    const truncatedValue = Math.trunc(fullValue);
    var formattedValue: string = formatter.format(truncatedValue);

    var valueText: string = `${formattedValue}pp`;

    contentEl.createEl("h1", {
      text: valueText,
      cls: "window-value"
    });

    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(1);

    contentEl.createEl("p", {
      text: `Total CPU time: ${timeTaken} ms`,
      cls: "window-time",
    });
  }
}

export async function calculateVaultStats(app: App) {
  const vault = app.vault;
  let totalFiles = 0;
  let totalFolders = 0;
  let totalWords = 0;
  let totalChars = 0;
  let totalSentences = 0;

  const processFolder = async (folder: TFolder) => {
    totalFolders++;
    for (const child of folder.children) {
      if (child instanceof TFolder) {
        await processFolder(child);
      } else if (child instanceof TFile && child.extension === "md") {
        totalFiles++;
        const content = await vault.read(child);
        totalChars += content.length;
        totalWords += content.split(/\s+/).filter(word => word.length > 0).length;
        totalSentences += content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
      }
    }
  };

  await processFolder(vault.getRoot());

  return {
    totalFiles,
    totalFolders,
    totalWords,
    totalChars,
    totalSentences,
    averageWordsPerFile: totalFiles ? totalWords / totalFiles : 0,
    averageSentencesPerFile: totalFiles ? totalSentences / totalFiles : 0
  };
}
