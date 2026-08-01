import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface IconButtonProps {
  onClick: () => void;
  label: string;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
}

/** A round, elevated icon button used across the top bar (restart, sound, theme, stats...). */
export function IconButton({ onClick, label, children, active = false, disabled = false }: IconButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      whileHover={disabled ? undefined : { scale: 1.06 }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? 'border-transparent bg-accent-blue text-white shadow-[0_4px_14px_-4px_rgba(26,115,232,0.6)]'
          : 'border-border bg-surface text-text shadow-sm hover:bg-surface-muted'
      }`}
    >
      {children}
    </motion.button>
  );
}
