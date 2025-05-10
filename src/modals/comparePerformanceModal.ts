import { App, Modal } from "obsidian";

export class comparePerformanceModal extends Modal {
  ppValue: number;
  secondaryPpValue: number;

  constructor(app: App, ppValue: number, secondaryPpValue: number) {
    super(app);
    this.ppValue = ppValue;
    this.secondaryPpValue = secondaryPpValue;
  }

  onOpen() {
    const { contentEl } = this;
    const difference = secondaryPpValue - this.ppValue;

    let differenceText: string = "";

    if (difference < 0) {
      differenceText = `${difference.toFixed(0)}pp`;
    } else {
      differenceText = `+${difference.toFixed(0)}pp`;
    }

    // let contentText = `Compared values:\n\nCurrent performance value:\n${this.ppValue.toFixed(0)}pp\n\nCompared performance value:\n${this.secondaryPpValue.toFixed(0)}pp\n\nDifference:\n${differenceText}`;

		contentEl.empty();
	  contentEl.addClass("comparison-window-class");

    this.setTitle("Performance values comparison");

    contentEl.createEl('p', {
      text: "Current performance value:"
    });

    contentEl.createEl('p', {
      text: `${this.ppValue.toFixed(0)}pp`,
      cls: "semi-header-text-style"
    });

	contentEl.createEl('p', {
      text: "",
	  cls: "margin-element"
    });

    contentEl.createEl('p', {
      text: "Compared performance value:"
    });

    contentEl.createEl('p', {
      text: `${this.secondaryPpValue.toFixed(0)}pp`,
      cls: "semi-header-text-style"
    });

	contentEl.createEl('p', {
      text: "",
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
