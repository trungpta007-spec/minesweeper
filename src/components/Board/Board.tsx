import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Board as BoardType } from '../../types/game';
import { Cell } from './Cell';

interface BoardProps {
  board: BoardType;
  rows: number;
  cols: number;
  gameId: number;
  interactive: boolean;
  explodedCell: { row: number; col: number } | null;
  shake: boolean;
  onReveal: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
}

export function Board({ board, rows, cols, gameId, interactive, explodedCell, shake, onReveal, onToggleFlag }: BoardProps) {
  const [focused, setFocused] = useState({ row: 0, col: 0 });
  const cellRefs = useRef<(HTMLButtonElement | null)[][]>([]);

  useEffect(() => {
    setFocused({ row: 0, col: 0 });
  }, [gameId]);

  const registerRef = (row: number, col: number, el: HTMLButtonElement | null) => {
    if (!cellRefs.current[row]) cellRefs.current[row] = [];
    cellRefs.current[row][col] = el;
  };

  const moveFocus = (row: number, col: number) => {
    const clampedRow = Math.max(0, Math.min(rows - 1, row));
    const clampedCol = Math.max(0, Math.min(cols - 1, col));
    cellRefs.current[clampedRow]?.[clampedCol]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        moveFocus(focused.row - 1, focused.col);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveFocus(focused.row + 1, focused.col);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveFocus(focused.row, focused.col - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveFocus(focused.row, focused.col + 1);
        break;
      case 'Home':
        e.preventDefault();
        moveFocus(focused.row, 0);
        break;
      case 'End':
        e.preventDefault();
        moveFocus(focused.row, cols - 1);
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        if (interactive) onToggleFlag(focused.row, focused.col);
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      key={gameId}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1, x: shake ? [0, -6, 5, -4, 3, -2, 0] : 0 }}
      transition={{ opacity: { duration: 0.35 }, scale: { type: 'spring', stiffness: 260, damping: 22 }, x: { duration: 0.45 } }}
      role="grid"
      aria-label="Minesweeper board"
      aria-rowcount={rows}
      aria-colcount={cols}
      onKeyDown={handleKeyDown}
      style={{ aspectRatio: `${cols} / ${rows}` }}
      className="grid w-full touch-none gap-[3px] rounded-2xl border border-border bg-surface-muted p-[6px] shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:gap-1 sm:p-2"
    >
      <div
        className="grid h-full w-full gap-[3px] sm:gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {board.map((rowCells, r) =>
          rowCells.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              row={r}
              col={c}
              state={cell.state}
              isMine={cell.isMine}
              adjacentMines={cell.adjacentMines}
              revealDepth={cell.revealDepth}
              isExploded={explodedCell?.row === r && explodedCell?.col === c}
              interactive={interactive}
              isFocusTarget={focused.row === r && focused.col === c}
              onReveal={onReveal}
              onToggleFlag={onToggleFlag}
              onFocusCell={(row, col) => setFocused({ row, col })}
              registerRef={registerRef}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}
