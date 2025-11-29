import { timeFormat } from "../utils/values/timeFormat";
import { getTimeSinceDate } from "./timeSinceDate";
import { PerformanceEntry } from "../interfaces/performanceEntry";
import { getTopPerformanceEntries } from "./getTopPerformanceEntries";

// it may not be used or i don't know.
export function generateFact(installTimestamp: number, entries: PerformanceEntry[]): string {
  const array = [
    `It has been ${getTimeSinceDate(installTimestamp)} since the plugin has been installed inside your vault!`,
    `Performium is not meant to boost your application's performance!`,
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
    `The developer tried to work as hard as they could, but they're still not getting some money! (Leaving a donation would be fine)`,
    `Performium v1.2.0 added another update to the pp system, with some changes similar to osu!`,
    `I wasn't happy watching the developer suffer making everything including this...`,
    `The developer only coded this from a mobile phone without any test compiling in it!`,
    `There's an official discord server in which you can join by copying this link: https://discord.gg/hXTFFQHC2Q`,
    `The developer tried to add something else, but didn't work at all, so they scrapped the addition!`,
    `The developer got their phone stolen in April Fools 2024 and never got it back! That's not funny at all!`,
    `Every rework changes the values? Latest changes made are also available in beta versions!`,
    `This might feel like having either the splash texts from minecraft and terraria...`,
    `Never gonna give you up, never gonna let you down, never gonna run around and desert you!`,
    `Some changes to the pp values might be the rebalance changes...`,
    `If you are reading this, then I would like to congratulate you! You are now officially reading the longest line you have ever saw possible in this \"Fun Fact\" section! Have you know how long it took you to get this one? I mean, I had no clue about this either, so don't ask me, haha!`,
    `Who said things aren't going well right now?`,
    `YAP YAP YAPPATRON, I HAD ENOUGH YAPPING FOR TODAY 🗣️🔥`,
    `In the 11th of May, 2025, the developer\'s phone storage had more than 100 beta builds of performium for mobile testing!`,
    `After Performium v1.3.0 has been released, the developer switched to developing this plugin on a laptop!`,
    `Almost every commit before releasing Performium v1.4.0 are all pp rebalances and parity with osu! minor and major pp reworks!`,
    `Who said making this plugin wasn\'t possible at all?`,
    `No one had ever thought of integrating the osu! pp system into the app until the 6th of April, 2025!`,
    `At May 15, 2025, at 1:46 AM (GMT +7), the plugin has been approved!`,
    `More features of the plugin are coming soon!`,
    `Reworks take longer than expected, unless it minorly impacts the performance points system!`,
    `The bigger your vault, the longer it would take the performance calculation to finish!`,
    `This plugin's integration is not official, and may differ from the official osu! performance points system`,
	  `I- Shucks... I forgot what I have to say again, this is quite annoying though...`,
    `Before releasing a new update to the plugin, reworks to the performance points system can take a while to be done. To test these reworks being done for the next update, beta builds are available in the GitHub repository!`,
    `The developer can't have more ideas to put in this tab, so while they're thinking of some new stuff, join the discord server and suggest some facts!`,
    `Performium 1.5.0 might be the longest update to ever release in this plugin's history!`
  ];

	// putting other facts outside since the array can't be declared while it's black-scoped
	array.push(`There is a 1 in ${array.length + 1} chance that you get this pointless fun fact (${((1 / (array.length + 1)) * 100).toFixed(2)}%)!`);

    // adding another fact, weighing the total performance points of the user
	const sortedValue = entries.map(e => e.value).sort((a, b) => b - a);
	const weightedValue = sortedValue.reduce((acc, value, index) => acc + value * Math.pow(0.95, index), 0);

	array.push(`Crunching all of the performance values you have calculated will give you ${new Intl.NumberFormat().format(Math.trunc(weightedValue))}pp!`);

    // add another fact regarding the 2k38 problem
	if ((Date.now() / 1000) >= 2147483647) {
      array.push(`It has been ${new Intl.NumberFormat().format(Math.trunc((Date.now() / 1000) - 2147483647))} seconds since the 2K38 problem! So long, 32-bit computers, you will forever be missed!`);
	} else {
      array.push(`There are ${new Intl.NumberFormat().format(Math.trunc(2147483647 - (Date.now() / 1000)))} seconds before the 2K38 problem! I guess the end of 32-bit computers are near!`);
	}

	let fact: string = array[Math.floor(Math.random() * array.length)];
	return fact;
}
