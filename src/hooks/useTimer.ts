import { useEffect, useState } from 'react';

/**
 * Ticks once a second while a game is in progress. Kept as its own hook (used
 * only inside the TopBar) so the once-a-second re-render never touches the
 * board/cell tree.
 */
export function useTimer(startedAt: number | null, endedAt: number | null): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!startedAt || endedAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [startedAt, endedAt]);

  if (!startedAt) return 0;
  const end = endedAt ?? now;
  return Math.floor((end - startedAt) / 1000);
}
