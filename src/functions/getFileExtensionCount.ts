import { App } from 'obsidian';

export async function getFileExtensionCount(app: App): Promise<any> {
  const counts: Record<string, number> = {};

  this.app.vault.getFiles().forEach((file: { extension: any; }) => {
    const ext = file.extension;

    if (!counts[ext]) counts[ext] = 0;
    counts[ext]++;
  });

  // console.log(counts);

  return counts;
}