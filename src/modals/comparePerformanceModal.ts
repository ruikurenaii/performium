import { App, Modal } from "obsidian";
import { getPerformanceVersion } from "src/functions/getPerformanceVersion";

export class comparePerformanceModal extends Modal {
  ppValue: number;
  secondaryPpValue: number;
  setting: string;
  secondarySetting: string;

  constructor(app: App, ppValue: number, secondaryPpValue: number, setting: string, secondarySetting: string) {
    super(app);
    this.ppValue = ppValue;
    this.secondaryPpValue = secondaryPpValue;
    this.setting = setting;
    this.secondarySetting = secondarySetting;
  }

  async onOpen() {
    const { contentEl } = this;
    const difference = this.secondaryPpValue - this.ppValue;

    let differenceText: string = "";

    if (difference < 0) {
      differenceText = `${new Intl.NumberFormat().format(Math.trunc(difference))}pp`;
    } else {
      differenceText = `+${new Intl.NumberFormat().format(Math.trunc(difference))}pp`;
    }

    // let contentText = `Compared values:\n\nCurrent performance value:\n${this.ppValue.toFixed(0)}pp\n\nCompared performance value:\n${this.secondaryPpValue.toFixed(0)}pp\n\nDifference:\n${differenceText}`;

		contentEl.empty();
	  contentEl.addClass("comparison-window-class");

    this.setTitle("Performance values comparison");

    contentEl.createEl('p', {
      text: "Current performance value:"
    });

    contentEl.createEl('p', {
      text: `${new Intl.NumberFormat().format(Math.trunc(this.ppValue))}pp`,
      cls: "semi-header-text-style"
    });

    contentEl.createEl('p', {
      text: `Main PP System Version: ${await getPerformanceVersion(this.setting)}`,
      cls: 'muted-text-style'
    });

	  contentEl.createEl('hr');

    contentEl.createEl('p', {
      text: "Compared performance value:"
    });

    contentEl.createEl('p', {
      text: `${new Intl.NumberFormat().format(Math.trunc(this.secondaryPpValue))}pp`,
      cls: "semi-header-text-style"
    });

    contentEl.createEl('p', {
      text: `Compared PP System Version: ${await getPerformanceVersion(this.secondarySetting)}`,
      cls: 'muted-text-style'
    });

  	contentEl.createEl('p', {
      text: " ",
	    cls: "margin-element"
    });

    contentEl.createEl('p', {
      text: "Difference:"
    });

    contentEl.createEl('p', {
      text: `${differenceText}`,
      cls: "semi-header-text-style"
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
