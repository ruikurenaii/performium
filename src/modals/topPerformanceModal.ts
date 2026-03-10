import { App, Modal } from "obsidian";
import { getAllNumberValues } from "src/functions/extractJSONNumbers";
import { getWeightedPP } from "src/functions/weightPP";

export class TopPerformanceModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  async onOpen() {
    // main function
    const { contentEl } = this;

    this.setTitle('Top performance values');

    const path = `${this.app.vault.configDir}/pp-entries.json`;

    const jsonString = await this.app.vault.adapter.read(path);
    const data = JSON.parse(jsonString);

    const valuesArray = await getAllNumberValues(data);

    valuesArray.sort(function(a, b) {
      return b - a;
    });

    contentEl.createEl('h1', {
      text: `Total Weighted PP: ${new Intl.NumberFormat().format(Math.trunc(await getWeightedPP(this.app)))}pp`,
      cls: 'center'
    });

    contentEl.createEl('hr');

    contentEl.createEl('p', {
      text: `Top performance calculations:`,
      cls: 'center'
    });

    valuesArray.forEach((value: number, index: number) => {
      contentEl.createEl('p', {
        text: `#${index + 1} - ${new Intl.NumberFormat().format(Math.trunc(value))}pp`,
        cls: 'performance-entry'
      });
    });

    contentEl.createEl('p', {
      text: `Total scores: ${valuesArray.length} scores`,
      cls: 'center'
    })
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}