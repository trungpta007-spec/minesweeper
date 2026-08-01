import { motion } from 'framer-motion';
import { BarChart3, Lightbulb, Moon, RotateCcw, Sun, Undo2, Volume2, VolumeX } from 'lucide-react';
import type { DifficultyLevel, GameStatus } from '../../types/game';
import { DifficultySelector } from './DifficultySelector';
import { StatChip } from './StatChip';
import { TimerChip } from './TimerChip';
import { IconButton } from '../UI/IconButton';
import { MineIcon } from '../Board/MineIcon';

interface TopBarProps {
  difficulty: DifficultyLevel;
  status: GameStatus;
  minesRemaining: number;
  startedAt: number | null;
  endedAt: number | null;
  hintsRemaining: number;
  canUndo: boolean;
  isMuted: boolean;
  isDark: boolean;
  onSelectDifficulty: (level: Exclude<DifficultyLevel, 'custom'>) => void;
  onOpenCustom: () => void;
  onRestart: () => void;
  onUndo: () => void;
  onHint: () => void;
  onToggleMute: () => void;
  onToggleTheme: () => void;
  onOpenStats: () => void;
}

export function TopBar({
  difficulty,
  status,
  minesRemaining,
  startedAt,
  endedAt,
  hintsRemaining,
  canUndo,
  isMuted,
  isDark,
  onSelectDifficulty,
  onOpenCustom,
  onRestart,
  onUndo,
  onHint,
  onToggleMute,
  onToggleTheme,
  onOpenStats,
}: TopBarProps) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-3xl border border-border bg-surface/70 p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <DifficultySelector current={difficulty} onSelect={onSelectDifficulty} onOpenCustom={onOpenCustom} />
        <div className="flex items-center gap-1.5">
          <IconButton onClick={onOpenStats} label="View statistics">
            <BarChart3 size={18} />
          </IconButton>
          <IconButton onClick={onToggleMute} label={isMuted ? 'Unmute sound' : 'Mute sound'}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </IconButton>
          <IconButton onClick={onToggleTheme} label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <StatChip
          icon={<MineIcon className="h-4 w-4" />}
          value={String(minesRemaining)}
          label="Mines remaining"
          tone={minesRemaining < 0 ? 'warning' : 'default'}
        />

        <motion.button
          type="button"
          onClick={onRestart}
          whileHover={{ scale: 1.06, rotate: -8 }}
          whileTap={{ scale: 0.9, rotate: -25 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          aria-label="Restart game"
          title="Restart game"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-surface text-text shadow-sm hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        >
          <RotateCcw size={19} />
        </motion.button>

        <TimerChip startedAt={startedAt} endedAt={endedAt} />
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-display text-xs font-semibold text-text-muted transition-colors hover:bg-surface-muted hover:text-text disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
        >
          <Undo2 size={15} />
          Undo
        </button>
        <span className="h-4 w-px bg-border" />
        <button
          type="button"
          onClick={onHint}
          disabled={status !== 'playing' || hintsRemaining <= 0}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-display text-xs font-semibold text-text-muted transition-colors hover:bg-surface-muted hover:text-text disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
        >
          <Lightbulb size={15} />
          Hint ({hintsRemaining})
        </button>
      </div>
    </div>
  );
}
