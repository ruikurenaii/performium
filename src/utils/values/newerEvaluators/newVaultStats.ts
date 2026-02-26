import { App, TFile } from 'obsidian';

export async function getTotalWordCount(app: App): Promise<number> {
    const files = app.vault.getMarkdownFiles();
    let totalWords = 0;
    
    for (const file of files) {
        const content = await app.vault.cachedRead(file);
        totalWords += countWords(content);
    }
    
    return totalWords;
}

function countWords(content: string): number {
    content = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    content = content.replace(/[[\]`#*_~>]/g, ' ');
    
    return content.split(/\s+/).filter(word => word.length > 0).length;
}

export async function getTotalSentences(app: App): Promise<number> {
  const files = app.vault.getMarkdownFiles();
  let totalSentences = 0;
  
  for (const file of files) {
    if (file instanceof TFile) {
      const content = await app.vault.read(file)

      const sentences = content.match(/[^.!?]+[.!?]+/g);
  
      if (sentences) {
        totalSentences += sentences.length;
      }
    }
  }
  
  return totalSentences;
}