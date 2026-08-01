export function formatDuration(seconds: number | null): string {
  if (!seconds) return '00:00';

  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600) / 60;
  const s = Math.floor(seconds % 60);

  const format = (num: number): string => String(num).padStart(2, '0');

  return h > 0
    ? `${format(h)}:${format(m)}:${format(s)}`
    : `${format(m)}:${format(s)}`;
}
