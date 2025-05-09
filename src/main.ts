import { TFile, TFolder, Notice, Vault, App, Plugin, Modal } from "obsidian";
import { PerformiumBaseSettings, PerformiumSettingsTab, DEFAULT_SETTINGS } from "./options/base";

// import different performance points systems
import { calculatePerformance as calculatePerformance040625 } from "./utils/pp/040625";
import { calculatePerformance as calculatePerformance041325 } from "./utils/pp/041325";
import { calculatePerformance as calculatePerformance042925 } from "./utils/pp/042925";
import { calculatePerformance as calculatePerformance050725 } from "./utils/pp/050725";
import { calculatePerformance as calculatePerformanceTest } from "./utils/pp/test";

export default class PerformiumPlugin extends Plugin {
  settings: PerformiumBaseSettings;
  
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new PerformiumSettingsTab(this.app, this));
    
    let focusStart: number | null = null;
    
    this.registerEvent(this.app.workspace.on("active-leaf-change", (leaf) => {
      const now = Date.now();
      
      if (focusStart !== null) {
        const duration = now - focusStart;
        this.settings.totalFocusTime = (this.settings.totalFocusTime ?? 0) + duration;
        this.saveSettings();
      }
      
      focusStart = now;
    }));
    
    this.addCommand({
      id: "calculate-performance",
      name: "Calculate performance points",
      callback: async () => {
        const performanceValue = await this.calculatePerformance();
        new PerformanceModal(this.app, performanceValue).open();
        new Notice("Performance points calculation has started");
      }
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
  
  async calculatePerformance(): Promise < number > {
    if (this.settings.ppSystem === "test") {
      return calculatePerformanceTest(this);
    } else if (this.settings.ppSystem === "050725") {
      return calculatePerformance050725(this);
	} else if (this.settings.ppSystem === "042925") {
      return calculatePerformance042925(this.app);
	} else if (this.settings.ppSystem === "041325") {
      return calculatePerformance041325(this.app);
    } else {
      return calculatePerformance040625(this.app);
    }
  }
  
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    
    if (!this.settings.installTimestamp) {
      this.settings.installTimestamp = Date.now();
      await this.saveData(this.settings);
    }
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
    const startTime = new Date();
    let st = startTime.getTime();
    
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("main-window-class");
    
    this.setTitle("Calculated performance points:");
    
    const formatter = new Intl.NumberFormat("en-us", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    
    const truncatedValue = Math.trunc(this.performanceValue);
    const formattedValue = formatter.format(truncatedValue);
    
    let valueText: string = `${formattedValue}pp`;
    
    contentEl.createEl("p", {
      text: valueText,
      cls: "main-window-value"
    });
    
    const endTime = new Date();
    let et = endTime.getTime();

    const timeTaken = et - st;
    const timeTakenSeconds = timeTaken / 1000;
    let timeTakenText: string = "";

    // if timeTaken is a second or longer
    if (timeTaken > 1000) {
      timeTakenText = (timeTakenSeconds.toFixed(2)).toString() + " s";
    } else {
      timeTakenText = timeTaken.toFixed(2) + " ms";
    }
    
    contentEl.createEl("p", {
      text: `Total CPU time: ${timeTakenText}`,
      cls: "main-window-time",
    });
    
    new Notice("Performance calculation successfully finished!");
  }
  
  onClose() {
    this.contentEl.empty();
  }
} 
