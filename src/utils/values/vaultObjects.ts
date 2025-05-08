export async function calculateVaultObjects({
  totalFiles,
  totalWords,
  averageParagraphLength,
  averageSentencesPerParagraph,
  averageWordsPerSentence,
  longestSentenceLength,
  longestParagraphLength,
  averageWordsPerFile,
  totalSentences
}: {
  totalFiles: number,
  totalWords: number,
  averageParagraphLength: number,
  averageSentencesPerParagraph: number,
  averageWordsPerSentence: number,
  longestSentenceLength: number,
  longestParagraphLength: number,
  averageWordsPerFile: number,
  totalSentences: number
}) {
  const circleFactor = totalFiles / (totalWords + 1);
  const sliderFactor = (averageParagraphLength * averageSentencesPerParagraph) / (averageWordsPerSentence + 1);
  const spinnerFactor = Math.log2(longestParagraphLength + longestSentenceLength + 1);

  const circleObjects = Math.pow(circleFactor, 0.75) * (1 - Math.min(0.5, Math.log2(averageWordsPerFile + 1) / 10));
  const sliderObjects = Math.pow(sliderFactor, 0.9) * (1 - Math.min(0.3, 1 / (averageParagraphLength + 1)));
  const spinnerObjects = Math.pow(spinnerFactor, 1.2) / (1 + 0.05 * totalSentences);

  const scale = (value: number, max: number) => Math.min(100, (value / max) * 100);

  const finalCircles: number = scale(circleObjects, circleFactor * (1 + (3.1415926535 / 6.6)));
  const finalSliders: number = scale(sliderObjects, sliderFactor * (1 + (3.1415926535 / 10)));
  const finalSpinners: number = scale(spinnerObjects, spinnerFactor * (1 / 17));

  return {
    circles: Math.trunc(finalCircles),
    sliders: Math.trunc(finalSliders),
    spinners: Math.trunc(finalSpinners)
  }
}
