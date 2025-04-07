import { TFile, TFolder, Notice, Vault, App, Plugin, Modal } from "obsidian";
import { PerformiumBaseSettings, PerformiumSettingsTab, DEFAULT_SETTINGS } from "./options/base";

// import different performance points systems
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
      name: "Calculate performance points",
      callback: async () => {
        const performanceValue = await this.calculatePerformance();
        new PerformanceModal(this.app, performanceValue).open();
		new Notice("Performance points calculation has started");
      },
      hotkeys: [
        {
          modifiers: ["Mod", "Shift"],
          key: "U",
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

  async saveSettings() {
    await this.saveData(this.settings);
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
	contentEl.addClass("window-class");
    
    this.setTitle("Calculated performance points:");

    const formatter = new Intl.NumberFormat("en-us", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    
    const truncatedValue = Math.trunc(this.performanceValue);
    const formattedValue = formatter.format(truncatedValue);

    let valueText: string = `${formattedValue}pp`;

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
