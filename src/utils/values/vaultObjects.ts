export async function calculateVaultObjects({
  totalFiles,
  totalWords,
  averageParagraphLength,
  averageSentencesPerParagraph,
  averageWordsPerSentence,
  longestSentenceLength,
  longestParagraphLength
}: {
  totalFiles: number,
  totalWords: number,
  averageParagraphLength: number,
  averageSentencesPerParagraph: number,
  averageWordsPerSentence: number,
  longestSentenceLength: number,
  longestParagraphLength: number
}) {
  circleFactor = totalFiles / (totalWords + 1);
  sliderFactor = (averageParagraphLength * averageSentencesPerParagraph) / (averageWordsPerSentence + 1);
  spinnerFactor = Math.log2(longestParagraphLength + longestSentenceLength + 1);

  const circleObjects = Math.pow(baseCircles, 0.75) * (1 - Math.min(0.5, Math.log2(averageWordsPerFile + 1) / 10));
  const sliderObjects = Math.pow(baseSliders, 0.9) * (1 - Math.min(0.3, 1 / (averageParagraphLength + 1)));
  const spinnerObjects = Math.pow(baseSpinners, 1.2) / (1 + 0.05 * totalSentences);

  const scale = (value, max) => Math.min(100, (value / max) * 100);

  const finalCircles = scale(circleObjects, circleFactor / 10);
  const finalSliders = scale(sliderObjects, sliderFactor / 10);
  const finalSpinners = scale(spinnerObjects, spinnerFactor / 10);

  return {
    circles: Math.trunc(finalCircles),
    sliders: Math.trunc(finalSliders),
    spinners: Math.trunc(finalSpinners)
  }
}
