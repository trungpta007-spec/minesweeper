import { AnimatePresence, motion } from 'framer-motion';
import { memo, useRef } from 'react';
import type { CellState } from '../../types/game';
import { NUMBER_COLOR_CLASS } from '../../constants/difficulties';
import { MineIcon } from './MineIcon';
import { FlagIcon } from './FlagIcon';
import { Particles } from './Particles';

interface CellProps {
  row: number;
  col: number;
  state: CellState;
  isMine: boolean;
  adjacentMines: number;
  revealDepth: number;
  isExploded: boolean;
  interactive: boolean;
  isFocusTarget: boolean;
  onReveal: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
  onFocusCell: (row: number, col: number) => void;
  registerRef: (row: number, col: number, el: HTMLButtonElement | null) => void;
}

const LONG_PRESS_MS = 420;

function CellImpl({
  row,
  col,
  state,
  isMine,
  adjacentMines,
  revealDepth,
  isExploded,
  interactive,
  isFocusTarget,
  onReveal,
  onToggleFlag,
  onFocusCell,
  registerRef,
}: CellProps) {
  const longPressTimer = useRef<number | null>(null);
  const longPressFired = useRef(false);

  const clearLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive || e.pointerType === 'mouse') return;
    longPressFired.current = false;
    longPressTimer.current = window.setTimeout(() => {
      longPressFired.current = true;
      onToggleFlag(row, col);
    }, LONG_PRESS_MS);
  };

  const handlePointerUp = () => clearLongPress();
  const handlePointerLeave = () => clearLongPress();

  const handleClick = () => {
    if (!interactive) return;
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }
    onReveal(row, col);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!interactive) return;
    onToggleFlag(row, col);
  };

  const delay = Math.min(revealDepth * 0.026, 0.42);

  const label =
    state === 'flagged'
      ? `Flagged cell, row ${row + 1}, column ${col + 1}`
      : state === 'hidden'
        ? `Hidden cell, row ${row + 1}, column ${col + 1}`
        : isMine
          ? `Mine, row ${row + 1}, column ${col + 1}`
          : adjacentMines > 0
            ? `${adjacentMines} adjacent mines, row ${row + 1}, column ${col + 1}`
            : `Empty cell, row ${row + 1}, column ${col + 1}`;

  return (
    <motion.button
      ref={(el) => registerRef(row, col, el)}
      type="button"
      role="gridcell"
      tabIndex={isFocusTarget ? 0 : -1}
      aria-label={label}
      onFocus={() => onFocusCell(row, col)}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      initial={false}
      animate={isExploded ? { x: [0, -3, 3, -2, 2, 0] } : {}}
      transition={isExploded ? { duration: 0.4 } : { type: 'spring', stiffness: 500, damping: 30 }}
      whileHover={interactive && state === 'hidden' ? { scale: 1.05, y: -1 } : undefined}
      whileTap={interactive && state !== 'revealed' ? { scale: 0.9 } : undefined}
      className={`relative flex aspect-square w-full select-none items-center justify-center rounded-[9px] text-[clamp(11px,3.4vw,17px)] font-bold transition-colors duration-150 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
        state === 'hidden'
          ? 'cursor-pointer bg-hidden shadow-[0_2px_0_0_var(--color-border-strong)] hover:bg-hidden-hover active:translate-y-px active:shadow-none'
          : isExploded
            ? 'bg-accent-red text-white shadow-inner'
            : isMine
              ? 'bg-revealed border border-border text-accent-red'
              : 'bg-revealed border border-border/70'
      }`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {state === 'flagged' && (
          <motion.span
            key="flag"
            initial={{ y: 10, opacity: 0, scale: 0.6 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.5, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 480, damping: 18 }}
            className="flex h-[65%] w-[65%] items-center justify-center text-accent-blue"
          >
            <FlagIcon className="h-full w-full" />
          </motion.span>
        )}

        {state === 'revealed' && isMine && (
          <motion.span
            key="mine"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: isExploded ? 1.15 : 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 16, delay }}
            className={`flex h-[62%] w-[62%] items-center justify-center ${isExploded ? 'text-white' : 'text-text'}`}
          >
            <MineIcon className="h-full w-full" lit={isExploded} />
          </motion.span>
        )}

        {state === 'revealed' && !isMine && adjacentMines > 0 && (
          <motion.span
            key="number"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 480, damping: 20, delay }}
            className={NUMBER_COLOR_CLASS[adjacentMines]}
          >
            {adjacentMines}
          </motion.span>
        )}
      </AnimatePresence>

      {isExploded && <Particles />}
    </motion.button>
  );
}

function areEqual(prev: CellProps, next: CellProps) {
  return (
    prev.state === next.state &&
    prev.isMine === next.isMine &&
    prev.adjacentMines === next.adjacentMines &&
    prev.revealDepth === next.revealDepth &&
    prev.isExploded === next.isExploded &&
    prev.interactive === next.interactive &&
    prev.isFocusTarget === next.isFocusTarget
  );
}

export const Cell = memo(CellImpl, areEqual);
