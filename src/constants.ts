import type { DifficultyConfig, DifficultyKey } from './types/game';

export const STORAGE_KEYS = {
  game: 'x10think-minesweeper-game',
  stats: 'x10think-minesweeper-stats',
  theme: 'x10think-minesweeper-theme',
  mute: 'x10think-minesweeper-mute',
  mode: 'x10think-minesweeper-action-mode',
} as const;

export const DIFFICULTIES: Record<DifficultyKey, DifficultyConfig> = {
  easy: { key: 'easy', label: 'Easy', rows: 10, cols: 10, mines: 20, accent: 'from-sky-500 to-cyan-400' },
  medium: { key: 'medium', label: 'Medium', rows: 15, cols: 15, mines: 45, accent: 'from-indigo-500 to-blue-500' },
  hard: { key: 'hard', label: 'Hard', rows: 20, cols: 20, mines: 80, accent: 'from-violet-500 to-fuchsia-500' },
};

export const NUMBER_COLORS: Record<number, string> = {
  1: 'text-blue-600 dark:text-blue-400',
  2: 'text-emerald-600 dark:text-emerald-400',
  3: 'text-rose-600 dark:text-rose-400',
  4: 'text-violet-600 dark:text-violet-400',
  5: 'text-orange-500 dark:text-orange-400',
  6: 'text-cyan-600 dark:text-cyan-400',
  7: 'text-amber-700 dark:text-amber-300',
  8: 'text-slate-600 dark:text-slate-300',
};

export const MAX_HINTS = 3;
