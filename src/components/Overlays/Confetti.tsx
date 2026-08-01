import { motion } from 'framer-motion';
import { useMemo } from 'react';

const COLORS = ['#1A73E8', '#1E8E3E', '#D93025', '#8430CE', '#E8710A', '#12B5CB'];
const PIECE_COUNT = 60;

interface Piece {
  id: number;
  left: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  drift: number;
  round: boolean;
}

/** Full-viewport confetti burst that falls, drifts, and spins itself out on a win. Purely decorative, ignores pointer events. */
export function Confetti() {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: PIECE_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 7,
        delay: Math.random() * 0.4,
        duration: 2.2 + Math.random() * 1.4,
        rotation: Math.random() * 360,
        drift: (Math.random() - 0.5) * 140,
        round: Math.random() > 0.5,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ top: '-5%', left: `${p.left}%`, opacity: 1, rotate: 0 }}
          animate={{ top: '105%', left: `${p.left + p.drift / 10}%`, opacity: [1, 1, 0], rotate: p.rotation }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size * 0.55,
            backgroundColor: p.color,
            borderRadius: p.round ? '9999px' : '2px',
          }}
        />
      ))}
    </div>
  );
}
