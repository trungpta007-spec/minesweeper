import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent-blue text-white shadow-[0_8px_20px_-8px_rgba(26,115,232,0.65)] hover:brightness-105',
  secondary: 'bg-surface-muted text-text hover:bg-border',
  ghost: 'bg-transparent text-text-muted hover:bg-surface-muted',
};

export function Button({ onClick, children, variant = 'primary', icon, disabled, fullWidth }: ButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 480, damping: 24 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-display text-sm font-bold tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-40 ${
        VARIANT_CLASSES[variant]
      } ${fullWidth ? 'w-full' : ''}`}
    >
      {icon}
      {children}
    </motion.button>
  );
}
