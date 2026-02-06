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
    `I\'m too baffled enough to ask what even the great meme reset is.`,
    `Performium v1.6.2 and onwards is now being developed in a different platform: Linux!`,
    `The osu! Performance Points system is community-maintained, meaning rework suggestions from osu! players are also being chosen by them either way!`,
    `I\'m not sure what to put here, so here is a useless fun fact!`,
    `The developer of this plugin hasn\'t toucned this in months and now it\'s back!`,
    `There was a feature that is under development, and will be released as soon as possible!`,
    `You can suggest a rework by creating an issue in Performium\'s GitHub repository!`,
    `We suggest you calculate the overall performance in a more stable system!`,
    `Not all performance point systems are stable! The developer is trying to update to a new one with the fewest bugs possible!`,
    `There is another existing Performium project, but it was a Minecraft optimization pack??`,
    `I just wanna be honest here, this project was almost discontinued until the development is back after a long, unannounced hiatus!`,
    `You are one of the early birds to get this plugin during it\'s early development stage!`,
    `There were beta versions of the fun facts section, but they were never used!`,
    `More features will be added to Performium!`,
    `Was there a secret code for breaking the vault or am I dumb enough that this small sheet of paper I have didn\'t give the right password...`,
    `At May 15, 2025, at 1:46 AM (GMT +8), the plugin has been approved!`,
    `Some older fun facts from the previous versions of Performium were preserved. Hope you could still remember some older lines that got preserved in the meantime.`,
    `Future versions of Performium will (hopefully) make use of the new features implemented into Obsidian!`,
    `Using more plugins in Obsidian can slow down the load of the application!`,
    `Performium here in Obsidian is not a plugin that is not meant to boost the app\'s performance!`,
    `I will always remind you that this is just a fan-made implementation of the osu! performance point system for Obsidian!`,
    `You saw something that wasn\'t meant to be seen.`,
    `For now, you\'ll have to get used to getting bored from seeing this fun fact, so yeah. Have a cup of coffee while I do some work with the developer.`,
    `In v1.6.2, every single system became unusable despite every single value outputting a zero!`
  ];

	// count the total number of text lines
  array.push(`There are a total of ${array.length + 1} fun facts to encounter! Try to find them all!`);

	let fact: string = array[Math.floor(Math.random() * array.length)];
	return fact;
}
