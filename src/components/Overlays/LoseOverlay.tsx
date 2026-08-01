import { motion } from 'framer-motion';
import { RefreshCw, Undo2 } from 'lucide-react';
import { Button } from '../UI/Button';
import { MineIcon } from '../Board/MineIcon';

interface LoseOverlayProps {
  canUndo: boolean;
  onTryAgain: () => void;
  onUndo: () => void;
}

export function LoseOverlay({ canUndo, onTryAgain, onUndo }: LoseOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 18 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-[34px] border border-border bg-white/95 p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-red/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent-red shadow-sm">
          Game Over
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[28px] bg-gradient-to-br from-accent-red/10 to-accent-red/5 text-accent-red shadow-[0_14px_35px_-18px_rgba(217,48,37,0.95)]">
            <MineIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-950 dark:text-white">You stepped on a mine.</p>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              The board is shown so you can review the layout and adjust your strategy. Start again with a cleaner focus on number patterns.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {canUndo && (
            <Button onClick={onUndo} variant="secondary" icon={<Undo2 size={15} />} fullWidth>
              Undo last move
            </Button>
          )}
          <Button onClick={onTryAgain} icon={<RefreshCw size={15} />} fullWidth>
            Start a fresh game
          </Button>
        </div>
        <div className="mt-6 rounded-[28px] bg-slate-100 px-5 py-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-semibold">Helpful tip</p>
          <p className="mt-2 leading-6">
            When a number is completely satisfied by flagged mines, the remaining adjacent cells are safe to reveal.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
