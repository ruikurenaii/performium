/*

  base.ts: the first tab of the options sectio
  I've been planning to add some stuff, such as adding different languages supported by obsidian.md, but i quite don't know how would i want it to be like...
  unlike the localization code from my previous plugin (not published), commodity, i'll have to do a bit of research and attempt to add it.

*/

import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import { generateFact as generateFactBeta } from "../functions/funFactBeta";
import { generateFact } from "../functions/funFact";
// import { FocusTimeModal } from "../modals/focusTimeModal";
import PerformiumPlugin from "../main";
import { getTopPerformanceEntries } from "../functions/getTopPerformanceEntries";

export interface PerformiumBaseSettings {
  ppSystem: string;
  installTimestamp?: number;
  totalFocusTime?: number;
  secondaryPpSystem: string;
  totalExecutionCount: number;
}

export const DEFAULT_SETTINGS: PerformiumBaseSettings = {
  ppSystem: "011726",
  installTimestamp: 0,
  totalFocusTime: 0,
  secondaryPpSystem: "test",
  totalExecutionCount: 0
};

export class PerformiumSettingsTab extends PluginSettingTab {
  plugin: PerformiumPlugin;
  
  constructor(app: App, plugin: PerformiumPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  
  async display(): Promise<void> {
    const { containerEl } = this;
    containerEl.empty();

	const entries = await getTopPerformanceEntries(this.app);
    
    new Setting(containerEl)
      .setName("Performance points system version")
      .setDesc("Choose a preferred performance points system that will be used to calculate performance values. Different performance point systems give off different values from the default!")
      .addDropdown(dropdown => {
        dropdown.addOptions({
          "040625": "04-06-25 (v1.0.0)",
		      "041325": "04-13-25 (v1.1.0)",
		      "042925": "04-29-25 (v1.2.0)",
		      "050725": "05-07-25 (v1.3.0)",
		      "051425": "05-14-25 (v1.4.0)",
          "060925": "06-09-25 (v1.5.0)",
		      "080325": "08-03-25 (v1.6.0)",
          "011726": "01-17-26 (v1.6.1, Current)",
          "test": "Test System (v1.7.0b, EXPERIMENTAL)"
        });
        
        dropdown.setValue(this.plugin.settings.ppSystem);
        dropdown.onChange(async (value) => {
          this.plugin.settings.ppSystem = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("Secondary performance points system version")
      .setDesc("Select a secondary performance points system used for comparison of pp. Remember: Kindly read what's on the first setting!")
      .addDropdown(dropdown => {
        dropdown.addOptions({
          "040625": "04-06-25 (v1.0.0)",
		      "041325": "04-13-25 (v1.1.0)",
		      "042925": "04-29-25 (v1.2.0)",
		      "050725": "05-07-25 (v1.3.0)",
          "051425": "05-14-25 (v1.4.0)",
		      "080325": "08-03-25 (v1.6.0, Current)",
          "011726": "01-17-26 (v1.6.1, Current)",
          "test": "Test System (v1.7.0b, EXPERIMENTAL)"
        });
        
        dropdown.setValue(this.plugin.settings.secondaryPpSystem);
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
          new Notice('This feature is no longer available, thank you for using the plugin!');
          // const modal = new FocusTimeModal(this.app, this.plugin.settings.totalFocusTime ?? 0);
          // modal.open();
				});
			});

    const installTimestamp = this.plugin.settings.installTimestamp ?? Date.now();

	let factText: string = generateFact(installTimestamp, entries);
	  
    const totalTime = installTimestamp - Date.now();

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
