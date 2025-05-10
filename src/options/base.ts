/*

  base.ts: the first tab of the options section

*/

import { App, PluginSettingTab, Setting } from "obsidian";
import { timeFormat } from "../utils/values/timeFormat";
import { generateFact } from "../functions/funFact";
import { FocusTimeModal } from "../modals/focusTimeModal";
import PerformiumPlugin from "../main";
import { StringifyOptions } from "querystring";

export interface PerformiumBaseSettings {
  ppSystem: string;
  installTimestamp?: number;
  totalFocusTime?: number;
  secondaryPpSystem: string;
}

export const DEFAULT_SETTINGS: PerformiumBaseSettings = {
  ppSystem: "050725",
  installTimestamp: undefined,
	totalFocusTime: 0,
  secondaryPpSystem: "040625"
};

export class PerformiumSettingsTab extends PluginSettingTab {
  plugin: PerformiumPlugin;
  
  constructor(app: App, plugin: PerformiumPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  
  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    
    new Setting(containerEl)
      .setName("Performance points system version")
      .setDesc("Select a performance points system used for calculaton. Remember: Different PP system means different values!")
      .addDropdown(dropdown => {
        dropdown.addOptions({
          "040625": "04-06-25 (v1.0.0)",
		      "041325": "04-13-25 (v1.1.0)",
		      "042925": "04-29-25 (v1.2.0)",
		      "050725": "05-07-25 (v1.3.0, Current)",
          "test": "Test System (v1.4.0b, EXPERIMENTAL)"
        });
        
        dropdown.setValue(this.plugin.settings.ppSystem);
        dropdown.onChange(async (value) => {
          this.plugin.settings.ppSystem = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Secondary performance points system version")
      .setDesc("Select a secondary performance points system used for calculaton and comparison of pp. Remember: Read what's on the first setting!")
      .addDropdown(dropdown => {
        dropdown.addOptions({
          "040625": "04-06-25 (v1.0.0)",
		      "041325": "04-13-25 (v1.1.0)",
		      "042925": "04-29-25 (v1.2.0)",
		      "050725": "05-07-25 (v1.3.0, Current)",
          "test": "Test System (v1.4.0b, EXPERIMENTAL)"
        });
        
        dropdown.setValue(this.plugin.settings.ppSystem);
        dropdown.onChange(async (value) => {
          this.plugin.settings.secondaryPpSystem = value;
          await this.plugin.saveSettings();
        });
      });

	  new Setting(containerEl)
		  .setName("Total focus time")
		  .setDesc("See how much time you've spent on notes")
		  .addButton(button => {
        button.setButtonText("Check")
			  button.onClick(() => {
          const modal = new FocusTimeModal(this.app, this.plugin.settings.totalFocusTime ?? 0);
          modal.open();
				});
			});

    const installTimestamp = this.plugin.settings.installTimestamp ?? Date.now();
    let factText: string = generateFact(installTimestamp);
	  
	  /*  
    containerEl.createEl("p", {
      text: factText,
      cls: "text-muted"
    });
	  */

		// for funsies, i guess.
		new Setting(containerEl)
		  .setName("Did you know?")
		  .setDesc(factText)
  }
}
