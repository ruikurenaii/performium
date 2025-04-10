import { timeFormat } from "../utils/values/timeFormat";
import { getTimeSinceDate } from "./timeSinceDate";

// it may not be used or i don't know.
export function generateFact(installTimestamp: number): string {
  const array = [
    `It has been ${getTimeSinceDate(installTimestamp)} since the plugin has been installed inside your vault!`,
    `Performium is not meant to boost your application\'s performance!`,
    `Performium was first released on April 6, 2025!`,
    `Some updates may take a while and this is mainly because of the performance points system reworks!`,
    `The developer himself didn't get to sleep because of staying all night developing this plugin without a coffee, which is why you need to buy one located in the plugin's page!`,
    `Once you wrote something short and not concise, the value may get low!`,
    `This is a fun fact that may be useless, but it may change every time you open this?`,
    `The higher the size of your vault, the higher you gain performance points!`,
    `Is it just me, or something feels odd around here?`,
    `Older performance point systems can be put in the settings for future updates!`,
    `Chicken jockey!!`,
    `The developer is an osu! player that goes under the name of hoshinoTaka01?`,
    `The creation date of Performium was also the same day as it was released!`,
    `The beta versions of the plugin are available in the actions tab, but it requires a GitHub account!`,
    `Statistics show that you are ${(Math.random() * 99) + 1}% random!`,
    `I'm sick of spitting out facts everytime you open the plugin settings...`,
    `There was another plugin from the same developer, but it will never be planned for release because it will take him a long time to optimize and organize the code in order to abide by the plugin guidelines!`,
    `Do a flip!`,
  	`Performium took inspiration from the old plugin, Commodity!`,
    `There's nothing else to spit out, so... GET OUT 🗣️🔥`,
    `Before Performium, the developer relied on ChatGPT about the plugin names, and yet, this name was taken, which was originally thought by the developer himself!`,
    `If you're not sure what different performance point systems mean, newer versions mean newer components, like having new lines the weren't in the older versions in the source code!`,
    `There are a variety of facts you can get! Try to get them all, will you?`,
	  `The first version of Performium's pp system wasn't complex enough, while the test version has more of it, but the values may break!`,
    `The developer tried to work as hard as they could, but they're still not getting some money! (Leaving a donation would be fine)`
  ];

	// putting other facts outside since the array can't be declared while it's black-scoped
	array.push(`There is a 1 in ${array.length + 1} chance that you get this pointless fun fact (${((1 / array.length) * 100).toFixed(2)}%)!`);

	let fact: string = array[Math.floor(Math.random() * array.length)];
	return fact;
}
