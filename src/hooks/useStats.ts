import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STATS_KEY } from '../constants/difficulties';
import type { DifficultyLevel, GameStats } from '../types/game';

const EMPTY_STATS: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  currentStreak: 0,
  bestStreak: 0,
  bestTimes: {},
};

export function useStats() {
  const [stats, setStats] = useLocalStorage<GameStats>(STATS_KEY, EMPTY_STATS);

  const recordWin = useCallback(
    (difficulty: DifficultyLevel, elapsedSeconds: number) => {
      setStats((prev) => {
        const newStreak = prev.currentStreak + 1;
        const prevBest = prev.bestTimes[difficulty];
        const bestTimes = {
          ...prev.bestTimes,
          [difficulty]: prevBest === undefined ? elapsedSeconds : Math.min(prevBest, elapsedSeconds),
        };
        return {
          gamesPlayed: prev.gamesPlayed + 1,
          wins: prev.wins + 1,
          losses: prev.losses,
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          bestTimes,
        };
      });
    },
    [setStats]
  );

  const recordLoss = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      losses: prev.losses + 1,
      currentStreak: 0,
    }));
  }, [setStats]);

  const resetStats = useCallback(() => setStats(EMPTY_STATS), [setStats]);

  return { stats, recordWin, recordLoss, resetStats };
}
