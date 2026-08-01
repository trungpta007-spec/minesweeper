import type { GameStats } from '../types/game';
import { Modal } from './Modal';

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  stats: GameStats;
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950/20">
      <span className="text-slate-600 dark:text-slate-300">{label}</span>
      <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}

export function StatsModal({ open, onClose, stats }: StatsModalProps) {
  return (
    <Modal open={open} title="Match statistics" onClose={onClose}>
      <div className="grid gap-3 sm:grid-cols-2">
        <StatRow label="Games played" value={stats.gamesPlayed} />
        <StatRow label="Wins" value={stats.wins} />
        <StatRow label="Losses" value={stats.losses} />
        <StatRow label="Best time" value={stats.bestTime === null ? '—' : `${stats.bestTime}s`} />
        <StatRow label="Current streak" value={stats.currentStreak} />
        <StatRow label="Best streak" value={stats.bestStreak} />
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Stats are stored locally in your browser and survive refreshes.
      </p>
    </Modal>
  );
}
