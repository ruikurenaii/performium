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
		contentEl.empty();
	  contentEl.addClass("main-window-class");

    const difference = this.ppValue - this.secondaryPpValue;

    let differenceText: string = "";

    if (difference < 0) {
      differenceText = `${difference}pp`;
    } else {
      differenceText = `+${difference}pp`;
    }

    this.setTitle("Performance values comparison");

    this.setContent(`Compared values:\n\nCurrent performance value:\n${this.ppValue}pp\n\nCompared performance value:\n${this.secondaryPpValue}pp\n\nDifference:\n`);
  }
}