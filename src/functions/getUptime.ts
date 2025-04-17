export function getUptime(startTime: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = Date.now();
  const uptime = now - startTime;

  const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}
