import { motion } from 'framer-motion';
import { Settings2 } from 'lucide-react';
import type { DifficultyLevel } from '../../types/game';
import { DIFFICULTIES } from '../../constants/difficulties';

interface DifficultySelectorProps {
  current: DifficultyLevel;
  onSelect: (difficulty: Exclude<DifficultyLevel, 'custom'>) => void;
  onOpenCustom: () => void;
}

const OPTIONS: Exclude<DifficultyLevel, 'custom'>[] = ['easy', 'medium', 'hard'];

/** Segmented control with a shared-layout pill that glides between the selected option. */
export function DifficultySelector({ current, onSelect, onOpenCustom }: DifficultySelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Difficulty"
      className="flex items-center gap-1 rounded-2xl border border-border bg-surface p-1 shadow-sm"
    >
      {OPTIONS.map((level) => {
        const isActive = current === level;
        return (
          <button
            key={level}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(level)}
            className={`relative rounded-xl px-3.5 py-1.5 font-display text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
              isActive ? 'text-white' : 'text-text-muted hover:text-text'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="difficulty-pill"
                className="absolute inset-0 rounded-xl bg-accent-blue"
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              />
            )}
            <span className="relative">{DIFFICULTIES[level].label}</span>
          </button>
        );
      })}
      <button
        type="button"
        role="tab"
        aria-selected={current === 'custom'}
        onClick={onOpenCustom}
        title="Custom board"
        className={`relative flex items-center gap-1 rounded-xl px-3 py-1.5 font-display text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${
          current === 'custom' ? 'text-white' : 'text-text-muted hover:text-text'
        }`}
      >
        {current === 'custom' && (
          <motion.span
            layoutId="difficulty-pill"
            className="absolute inset-0 rounded-xl bg-accent-blue"
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          />
        )}
        <Settings2 size={14} className="relative" />
        <span className="relative hidden sm:inline">Custom</span>
      </button>
    </div>
  );
}
