import { AnimatePresence, motion } from 'framer-motion';
import { Flag, Info, Moon, RotateCcw, Sparkles, SunMedium, Timer, Trophy, Volume2, VolumeX, Undo2, Lightbulb, LayoutGrid } from 'lucide-react';
import { DIFFICULTIES } from '../constants';
import type { DifficultyKey, GameStatus } from '../types/game';
import { cn } from '../utils/cn';
import { IconButton } from './IconButton';
import { HUDStat } from './HUDStat';

interface TopBarProps {
  difficultyKey: DifficultyKey;
  onDifficultyChange: (difficulty: DifficultyKey) => void;
  onRestart: () => void;
  elapsed: number;
  remainingMines: number;
  status: GameStatus;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
  muted: boolean;
  onToggleMute: () => void;
  onToggleStats: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onHint: () => void;
  hintsRemaining: number;
  actionMode: 'reveal' | 'flag';
  onToggleActionMode: () => void;
}

export function TopBar({
  difficultyKey,
  onDifficultyChange,
  onRestart,
  elapsed,
  remainingMines,
  status,
  onToggleTheme,
  theme,
  muted,
  onToggleMute,
  onToggleStats,
  onUndo,
  canUndo,
  onHint,
  hintsRemaining,
  actionMode,
  onToggleActionMode,
}: TopBarProps) {
  const currentDifficulty = DIFFICULTIES[difficultyKey];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            <div className={cn('h-2.5 w-2.5 rounded-full bg-gradient-to-br', currentDifficulty.accent)} />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">X10THINK</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Minesweeper <span className="text-slate-500 dark:text-slate-400">for modern play</span>
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Safe first click, smooth motion, keyboard support, stats, and a board that feels premium on any screen.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <IconButton icon={<Undo2 className="h-4 w-4" />} aria-label="Undo move" onClick={onUndo} disabled={!canUndo} />
          <IconButton icon={<Lightbulb className="h-4 w-4" />} aria-label="Use hint" onClick={onHint} disabled={hintsRemaining <= 0 || status === 'won' || status === 'lost'} />
          <IconButton icon={<Flag className="h-4 w-4" />} aria-label="Toggle flag mode" onClick={onToggleActionMode} active={actionMode === 'flag'} />
          <IconButton icon={<LayoutGrid className="h-4 w-4" />} aria-label="Restart board" onClick={onRestart} />
          <IconButton icon={<Trophy className="h-4 w-4" />} aria-label="Open statistics" onClick={onToggleStats} />
          <IconButton icon={theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />} aria-label="Toggle theme" onClick={onToggleTheme} />
          <IconButton icon={muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />} aria-label="Toggle sound" onClick={onToggleMute} />
          <IconButton icon={<Info className="h-4 w-4" />} aria-label="Statistics and help" onClick={onToggleStats} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1.45fr,0.9fr,0.9fr]">
        <div className="glass-panel p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {(Object.keys(DIFFICULTIES) as DifficultyKey[]).map((key) => {
              const difficulty = DIFFICULTIES[key];
              const active = key === difficultyKey;
              return (
                <button
                  key={key}
                  onClick={() => onDifficultyChange(key)}
                  className={cn(
                    'chip transition-all duration-200',
                    active ? 'chip-active' : 'chip-idle',
                    active ? 'shadow-lg shadow-slate-900/10' : '',
                  )}
                >
                  <span className={cn('h-2.5 w-2.5 rounded-full bg-gradient-to-br', difficulty.accent)} />
                  {difficulty.label}
                </button>
              );
            })}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <HUDStat label="Timer" value={`${elapsed}s`} icon={<Timer className="h-3.5 w-3.5" />} />
            <HUDStat label="Mines" value={remainingMines.toString().padStart(3, '0')} icon={<Sparkles className="h-3.5 w-3.5" />} />
            <HUDStat label="Board" value={`${currentDifficulty.rows}×${currentDifficulty.cols}`} icon={<LayoutGrid className="h-3.5 w-3.5" />} />
          </div>
        </div>

        <motion.div className="glass-panel flex flex-col justify-between p-4" initial={false} animate={{ scale: status === 'won' ? 1.01 : 1 }} transition={{ type: 'spring', stiffness: 240, damping: 22 }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Game status</p>
            <div className="mt-2 flex items-center gap-3">
              <div className={cn('h-3 w-3 rounded-full', status === 'won' ? 'bg-emerald-500' : status === 'lost' ? 'bg-rose-500' : status === 'playing' ? 'bg-sky-500' : 'bg-slate-400')} />
              <h2 className="text-2xl font-semibold capitalize text-slate-900 dark:text-white">
                {status === 'idle' ? 'Ready' : status === 'playing' ? 'Playing' : status === 'won' ? 'Victory' : 'Boom'}
              </h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {status === 'idle'
                ? 'Make the opening move to generate a fair board.'
                : status === 'playing'
                  ? 'Use keyboard arrows, Enter, F, or click tiles directly.'
                  : status === 'won'
                    ? 'All safe cells are open. Reset for another run.'
                    : 'A mine was triggered. Reset and try a cleaner route.'}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-900"
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </button>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:border-white/10 dark:bg-slate-950/20 dark:text-slate-400">
              {actionMode === 'flag' ? 'Flag mode' : 'Reveal mode'}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
