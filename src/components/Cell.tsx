import { forwardRef, memo } from 'react';
import { motion } from 'framer-motion';
import { Bomb, Flag } from 'lucide-react';
import type { CellData } from '../types/game';
import { NUMBER_COLORS } from '../constants';
import { cn } from '../utils/cn';

interface CellProps {
  cell: CellData;
  isActive: boolean;
  boardLocked: boolean;
  onClick: () => void;
  onContext: () => void;
  onHover: () => void;
  rowIndex: number;
  colIndex: number;
}

const Cell = memo(
  forwardRef<HTMLButtonElement, CellProps>(function Cell({ cell, isActive, boardLocked, onClick, onContext, onHover, rowIndex, colIndex }, ref) {
    const numberClass = NUMBER_COLORS[cell.adjacentMines] ?? 'text-slate-600 dark:text-slate-300';
    const isHidden = !cell.isRevealed;

    return (
      <motion.button
        ref={ref}
        type="button"
        aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}${cell.isRevealed ? cell.hasMine ? ', mine' : `, ${cell.adjacentMines} adjacent mines` : cell.isFlagged ? ', flagged' : ', hidden'}`}
        aria-pressed={cell.isFlagged}
        role="gridcell"
        className={cn(
          'relative aspect-square select-none overflow-hidden rounded-xl outline-none transition-[transform,box-shadow,background-color] duration-150 focus-visible:ring-2 focus-visible:ring-sky-500/90 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:focus-visible:ring-offset-slate-950',
          isHidden
            ? 'border border-slate-200/80 bg-gradient-to-b from-slate-200 to-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_6px_12px_rgba(15,23,42,0.12)] dark:border-white/10 dark:from-slate-700 dark:to-slate-800'
            : 'border border-slate-200/60 bg-white/95 shadow-none dark:border-white/10 dark:bg-slate-950/20',
          boardLocked ? 'cursor-default' : 'cursor-pointer',
          isActive ? 'ring-2 ring-sky-500/50 ring-offset-2 ring-offset-transparent' : '',
          cell.isExploded ? 'bg-rose-500/20 dark:bg-rose-500/20' : '',
        )}
        onClick={onClick}
        onContextMenu={(event) => {
          event.preventDefault();
          onContext();
        }}
        onMouseEnter={onHover}
        initial={false}
        whileHover={isHidden ? { y: -1, scale: 1.02 } : {}}
        whileTap={isHidden ? { scale: 0.96 } : {}}
        animate={cell.isExploded ? { scale: [1, 1.06, 1], backgroundColor: ['rgba(251,113,133,0.20)', 'rgba(248,113,113,0.35)', 'rgba(251,113,133,0.16)'] } : {}}
        transition={cell.isExploded ? { duration: 0.42, ease: 'easeOut' } : { type: 'spring', stiffness: 300, damping: 24 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),transparent_55%)]" />
        <div className="relative flex h-full w-full items-center justify-center">
          {cell.isRevealed ? (
            cell.hasMine ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="relative flex h-full w-full items-center justify-center"
              >
                <div className="absolute inset-0 rounded-xl bg-rose-500/15" />
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 shadow-[inset_0_2px_0_rgba(255,255,255,0.08),0_8px_18px_rgba(15,23,42,0.28)] dark:bg-slate-950">
                  <Bomb className="h-4 w-4 text-white/90" />
                  <span className="absolute -top-0.5 right-1 h-1.5 w-0.5 rotate-45 rounded-full bg-amber-300" />
                </div>
              </motion.div>
            ) : cell.adjacentMines > 0 ? (
              <motion.span
                initial={{ scale: 0.7, opacity: 0, y: 4 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 330, damping: 20 }}
                className={cn('text-[clamp(0.8rem,2vw,1.1rem)] font-semibold leading-none', numberClass)}
              >
                {cell.adjacentMines}
              </motion.span>
            ) : null
          ) : cell.isFlagged ? (
            <motion.div
              initial={{ y: 12, opacity: 0, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="relative flex h-full w-full items-center justify-center"
            >
              <Flag className="h-[46%] w-[46%] text-blue-600 drop-shadow-sm dark:text-sky-300" />
            </motion.div>
          ) : isActive ? (
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400/70 dark:bg-white/30" />
          ) : null}
        </div>
      </motion.button>
    );
  }),
  (prev, next) =>
    prev.cell === next.cell &&
    prev.isActive === next.isActive &&
    prev.boardLocked === next.boardLocked &&
    prev.rowIndex === next.rowIndex &&
    prev.colIndex === next.colIndex,
);

export default Cell;
