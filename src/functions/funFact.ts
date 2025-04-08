import { timeFormat } from "../utils/values/timeFormat";
import { getTimeSinceCreation } from "./timeSinceCreation";

// it may not be used or i don't know.
export function generateFact(): string {
  const array = [
    `It has been ${getTimeSinceCreation()} since the plugin has been installed inside your vault.`,
    `Performium is not meant to boost your application\'s performance!`,
		`It took the developer a few days to make this plugin.`,
    `Performium was first released on April 6, 2025.`,
    `Some updates may take a while and this is mainly because of the performance points system reworks.`,
    `The developer stayed up just to develop this, which is why you need to buy him a coffee to keep them awake.`
  ];

	return `Fun fact: ${array[Math.floor(Math.random() * array.length)]}`;
}
