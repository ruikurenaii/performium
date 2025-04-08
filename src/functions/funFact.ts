import { timeFormat } from "../utils/values/timeFormat";
import { getTimeSinceCreation } from "./timeSinceCreation";

// it may not be used or i don't know.
export function generateFact(): string {
  const array = [
    `It has been ${getTimeSinceCreation()} since the plugin has been installed inside your vault.`,
    `Performium is not meant to boost your application\'s performance!`,
    `Performium was first released on April 6, 2025.`,
    `Some updates may take a while and this is mainly because of the performance points system reworks.`,
    `The developer stayed up just to develop this, which is why you need to buy him a coffee to keep them awake.`,
		`Once you wrote something short and not concise, the value may get low.`,
    `I am a fun fact that may be useless, but it may change over time.`,
    `The higher the size of your vault, the higher you gain performance points!`,
    `Is it just me, or something feels odd around here?`
  ];

	let fact: string = `Fun fact: ${array[Math.floor(Math.random() * array.length)]}`;
	return fact;
}
