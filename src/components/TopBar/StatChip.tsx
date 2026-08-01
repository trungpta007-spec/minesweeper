import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatChipProps {
  icon: ReactNode;
  value: string;
  label: string;
  tone?: 'default' | 'warning';
}

/** Pill-shaped readout used for the timer and remaining-mine counter. */
export function StatChip({ icon, value, label, tone = 'default' }: StatChipProps) {
  return (
    <div
      role="status"
      aria-label={`${label}: ${value}`}
      className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2 font-display tabular-nums shadow-sm transition-colors duration-300 ${
        tone === 'warning'
          ? 'border-transparent bg-accent-red/10 text-accent-red'
          : 'border-border bg-surface text-text'
      }`}
    >
      <span className={tone === 'warning' ? 'text-accent-red' : 'text-text-muted'}>{icon}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 6, opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="min-w-[2.5ch] text-base font-bold"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
