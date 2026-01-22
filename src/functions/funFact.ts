// import { timeFormat } from "../utils/values/timeFormat";
// import { getTimeSinceDate } from "./timeSinceDate";
// import { PerformanceEntry } from "../interfaces/performanceEntry";
// import { getTopPerformanceEntries } from "./getTopPerformanceEntries";

// it may not be used or i don't know.
export function generateFact(): string {
  const array = [
    `As of January 22, 2026, the old fun facts were removed in favor of the new ones!`,
    `I use Arch Linux by the way!`,
    `PP stands for performance points! It also came from the rhythm game, osu!`,
    `You have encountered the most useless fun fact ever.`,
    `If you force yourself to step away from your gadgets and focus on your studies, it\'s uncertain to know that either it\'s effective or not.`,
    `The developer got blind in the middle of 2025!`,
    `It\'s either you take a break or something would just start to feel strange.`,
    `What even if the great meme reset?????`
  ];

	// count the total number of text lines
  array.push(`There are a total of ${array.length + 1} fun facts to encounter! Try to find them all!`);

	let fact: string = array[Math.floor(Math.random() * array.length)];
	return fact;
}
