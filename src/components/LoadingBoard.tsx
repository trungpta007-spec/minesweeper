import { motion } from 'framer-motion';

export function LoadingBoard() {
  return (
    <div className="flex h-full min-h-[320px] items-center justify-center rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex flex-col items-center gap-5 text-center">
        <motion.div className="grid grid-cols-3 gap-2" initial="hidden" animate="visible" variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}>
          {Array.from({ length: 9 }).map((_, index) => (
            <motion.span
              key={index}
              className="h-3 w-3 rounded-full bg-sky-500/70 dark:bg-sky-300/80"
              variants={{ hidden: { scale: 0.4, opacity: 0.25 }, visible: { scale: [0.6, 1, 0.6], opacity: [0.35, 1, 0.35] } }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Preparing a fair board</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The first click will always be safe.</p>
        </div>
      </div>
    </div>
  );
}
