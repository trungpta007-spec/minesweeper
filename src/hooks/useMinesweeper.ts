import { useCallback, useEffect, useMemo, useReducer } from 'react';
import type { DifficultyLevel, GameSnapshot, GameState } from '../types/game';
import { AUTOSAVE_KEY, DIFFICULTIES, MAX_HINTS } from '../constants/difficulties';
import {
  chordReveal,
  createEmptyBoard,
  findHintCell,
  generateBoardWithSafeZone,
  isBoardCleared,
  revealAllMines,
  revealCell,
  toggleFlag as toggleFlagUtil,
} from '../utils/boardUtils';

type Action =
  | { type: 'NEW_GAME'; difficulty: DifficultyLevel; rows: number; cols: number; mines: number }
  | { type: 'REVEAL'; row: number; col: number }
  | { type: 'TOGGLE_FLAG'; row: number; col: number }
  | { type: 'UNDO' }
  | { type: 'HINT' }
  | { type: 'RESTORE'; state: GameState };

let gameCounter = 0;

function createInitialState(difficulty: DifficultyLevel, rows: number, cols: number, mines: number): GameState {
  gameCounter += 1;
  return {
    board: createEmptyBoard(rows, cols),
    rows,
    cols,
    mines,
    difficulty,
    status: 'idle',
    flagsPlaced: 0,
    revealedCount: 0,
    firstClickDone: false,
    startedAt: null,
    endedAt: null,
    explodedCell: null,
    undoSnapshot: null,
    hintsRemaining: MAX_HINTS,
    gameId: gameCounter,
  };
}

function snapshotOf(state: GameState): GameSnapshot {
  return {
    board: state.board,
    flagsPlaced: state.flagsPlaced,
    revealedCount: state.revealedCount,
    firstClickDone: state.firstClickDone,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'NEW_GAME':
      return createInitialState(action.difficulty, action.rows, action.cols, action.mines);

    case 'RESTORE':
      return action.state;

    case 'TOGGLE_FLAG': {
      if (state.status === 'won' || state.status === 'lost') return state;
      const cell = state.board[action.row][action.col];
      if (cell.state === 'revealed') return state;
      const { board, delta } = toggleFlagUtil(state.board, action.row, action.col);
      return { ...state, board, flagsPlaced: state.flagsPlaced + delta };
    }

    case 'REVEAL': {
      if (state.status === 'won' || state.status === 'lost') return state;
      const targetCell = state.board[action.row][action.col];
      if (targetCell.state === 'flagged') return state;

      // Left-clicking an already-open number chords it instead of doing nothing.
      if (targetCell.state === 'revealed') {
        if (targetCell.adjacentMines === 0) return state;
        const chordResult = chordReveal(state.board, state.rows, state.cols, action.row, action.col);
        if (!chordResult.performed || chordResult.revealedCells.length === 0) return state;
        const snapshot = snapshotOf(state);

        if (chordResult.hitMine) {
          const finalBoard = revealAllMines(chordResult.board, chordResult.explodedAt);
          return {
            ...state,
            board: finalBoard,
            status: 'lost',
            endedAt: Date.now(),
            explodedCell: chordResult.explodedAt,
            undoSnapshot: snapshot,
          };
        }

        const revealedCount = state.revealedCount + chordResult.revealedCells.length;
        const won = isBoardCleared(chordResult.board, state.rows, state.cols, state.mines);
        return {
          ...state,
          board: chordResult.board,
          revealedCount,
          status: won ? 'won' : state.status,
          endedAt: won ? Date.now() : state.endedAt,
          undoSnapshot: snapshot,
        };
      }

      // Hidden cell: normal reveal. The board is generated lazily on the very first click.
      const snapshot = snapshotOf(state);
      let workingBoard = state.board;
      let startedAt = state.startedAt;
      const firstClickDone = true;

      if (!state.firstClickDone) {
        workingBoard = generateBoardWithSafeZone(state.rows, state.cols, state.mines, action.row, action.col);
        startedAt = Date.now();
      }

      const result = revealCell(workingBoard, state.rows, state.cols, action.row, action.col);

      if (result.hitMine) {
        const finalBoard = revealAllMines(result.board, { row: action.row, col: action.col });
        return {
          ...state,
          board: finalBoard,
          status: 'lost',
          startedAt,
          endedAt: Date.now(),
          explodedCell: { row: action.row, col: action.col },
          undoSnapshot: snapshot,
          firstClickDone,
        };
      }

      const revealedCount = state.revealedCount + result.revealedCells.length;
      const won = isBoardCleared(result.board, state.rows, state.cols, state.mines);
      return {
        ...state,
        board: result.board,
        status: won ? 'won' : 'playing',
        startedAt,
        endedAt: won ? Date.now() : state.endedAt,
        revealedCount,
        firstClickDone,
        undoSnapshot: snapshot,
      };
    }

    case 'HINT': {
      if (state.status !== 'playing' || state.hintsRemaining <= 0) return state;
      const hintCell = findHintCell(state.board, state.rows, state.cols);
      if (!hintCell) return state;
      const snapshot = snapshotOf(state);
      const result = revealCell(state.board, state.rows, state.cols, hintCell.row, hintCell.col);
      const revealedCount = state.revealedCount + result.revealedCells.length;
      const won = isBoardCleared(result.board, state.rows, state.cols, state.mines);
      return {
        ...state,
        board: result.board,
        revealedCount,
        hintsRemaining: state.hintsRemaining - 1,
        status: won ? 'won' : state.status,
        endedAt: won ? Date.now() : state.endedAt,
        undoSnapshot: snapshot,
      };
    }

    case 'UNDO': {
      if (!state.undoSnapshot) return state;
      const snap = state.undoSnapshot;
      return {
        ...state,
        board: snap.board,
        flagsPlaced: snap.flagsPlaced,
        revealedCount: snap.revealedCount,
        firstClickDone: snap.firstClickDone,
        status: snap.firstClickDone ? 'playing' : 'idle',
        startedAt: snap.firstClickDone ? state.startedAt : null,
        endedAt: null,
        explodedCell: null,
        undoSnapshot: null,
      };
    }

    default:
      return state;
  }
}

