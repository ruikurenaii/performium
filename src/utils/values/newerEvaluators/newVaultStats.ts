import { App } from 'obsidian';

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