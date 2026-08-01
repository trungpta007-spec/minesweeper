import type { Board, Cell } from '../types/game';

/** Builds an empty, mine-free board of the given dimensions. */
export function createEmptyBoard(rows: number, cols: number): Board {
  const board: Board = [];
  for (let r = 0; r < rows; r++) {
    const rowCells: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      rowCells.push({
        row: r,
        col: c,
        isMine: false,
        adjacentMines: 0,
        state: 'hidden',
        revealDepth: 0,
      });
    }
    board.push(rowCells);
  }
  return board;
}

/** Returns the (up to 8) in-bounds neighbor coordinates of a cell. */
export function getNeighbors(row: number, col: number, rows: number, cols: number) {
  const neighbors: { row: number; col: number }[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push({ row: nr, col: nc });
      }
    }
  }
  return neighbors;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Places `mineCount` mines on a fresh board, guaranteeing the clicked cell is
 * never a mine and preferring to keep its immediate neighbors clear too, so
 * the very first click tends to open up a decent-sized area rather than a
 * single lonely number. Falls back gracefully to "just not the clicked cell"
 * on tiny/dense custom boards where a fully empty safe zone isn't possible.
 */
export function generateBoardWithSafeZone(
  rows: number,
  cols: number,
  mineCount: number,
  safeRow: number,
  safeCol: number
): Board {
  const board = createEmptyBoard(rows, cols);

  const safeZone = new Set<string>([`${safeRow},${safeCol}`]);
  for (const n of getNeighbors(safeRow, safeCol, rows, cols)) {
    safeZone.add(`${n.row},${n.col}`);
  }

  const allCells: { row: number; col: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      allCells.push({ row: r, col: c });
    }
  }

  // Preferred pool: everything outside the click + its neighbors.
  let candidates = allCells.filter((cell) => !safeZone.has(`${cell.row},${cell.col}`));

  // Fallback for cramped custom boards: only the exact clicked cell is off-limits.
  if (candidates.length < mineCount) {
    candidates = allCells.filter((cell) => !(cell.row === safeRow && cell.col === safeCol));
  }

  const mineCells = shuffle(candidates).slice(0, mineCount);
  for (const { row, col } of mineCells) {
    board[row][col].isMine = true;
  }

  computeAdjacencyCounts(board, rows, cols);
  return board;
}

/** Fills in each cell's adjacentMines count based on placed mines. */
export function computeAdjacencyCounts(board: Board, rows: number, cols: number): void {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (const n of getNeighbors(r, c, rows, cols)) {
        if (board[n.row][n.col].isMine) count++;
      }
      board[r][c].adjacentMines = count;
    }
  }
}

export interface RevealResult {
  board: Board;
  revealedCells: { row: number; col: number }[];
  hitMine: boolean;
}

/**
 * Reveals a cell and, if it has no adjacent mines, flood-fills outward
 * through connected zero-value cells (classic BFS "open area" behavior),
 * revealing the numbered border around that area as it goes. Each newly
 * revealed cell is tagged with its BFS depth so the UI can stagger the
 * reveal animation outward from the click, ripple-style.
 */
export function revealCell(board: Board, rows: number, cols: number, row: number, col: number): RevealResult {
  const next: Board = board.map((r) => r.map((c) => ({ ...c })));
  const start = next[row][col];

  if (start.state !== 'hidden') {
    return { board: next, revealedCells: [], hitMine: false };
  }

  if (start.isMine) {
    start.state = 'revealed';
    start.revealDepth = 0;
    return { board: next, revealedCells: [{ row, col }], hitMine: true };
  }

  const revealedCells: { row: number; col: number }[] = [];
  const visited = new Set<string>([`${row},${col}`]);
  let frontier = [{ row, col, depth: 0 }];
  start.state = 'revealed';
  start.revealDepth = 0;
  revealedCells.push({ row, col });

  while (frontier.length > 0) {
    const nextFrontier: typeof frontier = [];
    for (const cell of frontier) {
      const current = next[cell.row][cell.col];
      // Only cells with zero adjacent mines "open up" their neighbors.
      if (current.adjacentMines !== 0) continue;

      for (const n of getNeighbors(cell.row, cell.col, rows, cols)) {
        const key = `${n.row},${n.col}`;
        if (visited.has(key)) continue;
        const neighborCell = next[n.row][n.col];
        if (neighborCell.state !== 'hidden' || neighborCell.isMine) continue;

        visited.add(key);
        neighborCell.state = 'revealed';
        neighborCell.revealDepth = cell.depth + 1;
        revealedCells.push({ row: n.row, col: n.col });
        nextFrontier.push({ row: n.row, col: n.col, depth: cell.depth + 1 });
      }
    }
    frontier = nextFrontier;
  }

  return { board: next, revealedCells, hitMine: false };
}

