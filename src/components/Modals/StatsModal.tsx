import { Flame, RotateCcw, Target, Trophy } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from '../UI/Button';
import type { GameStats } from '../../types/game';
import { DIFFICULTIES } from '../../constants/difficulties';
import { formatTime } from '../../utils/formatTime';

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  stats: GameStats;
  onReset: () => void;
}

function StatBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-muted p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-accent-blue">{icon}</div>
      <div className="min-w-0">
        <p className="truncate text-xs text-text-muted">{label}</p>
        <p className="font-display text-base font-bold text-text">{value}</p>
      </div>
    </div>
  );
}

export function StatsModal({ open, onClose, stats, onReset }: StatsModalProps) {
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

  return (
    <Modal open={open} onClose={onClose} title="Your statistics">
      <div className="grid grid-cols-2 gap-2.5">
        <StatBlock icon={<Target size={17} />} label="Games played" value={String(stats.gamesPlayed)} />
        <StatBlock icon={<Trophy size={17} />} label="Win rate" value={`${winRate}%`} />
        <StatBlock icon={<Flame size={17} />} label="Current streak" value={String(stats.currentStreak)} />
        <StatBlock icon={<Flame size={17} />} label="Best streak" value={String(stats.bestStreak)} />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Best times</p>
        <div className="space-y-1.5">
          {(['easy', 'medium', 'hard'] as const).map((level) => (
            <div key={level} className="flex items-center justify-between rounded-xl bg-surface-muted px-3 py-2 text-sm">
              <span className="text-text-muted">{DIFFICULTIES[level].label}</span>
              <span className="font-display font-semibold text-text">
                {stats.bestTimes[level] !== undefined ? formatTime(stats.bestTimes[level] as number) : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-text-muted">
          {stats.wins} wins · {stats.losses} losses
        </p>
        <Button onClick={onReset} variant="ghost" icon={<RotateCcw size={14} />}>
          Reset
        </Button>
      </div>
    </Modal>
  );
}
