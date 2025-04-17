import { App, Modal } from "obsidian";
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

	  const uptime = getUptime(this.totalFocusTime);
	  const timeString: string = ``;

	  // if statement
	  if (uptime.days >= 1) {
		  timeString = `${uptime.days}d ${uptime.hours}h ${uptime.minutes}m ${uptime.seconds}s`;
		} else if (uptime.hours >= 1) {
			timeString = `${uptime.hours}h ${uptime.minutes}m ${uptime.seconds}s`;
		} else if (uptime.minutes >= 1) {
			timeString = `${uptime.minutes}m ${uptime.seconds}s`;
		} else if (uptime.seconds >= 1) {
			timeString = `${uptime.seconds}s`;
		} else {
			timeString = `undefined`;
		}

		this.setTitle("Total focus time");

		// add a temporary css class (will be changed in a few more commits)
		contentEl.createEl("p", {
      text: timeString,
	    cls: "window-value"
	  });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
