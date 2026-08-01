import type { DifficultyConfig, DifficultyLevel } from '../types/game';

/** Mine density is fixed at 20% across every preset. */
export const DIFFICULTIES: Record<Exclude<DifficultyLevel, 'custom'>, DifficultyConfig> = {
  easy: { id: 'easy', label: 'Easy', rows: 10, cols: 10, mines: 20 },
  medium: { id: 'medium', label: 'Medium', rows: 15, cols: 15, mines: 45 },
  hard: { id: 'hard', label: 'Hard', rows: 20, cols: 20, mines: 80 },
};

export const DIFFICULTY_ORDER: DifficultyLevel[] = ['easy', 'medium', 'hard', 'custom'];

export const MINE_DENSITY = 0.2;

export const CUSTOM_BOARD_LIMITS = {
  minRows: 5,
  maxRows: 24,
  minCols: 5,
  maxCols: 24,
};

export const MAX_HINTS = 3;

export const AUTOSAVE_KEY = 'minesweeper.save.v1';
export const STATS_KEY = 'minesweeper.stats.v1';
export const THEME_KEY = 'minesweeper.theme.v1';
export const SOUND_KEY = 'minesweeper.sound.v1';

/** Tailwind-driven color tokens for numbered cells, keyed by adjacent mine count. */
export const NUMBER_COLOR_CLASS: Record<number, string> = {
  1: 'text-number-1',
  2: 'text-number-2',
  3: 'text-number-3',
  4: 'text-number-4',
  5: 'text-number-5',
  6: 'text-number-6',
  7: 'text-number-7',
  8: 'text-number-8',
};
