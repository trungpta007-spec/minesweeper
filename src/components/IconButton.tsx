import { cn } from '../utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  active?: boolean;
}

export function IconButton({ icon, active, className, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-950',
        active
          ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:border-white dark:bg-white dark:text-slate-900'
          : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:shadow-soft dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
        className,
      )}
    >
      {icon}
    </button>
  );
}
