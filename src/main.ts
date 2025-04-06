import { TFile, TFolder, Notice, Vault, App, Plugin, Modal } from "obsidian";
import { PerformiumBaseSettings, PerformiumSettingsTab, DEFAULT_SETTINGS } from "./options/base";

// import different pp systems
import { calculatePerformance as calculatePerformance040625 } from "./utils/pp/040625";
import { calculatePerformance as calculatePerformanceTest } from "./utils/pp/test";

export default class PerformiumPlugin extends Plugin {
  settings: PerformiumBaseSettings;

  async onload() {
    console.log("Performium has been loaded");

	await this.loadSettings();
    this.addSettingTab(new PerformiumSettingsTab(this.app, this));

    this.addCommand({
      id: "calculate-performance",
      name: "Calculate Performance Points",
      callback: async () => {
        const performanceValue = await this.calculatePerformance();
        new PerformanceModal(this.app, performanceValue).open();
		new Notice("Performance points calculation has started");
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
        const performanceValue = await this.calculatePerformance();
        new PerformanceModal(this.app, performanceValue).open();
		new Notice("Performance points calculation has started");
      },
    );
  }
	
  async calculatePerformance(): Promise<number> {
	if (this.settings.ppSystem === "test") {
	  return calculatePerformanceTest(this.app);
    } else {
	  return calculatePerformance040625(this.app);
	}
  } 

  async loadSettings() {
  this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
}

export class PerformanceModal extends Modal {
  private performanceValue: number;

  constructor(app: App, performanceValue: number) {
    super(app);
    this.performanceValue = performanceValue;
  }

  onOpen() {
    const startTime = performance.now();

    const { contentEl } = this;
    contentEl.empty();
    contentEl.style.textAlign = "center";
    // contentEl.style.fontFamily = "var(--font-interface, var(--default-font))";

    this.setTitle("Calculated Performance Points");

    const formatter = new Intl.NumberFormat("en-us", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    
    const truncatedValue = Math.trunc(this.performanceValue);
    var formattedValue = formatter.format(truncatedValue);

    var valueText: string = `${formattedValue}pp`;

    contentEl.createEl("p", {
      text: valueText,
	  cls: "window-value"
	});

    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(1);

    contentEl.createEl("p", {
      text: `Total CPU time: ${timeTaken} ms`,
      cls: "window-time",
    });

	new Notice("Performance calculation successfully finished!");
  }

  onClose() {
	this.contentEl.empty();
  }
}

export async function calculateVaultStats(app: App) {
  const vault = app.vault;

  let totalFiles = 0;
  let totalFolders = 0;
  let totalWords = 0;
  let totalChars = 0;
  let totalSentences = 0;

  let longestSentenceLength = 0;
  let longestParagraphLength = 0;

  const processFolder = async (folder: TFolder) => {
    totalFolders++;

    for (const child of folder.children) {
      if (child instanceof TFolder) {
        await processFolder(child);
      } else if (child instanceof TFile && child.extension === "md") {
        totalFiles++;
        const content = await vault.read(child);

        totalChars += content.length;
        const words = content.split(/\s+/).filter(word => word.length > 0);
        totalWords += words.length;

        const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
        totalSentences += sentences.length;
        for (const sentence of sentences) {
          if (sentence.length > longestSentenceLength) {
            longestSentenceLength = sentence.length;
          }
        }

        const paragraphs = content.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 0);
        for (const paragraph of paragraphs) {
          if (paragraph.length > longestParagraphLength) {
            longestParagraphLength = paragraph.length;
          }
        }
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
    averageSentencesPerFile: totalFiles ? totalSentences / totalFiles : 0,
    longestSentenceLength,
    longestParagraphLength
  };
}
