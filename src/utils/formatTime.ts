/** Formats a seconds count as m:ss, capping the display at 999 seconds like classic Minesweeper timers. */
export function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.min(999, Math.floor(totalSeconds)));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
