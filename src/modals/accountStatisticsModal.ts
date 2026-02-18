// Note: this is a requested feature by @lulunac27a on GitHub
// for now, it'll be a modal, no further updates may be planned unless it's for user interface updates.
import { Modal, App } from "obsidian";

export class AccountStatisticsModal extends Modal {
  experience: number;
  totalExecutions: number;

  constructor (app: App, experience: number, totalExecutions: number) {
    super(app);
    this.experience = experience;
    this.totalExecutions = totalExecutions;
  }

  async onOpen() {
    const { contentEl } = this;
		contentEl.empty();
	  contentEl.addClass("account-statistics-window-class");

    async function getLevelFromValue(value: number): Promise<number> {
      if (value < 500) return 0;
    
      let level = 0;
    
      while (true) {
        const required =
          500 +
          Math.floor(
            (2 * level) ** 3 +
            1.5 * level -
            level ** 2
          );
    
        if (required > value) break;
    
        level++;
      }
    
      return level - 1;
    }
    
    this.setTitle("Account Statistics");

    // this.setContent(`Level: ${await getLevelFromValue(Math.floor(this.experience))}\nTotal Experience: ${new Intl.NumberFormat().format(Math.floor(this.experience))}`)

    contentEl.createEl("p", {
      text: `Level: ${await getLevelFromValue(Math.floor(this.experience))}`,
	    cls: "main-window-value"
	  });

    contentEl.createEl("p", {
      text: `Total Experience: ${new Intl.NumberFormat().format(Math.floor(this.experience))}`
	  });

    contentEl.createEl("p", {
      text: `Total Performance Calculations: ${new Intl.NumberFormat().format(Math.floor(this.totalExecutions))}`
	  });

    // debug
    // console.log(`${await getLevelFromValue(Math.floor(this.experience))}`);
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}