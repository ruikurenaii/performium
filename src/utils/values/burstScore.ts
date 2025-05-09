export async function calculateBurstScore({
  totalFiles: number,
  totalParagraphs: number,
  averageSentencesPerParagraph: number,
  averageWordsPerSentence: number
}) {
  const burstDensity = (totalParagraphs * (averageSentencesPerParagraph / averageWordsPerSentence)) / totalFiles;
  const burstPrecision = 1 / (averageWordsPerSentence + 1);
  const burstFrequency = totalParagraphs / totalFiles;

  const burstScore = Math.pow(burstDensity * burstFrequency * burstPrecision, 0.61);

  return burstScore;
}