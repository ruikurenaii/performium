/*

  base.ts: the first tab of the options section

*/

import { App, PluginSettingTab, Setting } from "obsidian";

export interface PerformiumBaseSettings {
  ppSystem: string;
}

export const DEFAULT_SETTINGS: PerformiumBaseSettings = {
  ppSystem: "040625"
};

export class PerformiumSettingsTab extends PluginSettingTab {
  plugin: any;

  constructor(app: App, plugin: any) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
  const { containerEl } = this;
  containerEl.empty();

  new Setting(containerEl)
    .setName("PP System Version")
    .setDesc("Select a PP system used for calculaton. Remember: Different PP system means different values!")
    .addDropdown(dropdown => {
      dropdown.addOptions({
        "040625": "04-06-25",
		"test": "Test System (EXPERIMENTAL)"
      });

      dropdown.setValue(this.plugin.settings.ppSystem);
      dropdown.onChange(async (value) => {
        this.plugin.settings.ppSystem = value;
        await this.plugin.saveSettings();
      });
    });
  }
}
