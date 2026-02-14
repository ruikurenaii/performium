// this is just a remade version of my previous vault angle evaluator
// for now, it will still be used since there is no plan on getting it removed
export async function calculateVaultCleanliness(totalFiles: number, totalFolders: number, totalParagraphs: number) {
  const numerator = totalFiles + totalFolders;
  const chaosFactor = totalParagraphs ? numerator / totalParagraphs : 1;
  const k = 12;
  const x = Math.max(0, Math.min(1, chaosFactor));
  const smoothedChaos = 1 / (1 + Math.exp(-k * (x - 0.5)));

  const strictChaos = Math.pow(smoothedChaos, 1.5);
  const value = (1 - strictChaos) * 9 + 1;
  return Math.round(value * 10) / 10;
}