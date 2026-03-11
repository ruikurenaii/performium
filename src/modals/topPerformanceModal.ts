import { App, Modal, Notice } from "obsidian";
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

    let weightedPP = await getWeightedPP(this.app);

    // debug
    // console.log(valuesArray);

    // remove empty integer items
    if (valuesArray.includes(0)) {
      new Notice('There are values that aren\'t more than zero.');
    }

    // use the new array without the items that are filtered
    const newValuesArray = valuesArray.filter(value => value !== 0);

    newValuesArray.sort(function(a, b) {
      return b - a;
    });

    contentEl.createEl('h1', {
      text: `Total Weighted PP: ${new Intl.NumberFormat().format(Math.trunc(weightedPP))}pp`,
      cls: 'top-performance-heading'
    });

    // estimated leveling thru the use of the weighted pp
    contentEl.createEl('p', {
      text: `Estimated player level: Level ${Math.trunc(Math.log(weightedPP * 5) + (weightedPP * 0.001))}`,
      cls: 'center'
    })

    contentEl.createEl('hr');

    contentEl.createEl('p', {
      text: `Top performance calculations:`,
      cls: 'center'
    });

    newValuesArray.forEach((value: number, index: number) => {
      contentEl.createEl('p', {
        text: `#${index + 1} - ${new Intl.NumberFormat().format(Math.trunc(value))}pp (${new Intl.NumberFormat().format(Math.trunc(value * (0.95 ** index)))}pp)`,
        cls: 'performance-entry'
      });
    });

    contentEl.createEl('p', {
      text: `Total scores: ${newValuesArray.length} scores`,
      cls: 'center'
    })
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}