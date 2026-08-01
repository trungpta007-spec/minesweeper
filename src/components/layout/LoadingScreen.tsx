import { motion } from 'framer-motion';
import { MineIcon } from '../Board/MineIcon';

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-bg"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent-blue/12 text-accent-blue"
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          className="h-9 w-9"
        >
          <MineIcon className="h-full w-full" />
        </motion.div>
      </motion.div>
      <motion.p
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="font-display text-lg font-extrabold tracking-tight text-text"
      >
        Minesweeper
      </motion.p>
    </motion.div>
  );
}
