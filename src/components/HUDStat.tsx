import type { ReactNode } from 'react';

interface HUDStatProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}

export function HUDStat({ label, value, icon }: HUDStatProps) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
