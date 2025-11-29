import { getTimeSinceDate } from "./timeSinceDate";
import { PerformanceEntry } from "../interfaces/performanceEntry";

// it may not be used or i don't know.
export function generateFact(installTimestamp: number, entries: PerformanceEntry[]): string {
  const array = [
    `Welcome to the other side! You are now in the beta version of Performium!`,
    `It has been ${getTimeSinceDate(installTimestamp)} since the plugin has been installed inside your vault!`,
    `Beep! Boop! Your getaway package has arrived!`,
    `This is way different from the stable release! Expect bugs or mistakes in the plugin!`,
    `In November 2025, the development has finally continued since the unexpected inactivity that occured in August 2025!`
  ];

    let fact: string = array[Math.floor(Math.random() * array.length)];
    return fact;
}
