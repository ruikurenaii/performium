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

    async function getRequiredValueForLevel(level: number): Promise<number> {
      if (!Number.isFinite(level) || level < 0) {
        throw new Error("Level must be a non-negative finite number.");
      }
    
      const requiredValue =
        500 +
        Math.floor(
          Math.pow(2 * level, 3) +
          1.5 * level -
          Math.pow(level, 2)
        );
    
      return requiredValue;
    }
    
    this.setTitle("Account Statistics");

    // get the level
    let level = await getLevelFromValue(Math.floor(this.experience));

    // this.setContent(`Level: ${await getLevelFromValue(Math.floor(this.experience))}\nTotal Experience: ${new Intl.NumberFormat().format(Math.floor(this.experience))}`)

    let fillPercentage = (this.experience / await getRequiredValueForLevel(level + 1)) * 100;
    let fillPercentageStr = `${fillPercentage.toFixed(2)}%`;

    contentEl.createEl("p", {
      text: `Level: ${level}`,
	    cls: "main-window-value"
	  });

    const expProgressContainer = contentEl.createEl("div", {
      cls: "experience-progressbar"
    })

    const expProgressFill = expProgressContainer.createEl("div", {
      cls: "experience-progressbar-fill"
    });

    expProgressContainer.createEl("p", {
      text: ``
    })

    // debug
    console.log(fillPercentageStr);

    expProgressFill.style.width = `${fillPercentageStr}`;

    contentEl.createEl("p", {
      text: `Total Experience: ${new Intl.NumberFormat().format(Math.floor(this.experience))} XP`
	  });

    contentEl.createEl("p", {
      text: `To next level: ${new Intl.NumberFormat().format(Math.floor(await getRequiredValueForLevel(level + 1) - this.experience))} XP`
	  });

    contentEl.createEl("br");

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