export function calculateStarRating(totalParagraphs: number, vaultAngle: number): number {
  const paragraphScalingFactor = 0.0005;
  const angleScalingFactor = 0.05;
  const exponentialGrowthFactor = 0.0005;
  const angleLogarithmBase = 2.7;

  const paragraphScaling = Math.log(totalParagraphs + 1) * paragraphScalingFactor;
  const paragraphExponentialDecay = Math.exp(totalParagraphs * exponentialGrowthFactor) - 1;
  const angleSinusoidal = Math.sin(vaultAngle * Math.PI / 180) * Math.cos(vaultAngle * Math.PI / 360) * Math.log(vaultAngle + 2) * angleScalingFactor;
  
  let finalRating = paragraphScaling + paragraphExponentialDecay + angleSinusoidal;

  finalRating += Math.sqrt(totalParagraphs + 1) * 0.05;
  finalRating += Math.pow(vaultAngle, 0.25) * 0.1;

  finalRating = finalRating + Math.log(finalRating + 1) * 0.2;

  const contentSrBonus = (Math.pow(finalRating, 0.8) / 4.7) + (Math.pow(totalParagraphs, 0.05) / 13.65);

  finalRating += contentSrBonus;

  return finalRating;
}
