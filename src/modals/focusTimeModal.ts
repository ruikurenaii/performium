import { App, Modal } from "obsidian";
import { PerformiumBaseSettings, PerformiumSettingsTab, DEFAULT_SETTINGS } from "./options/base";
import { getUptime } from "../functions/getUptime";

export class focusTimeModal extends Modal {
  totalFocusTime: number;

  constructor(app: App, totalFocusTime: number) {
    super(app);
    this.totalFocusTime = totalFocusTime;
  }

  onOpen() {
    const { contentEl } = this;
		contentEl.empty();
	  contentEl.addClass("window-class");

	  const time: string = getUptime(this.settings.totalFocusTime);

		this.setTitle("Total focus time");

		// add a temporary css class (will be changed in a few more commits)
		contentEl.createEl("p", {
      text: time,
	    cls: "window-value"
	  });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
