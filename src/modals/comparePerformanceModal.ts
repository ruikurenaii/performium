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
    const difference = this.ppValue - this.secondaryPpValue;

    let differenceText: string = "";

    if (difference < 0) {
      differenceText = `${difference.toFixed(0)}pp`;
    } else {
      differenceText = `+${difference.toFixed(0)}pp`;
    }

    let contentText = `Compared values:\n\nCurrent performance value:\n${this.ppValue.toFixed(0)}pp\n\nCompared performance value:\n${this.secondaryPpValue.toFixed(0)}pp<br><br>Difference:\n${differenceText}`;

		contentEl.empty();
	  contentEl.addClass("main-window-class");

    this.setTitle("Performance values comparison");

    const lines = contentText.split('\n');

    for (const line of lines) {
      const element = contentEl.createEl('p', { text: line });
    }
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}