/** Toggles a hidden cell to flagged or a flagged cell back to hidden. Revealed cells are untouched. */
export function toggleFlag(board: Board, row: number, col: number): { board: Board; delta: -1 | 0 | 1 } {
  const next: Board = board.map((r) => r.map((c) => ({ ...c })));
  const cell = next[row][col];
  if (cell.state === 'hidden') {
    cell.state = 'flagged';
    return { board: next, delta: 1 };
  }
  if (cell.state === 'flagged') {
    cell.state = 'hidden';
    return { board: next, delta: -1 };
  }
  return { board: next, delta: 0 };
}

export function countFlaggedNeighbors(board: Board, rows: number, cols: number, row: number, col: number): number {
  let count = 0;
  for (const n of getNeighbors(row, col, rows, cols)) {
    if (board[n.row][n.col].state === 'flagged') count++;
  }
  return count;
}

export interface ChordResult extends RevealResult {
  /** True when the chord had the right flag count but a flag was misplaced, detonating a mine. */
  performed: boolean;
  explodedAt: { row: number; col: number } | null;
}

/**
 * "Chording": clicking an already-revealed number whose surrounding flag
 * count matches its own value reveals every other hidden neighbor at once.
 * If a flag was misplaced, this can still detonate a mine, mirroring
 * classic Minesweeper risk/reward.
 */
export function chordReveal(board: Board, rows: number, cols: number, row: number, col: number): ChordResult {
  const cell = board[row][col];
  if (cell.state !== 'revealed' || cell.adjacentMines === 0) {
    return { board, revealedCells: [], hitMine: false, performed: false, explodedAt: null };
  }

  const flaggedCount = countFlaggedNeighbors(board, rows, cols, row, col);
  if (flaggedCount !== cell.adjacentMines) {
    return { board, revealedCells: [], hitMine: false, performed: false, explodedAt: null };
  }

  let workingBoard = board;
  const allRevealed: { row: number; col: number }[] = [];
  let hitMine = false;
  let explodedAt: { row: number; col: number } | null = null;

  for (const n of getNeighbors(row, col, rows, cols)) {
    if (hitMine) break; // stop the chain the instant a mine goes off
    const neighborCell = workingBoard[n.row][n.col];
    if (neighborCell.state !== 'hidden') continue;
    const result = revealCell(workingBoard, rows, cols, n.row, n.col);
    workingBoard = result.board;
    allRevealed.push(...result.revealedCells);
    if (result.hitMine) {
      hitMine = true;
      explodedAt = { row: n.row, col: n.col };
    }
  }

  return { board: workingBoard, revealedCells: allRevealed, hitMine, performed: true, explodedAt };
}

/** A run is won once every non-mine cell has been revealed. */
export function isBoardCleared(board: Board, rows: number, cols: number, mineCount: number): boolean {
  let revealed = 0;
  const total = rows * cols;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].state === 'revealed') revealed++;
    }
  }
  return revealed === total - mineCount;
}

/** Flags every remaining mine and reveals every mine on the board, for the loss reveal-all moment. */
export function revealAllMines(board: Board, exploded: { row: number; col: number } | null): Board {
  return board.map((r) =>
    r.map((c) => {
      if (!c.isMine) return c;
      if (exploded && c.row === exploded.row && c.col === exploded.col) {
        return { ...c, state: 'revealed' as const };
      }
      // Leave correctly-flagged mines flagged; reveal the rest so the player sees the full field.
      if (c.state === 'flagged') return c;
      return { ...c, state: 'revealed' as const };
    })
  );
}

/** Picks a random hidden, non-mine cell for the hint feature. */
export function findHintCell(board: Board, rows: number, cols: number): { row: number; col: number } | null {
  const candidates: { row: number; col: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (cell.state === 'hidden' && !cell.isMine) candidates.push({ row: r, col: c });
    }
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function countFlagsPlaced(board: Board, rows: number, cols: number): number {
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].state === 'flagged') count++;
    }
  }
  return count;
}
