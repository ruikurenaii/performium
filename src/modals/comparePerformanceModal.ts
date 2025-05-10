import { App, Modal } from "obsidian";

export class comparePerformanceModal extends Modal {
  ppValue: number;
  secondaryPpValue: number;

  constructor(app: App, ppValue: number, secondaryPpValue: number) {
    super(app);
    this.ppValue = ppValue
    this.secondaryPpValue = secondaryPpValue
  }

  onOpen() {
    const { contentEl } = this;
		contentEl.empty();
	  contentEl.addClass("main-window-class");

    this.setTitle("Performance values comparison");

    this.setContent("");
  }
}