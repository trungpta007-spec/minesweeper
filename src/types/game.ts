/** A single tile's interaction state. No "question mark" state per spec. */
export type CellState = 'hidden' | 'revealed' | 'flagged';

/** Overall game lifecycle. */
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

/** Named difficulty presets, plus a user-defined custom board. */
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'custom';

export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  /** Count of mines in the 8 surrounding cells. */
  adjacentMines: number;
  state: CellState;
  /**
   * BFS layer this cell was revealed in during a flood fill, used purely to
   * stagger the reveal animation outward from the origin. Reset per reveal.
   */
  revealDepth: number;
}

export type Board = Cell[][];

export interface DifficultyConfig {
  id: DifficultyLevel;
  label: string;
  rows: number;
  cols: number;
  mines: number;
}

export interface GameSnapshot {
  board: Board;
  flagsPlaced: number;
  revealedCount: number;
  firstClickDone: boolean;
}

export interface GameState {
  board: Board;
  rows: number;
  cols: number;
  mines: number;
  difficulty: DifficultyLevel;
  status: GameStatus;
  flagsPlaced: number;
  revealedCount: number;
  firstClickDone: boolean;
  /** ms timestamp when the first reveal happened; timer basis. */
  startedAt: number | null;
  /** ms timestamp when the game ended (win/loss); freezes the timer. */
  endedAt: number | null;
  /** Origin of the fatal mine, drives the explosion animation. */
  explodedCell: { row: number; col: number } | null;
  /** One-shot undo buffer of the previous board state. */
  undoSnapshot: GameSnapshot | null;
  hintsRemaining: number;
  /** Monotonically increasing id, bumped on every new game to reset UI/animations. */
  gameId: number;
}

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  currentStreak: number;
  bestStreak: number;
  bestTimes: Partial<Record<DifficultyLevel, number>>;
}

export interface CustomBoardOptions {
  rows: number;
  cols: number;
  mines: number;
}
