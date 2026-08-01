import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useMinesweeper } from './hooks/useMinesweeper';
import { useDarkMode } from './hooks/useDarkMode';
import { useSound } from './hooks/useSound';
import { useStats } from './hooks/useStats';
import { TopBar } from './components/TopBar/TopBar';
import { Board } from './components/Board/Board';
import { WinOverlay } from './components/Overlays/WinOverlay';
import { LoseOverlay } from './components/Overlays/LoseOverlay';
import { StatsModal } from './components/Modals/StatsModal';
import { CustomBoardModal } from './components/Modals/CustomBoardModal';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { ChatbotBubble } from './components/ChatbotBubble';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [statsOpen, setStatsOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);

  const { state, newGame, newCustomGame, restartSameDifficulty, reveal, toggleFlag, undo, hint, canUndo, minesRemaining } =
    useMinesweeper();
  const { isDark, toggle: toggleTheme } = useDarkMode();
  const { play, muted, toggleMuted } = useSound();
  const { stats, recordWin, recordLoss, resetStats } = useStats();

  const prevRevealedCount = useRef(state.revealedCount);
  const prevFlagsPlaced = useRef(state.flagsPlaced);
  const processedOutcomes = useRef(new Set<string>());
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  // Sound: play a soft reveal/flag tick whenever the board actually changes.
  useEffect(() => {
    if (state.revealedCount > prevRevealedCount.current) play('reveal');
    prevRevealedCount.current = state.revealedCount;
  }, [state.revealedCount, play]);

  useEffect(() => {
    if (state.flagsPlaced !== prevFlagsPlaced.current) play('flag');
    prevFlagsPlaced.current = state.flagsPlaced;
  }, [state.flagsPlaced, play]);

  // Win/loss side effects: sound + stats, guarded so React 18/19 StrictMode's
  // double-invoked effects in development never double-count a single game.
  useEffect(() => {
    const outcomeKey = `${state.gameId}:${state.status}`;
    if (state.status === 'won' && !processedOutcomes.current.has(outcomeKey)) {
      processedOutcomes.current.add(outcomeKey);
      const elapsed = state.startedAt && state.endedAt ? Math.floor((state.endedAt - state.startedAt) / 1000) : 0;
      const prevBest = stats.bestTimes[state.difficulty];
      setIsNewBest(prevBest === undefined || elapsed < prevBest);
      recordWin(state.difficulty, elapsed);
      play('victory');
    } else if (state.status === 'lost' && !processedOutcomes.current.has(outcomeKey)) {
      processedOutcomes.current.add(outcomeKey);
      recordLoss();
      play('explosion');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, state.gameId]);

  const handleHint = () => {
    play('hint');
    hint();
  };

  const boardSummary = `${state.rows} rows × ${state.cols} cols · ${state.mines} mines`;

  return (
    <div className="relative flex min-h-dvh flex-col items-center bg-bg bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.08),transparent_20%)] px-3 pb-10 pt-6 sm:px-6">
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

      <div className="mb-5 flex w-full max-w-[760px] items-center justify-center gap-2">
        <h1 className="font-display text-xl font-extrabold tracking-tight text-text sm:text-2xl">Minesweeper</h1>
      </div>

      <div className="flex w-full max-w-[760px] flex-col gap-4">
        <TopBar
          difficulty={state.difficulty}
          status={state.status}
          minesRemaining={minesRemaining}
          startedAt={state.startedAt}
          endedAt={state.endedAt}
          hintsRemaining={state.hintsRemaining}
          canUndo={canUndo}
          isMuted={muted}
          isDark={isDark}
          onSelectDifficulty={newGame}
          onOpenCustom={() => setCustomOpen(true)}
          onRestart={restartSameDifficulty}
          onUndo={undo}
          onHint={handleHint}
          onToggleMute={toggleMuted}
          onToggleTheme={toggleTheme}
          onOpenStats={() => setStatsOpen(true)}
        />

        <div className="flex h-12 items-center justify-center rounded-3xl border border-border bg-surface-muted px-4 text-sm text-text-muted">
          {boardSummary}
        </div>

        <div className="flex w-full justify-center">
          <Board
            board={state.board}
            rows={state.rows}
            cols={state.cols}
            gameId={state.gameId}
            interactive={state.status === 'idle' || state.status === 'playing'}
            explodedCell={state.explodedCell}
            shake={state.status === 'lost'}
            onReveal={reveal}
            onToggleFlag={toggleFlag}
          />
        </div>

        <p className="text-center text-xs text-text-muted">
          Tap to reveal · long-press or right-click to flag · arrow keys to move · F to flag
        </p>
      </div>

      <AnimatePresence>
        {state.status === 'won' && state.startedAt && state.endedAt && (
          <WinOverlay
            elapsedSeconds={Math.floor((state.endedAt - state.startedAt) / 1000)}
            isNewBest={isNewBest}
            onPlayAgain={restartSameDifficulty}
          />
        )}
        {state.status === 'lost' && <LoseOverlay canUndo={canUndo} onTryAgain={restartSameDifficulty} onUndo={undo} />}
      </AnimatePresence>

      <StatsModal open={statsOpen} onClose={() => setStatsOpen(false)} stats={stats} onReset={resetStats} />
      <CustomBoardModal open={customOpen} onClose={() => setCustomOpen(false)} onStart={newCustomGame} />
      <ChatbotBubble />
    </div>
  );
}
