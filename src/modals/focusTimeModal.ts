import { App, Modal } from "obsidian";

export class focusTimeModal extends Modal {
  totalFocusTime: number;

  constructor(app: App, totalFocusTime: number) {
    super(app);
    this.totalFocusTime = totalFocusTime;
  }

  onOpen() {
    const { contentEl } = this;
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
