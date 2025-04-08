daysSinceCreation(): number {
  const now = Date.now();
  const installed = this.settings.installTimestamp ?? now;
  const days = (now - installed) / (1000 * 60 * 60 * 24);
  return Math.floor(days);
}
