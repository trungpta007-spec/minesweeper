import { useEffect, useMemo, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import type { CellData, Point } from '../types/game';
import Cell from './Cell';
import { cn } from '../utils/cn';

interface BoardProps {
  board: CellData[][] | null;
  activeCell: Point;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onMove: (point: Point) => void;
  boardEpoch: number;
  status: 'idle' | 'playing' | 'won' | 'lost';
  actionMode: 'reveal' | 'flag';
}

export function Board({ board, activeCell, onReveal, onFlag, onMove, boardEpoch, status, actionMode }: BoardProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const size = board?.length ?? 0;
  const isLocked = status === 'won' || status === 'lost';
  const boardKey = useMemo(() => `${boardEpoch}-${size}`, [boardEpoch, size]);

  useEffect(() => {
    const target = refs.current[activeCell.row * Math.max(1, size) + activeCell.col];
    target?.focus({ preventScroll: true });
  }, [activeCell, size, boardKey]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!board || size === 0) return;
    const { row, col } = activeCell;
    let next: Point | null = null;
    switch (event.key) {
      case 'ArrowUp':
        next = { row: Math.max(0, row - 1), col };
        break;
      case 'ArrowDown':
        next = { row: Math.min(size - 1, row + 1), col };
        break;
      case 'ArrowLeft':
        next = { row, col: Math.max(0, col - 1) };
        break;
      case 'ArrowRight':
        next = { row, col: Math.min(size - 1, col + 1) };
        break;
      case 'Home':
        next = { row: 0, col: 0 };
        break;
      case 'End':
        next = { row: size - 1, col: size - 1 };
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (actionMode === 'flag') {
          onFlag(row, col);
        } else {
          onReveal(row, col);
        }
        return;
      case 'f':
      case 'F':
        event.preventDefault();
        onFlag(row, col);
        return;
      default:
        return;
    }
    if (next) {
      event.preventDefault();
      onMove(next);
    }
  };

  if (!board) {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/80 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
        <div className="flex min-h-[320px] items-center justify-center rounded-[22px] border border-dashed border-slate-200 bg-white/70 p-8 dark:border-white/10 dark:bg-slate-950/20">
          <div className="max-w-md text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-500 dark:text-sky-300">Ready to play</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">Click any tile to generate a safe board.</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              The first move is always safe, and the opening area is biased to feel generous.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 opacity-90">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="aspect-square animate-pulse rounded-2xl border border-slate-200 bg-slate-100/90 dark:border-white/10 dark:bg-slate-800" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/80 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70"
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={status === 'won' ? { scale: [1, 1.01, 1], y: [0, -2, 0] } : status === 'lost' ? { x: [0, -6, 6, -4, 4, 0] } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.42, ease: 'easeOut' }}
      key={boardKey}
    >
      <div
        role="grid"
        aria-label="Minesweeper board"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative grid w-full select-none gap-1 rounded-[22px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(241,245,249,0.82))] p-2 outline-none dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.7))]',
          size >= 20 ? 'aspect-square' : 'aspect-square',
        )}
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}:${colIndex}`}
              ref={(element) => {
                refs.current[rowIndex * size + colIndex] = element;
              }}
              cell={cell}
              isActive={activeCell.row === rowIndex && activeCell.col === colIndex}
              boardLocked={isLocked}
              rowIndex={rowIndex}
              colIndex={colIndex}
              onHover={() => onMove({ row: rowIndex, col: colIndex })}
              onContext={() => onFlag(rowIndex, colIndex)}
              onClick={() => {
                onMove({ row: rowIndex, col: colIndex });
                if (actionMode === 'flag' && !cell.isRevealed) {
                  onFlag(rowIndex, colIndex);
                } else if (cell.isRevealed && cell.adjacentMines > 0) {
                  onReveal(rowIndex, colIndex);
                } else {
                  onReveal(rowIndex, colIndex);
                }
              }}
            />
          )),
        )}
      </div>
    </motion.div>
  );
}
