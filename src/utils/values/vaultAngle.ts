export function calculateVaultAngle(totalFiles: number, totalFolders: number, totalParagraphs: number) {
  const numerator = totalFiles + totalFolders;
  const chaosFactor = totalParagraphs ? numerator / totalParagraphs : 1;
  const k = 6;
  const x = Math.max(0, Math.min(1, chaosFactor));
  const smoothedChaos = 1 / (1 + Math.exp(-k * (x - 0.5)));
  const angle = (1 - smoothedChaos) * 359 + 1;
  return angle;
}
