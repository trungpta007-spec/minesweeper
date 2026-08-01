import type { CellData, Point } from '../types/game';

export function keyOf(point: Point): string {
  return `${point.row}:${point.col}`;
}

export function inBounds(row: number, col: number, rows: number, cols: number) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

export function getNeighbors(point: Point, rows: number, cols: number): Point[] {
  const neighbors: Point[] = [];
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) continue;
      const row = point.row + rowOffset;
      const col = point.col + colOffset;
      if (inBounds(row, col, rows, cols)) {
        neighbors.push({ row, col });
      }
    }
  }
  return neighbors;
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

export function createEmptyBoard(rows: number, cols: number): CellData[][] {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      hasMine: false,
      isRevealed: false,
      isFlagged: false,
      isExploded: false,
      adjacentMines: 0,
    })),
  );
}

export function cloneBoard(board: CellData[][]): CellData[][] {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

export function generateBoard(rows: number, cols: number, mines: number, firstClick: Point): CellData[][] {
  const board = createEmptyBoard(rows, cols);
  const allCells: Point[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      allCells.push({ row, col });
    }
  }

  const safeZone = new Set<string>();
  safeZone.add(keyOf(firstClick));
  for (const neighbor of getNeighbors(firstClick, rows, cols)) {
    safeZone.add(keyOf(neighbor));
  }

  // Prefer a generous opening by excluding the clicked cell and its neighbors.
  // If the board were ever too small for that, we still keep the clicked cell safe.
  const preferredPool = allCells.filter((point) => !safeZone.has(keyOf(point)));
  const fallbackPool = allCells.filter((point) => keyOf(point) !== keyOf(firstClick));
  const pool = preferredPool.length >= mines ? preferredPool : fallbackPool;
  const minePositions = new Set(shuffle(pool).slice(0, mines).map(keyOf));

  for (const row of board) {
    for (const cell of row) {
      cell.hasMine = minePositions.has(keyOf(cell));
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cell = board[row][col];
      if (cell.hasMine) continue;
      let count = 0;
      for (const neighbor of getNeighbors({ row, col }, rows, cols)) {
        if (board[neighbor.row][neighbor.col].hasMine) count += 1;
      }
      cell.adjacentMines = count;
    }
  }

  return board;
}

export function revealFlood(board: CellData[][], start: Point) {
  const next = cloneBoard(board);
  const rows = next.length;
  const cols = next[0]?.length ?? 0;
  const queue: Point[] = [start];
  const visited = new Set<string>();
  let revealedCount = 0;

  while (queue.length > 0) {
    const point = queue.shift() as Point;
    const id = keyOf(point);
    if (visited.has(id)) continue;
    visited.add(id);

    const cell = next[point.row][point.col];
    if (cell.isRevealed || cell.isFlagged) continue;
    if (cell.hasMine) continue;

    cell.isRevealed = true;
    revealedCount += 1;

    if (cell.adjacentMines === 0) {
      for (const neighbor of getNeighbors(point, rows, cols)) {
        const neighborCell = next[neighbor.row][neighbor.col];
        if (!neighborCell.isRevealed && !neighborCell.isFlagged) {
          queue.push(neighbor);
        }
      }
    }
  }

  return { board: next, revealedCount };
}

export function revealSingle(board: CellData[][], point: Point) {
  const next = cloneBoard(board);
  const cell = next[point.row][point.col];
  if (cell.isRevealed || cell.isFlagged) {
    return { board: next, revealedCount: 0, hitMine: false, exploded: null as Point | null };
  }

  if (cell.hasMine) {
    cell.isRevealed = true;
    cell.isExploded = true;
    return { board: next, revealedCount: 1, hitMine: true, exploded: point };
  }

  return { ...revealFlood(next, point), hitMine: false, exploded: null as Point | null };
}

export function chordReveal(board: CellData[][], point: Point) {
  const next = cloneBoard(board);
  const rows = next.length;
  const cols = next[0]?.length ?? 0;
  const cell = next[point.row][point.col];
  if (!cell.isRevealed || cell.adjacentMines === 0) {
    return { board: next, revealedCount: 0, hitMine: false, exploded: null as Point | null };
  }

  const neighbors = getNeighbors(point, rows, cols);
  const flagged = neighbors.filter((neighbor) => next[neighbor.row][neighbor.col].isFlagged).length;
  if (flagged !== cell.adjacentMines) {
    return { board: next, revealedCount: 0, hitMine: false, exploded: null as Point | null };
  }

  let revealedCount = 0;
  for (const neighbor of neighbors) {
    const neighborCell = next[neighbor.row][neighbor.col];
    if (neighborCell.isFlagged || neighborCell.isRevealed) continue;
    if (neighborCell.hasMine) {
      neighborCell.isRevealed = true;
      neighborCell.isExploded = true;
      return { board: next, revealedCount: revealedCount + 1, hitMine: true, exploded: neighbor };
    }
    const { board: floodBoard, revealedCount: floodCount } = revealFlood(next, neighbor);
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        next[row][col] = floodBoard[row][col];
      }
    }
    revealedCount += floodCount;
  }

  return { board: next, revealedCount, hitMine: false, exploded: null as Point | null };
}

export function toggleFlag(board: CellData[][], point: Point) {
  const next = cloneBoard(board);
  const cell = next[point.row][point.col];
  if (cell.isRevealed) {
    return { board: next, changed: false };
  }
  cell.isFlagged = !cell.isFlagged;
  return { board: next, changed: true, nowFlagged: cell.isFlagged };
}

export function countRevealed(board: CellData[][]) {
  return board.reduce((sum, row) => sum + row.filter((cell) => cell.isRevealed).length, 0);
}

export function countFlags(board: CellData[][]) {
  return board.reduce((sum, row) => sum + row.filter((cell) => cell.isFlagged).length, 0);
}

export function countNonMines(board: CellData[][]) {
  return board.reduce((sum, row) => sum + row.filter((cell) => !cell.hasMine).length, 0);
}

export function getRandomSafeHiddenCell(board: CellData[][]): Point | null {
  const candidates: Point[] = [];
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const cell = board[row][col];
      if (!cell.isRevealed && !cell.isFlagged && !cell.hasMine) {
        candidates.push({ row, col });
      }
    }
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function revealAllMines(board: CellData[][]) {
  const next = cloneBoard(board);
  for (const row of next) {
    for (const cell of row) {
      if (cell.hasMine) {
        cell.isRevealed = true;
      }
    }
  }
  return next;
}
