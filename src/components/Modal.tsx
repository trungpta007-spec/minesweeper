import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, title, onClose, children, className }: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button aria-label="Close modal" className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={cn('relative z-10 w-full max-w-2xl glass-panel p-6 shadow-lift', className)}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-500 dark:text-sky-300">Statistics</p>
                <h2 id="modal-title" className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
