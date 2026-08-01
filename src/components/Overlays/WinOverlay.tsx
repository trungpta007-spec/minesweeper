import { motion } from 'framer-motion';
import { PartyPopper, RefreshCw } from 'lucide-react';
import { Confetti } from './Confetti';
import { Button } from '../UI/Button';
import { formatTime } from '../../utils/formatTime';

interface WinOverlayProps {
  elapsedSeconds: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
}

export function WinOverlay({ elapsedSeconds, isNewBest, onPlayAgain }: WinOverlayProps) {
  return (
    <>
      <Confetti />
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6"
      >
        <div className="flex w-full max-w-sm items-center gap-4 rounded-3xl border border-border bg-surface p-4 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.35)]">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.1 }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-green/15 text-accent-green"
          >
            <PartyPopper size={24} />
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-extrabold text-text">Board cleared!</p>
            <p className="text-sm text-text-muted">
              Finished in <span className="font-semibold text-text">{formatTime(elapsedSeconds)}</span>
              {isNewBest && <span className="ml-1 font-semibold text-accent-green">· new best!</span>}
            </p>
          </div>
          <Button onClick={onPlayAgain} icon={<RefreshCw size={15} />}>
            Play again
          </Button>
        </div>
      </motion.div>
    </>
  );
}
