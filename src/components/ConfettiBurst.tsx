import { motion } from 'framer-motion';
import { useMemo } from 'react';

export function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 32 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 0.35,
        duration: 1.6 + Math.random() * 0.8,
        rotate: (Math.random() * 2 - 1) * 180,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-0 h-2.5 w-2.5 rounded-sm bg-sky-500 dark:bg-sky-300"
          style={{ left: `${piece.left}%` }}
          initial={{ opacity: 0, y: -20, rotate: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, 120, 360, 520], rotate: piece.rotate }}
          transition={{ delay: piece.delay, duration: piece.duration, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
