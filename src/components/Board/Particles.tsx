import { motion } from 'framer-motion';
import { useMemo } from 'react';

const PARTICLE_COUNT = 10;

/** A small radial burst of fading shards, absolutely centered over the mine that was triggered. */
export function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.4;
        const distance = 22 + Math.random() * 16;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: 3 + Math.random() * 3,
        };
      }),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-accent-red"
          style={{ width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