function loadAutosave(): GameState | null {
  try {
    const raw = window.localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (parsed.status !== 'playing') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function useMinesweeper() {
  const initial = useMemo(() => {
    const saved = loadAutosave();
    if (saved) return saved;
    const easy = DIFFICULTIES.easy;
    return createInitialState('easy', easy.rows, easy.cols, easy.mines);
  }, []);

  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    try {
      if (state.status === 'playing') {
        window.localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(state));
      } else if (state.status === 'won' || state.status === 'lost') {
        window.localStorage.removeItem(AUTOSAVE_KEY);
      }
    } catch {
      // Storage unavailable — game still works, it just won't resume after a refresh.
    }
  }, [state]);

  const newGame = useCallback((difficulty: Exclude<DifficultyLevel, 'custom'>) => {
    const config = DIFFICULTIES[difficulty];
    dispatch({ type: 'NEW_GAME', difficulty, rows: config.rows, cols: config.cols, mines: config.mines });
  }, []);

  const newCustomGame = useCallback((rows: number, cols: number, mines: number) => {
    dispatch({ type: 'NEW_GAME', difficulty: 'custom', rows, cols, mines });
  }, []);

  const restartSameDifficulty = useCallback(() => {
    dispatch({ type: 'NEW_GAME', difficulty: state.difficulty, rows: state.rows, cols: state.cols, mines: state.mines });
  }, [state.difficulty, state.rows, state.cols, state.mines]);

  const reveal = useCallback((row: number, col: number) => dispatch({ type: 'REVEAL', row, col }), []);
  const toggleFlag = useCallback((row: number, col: number) => dispatch({ type: 'TOGGLE_FLAG', row, col }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const hint = useCallback(() => dispatch({ type: 'HINT' }), []);

  return {
    state,
    newGame,
    newCustomGame,
    restartSameDifficulty,
    reveal,
    toggleFlag,
    undo,
    hint,
    canUndo: state.undoSnapshot !== null && state.status !== 'won',
    minesRemaining: state.mines - state.flagsPlaced,
  };
}
