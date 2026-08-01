import { useMemo, useState } from 'react';
import type { GameStats } from '../types/game';
import { STORAGE_KEYS } from '../constants';
import { useLocalStorage } from './useLocalStorage';

const defaultStats: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  bestTime: null,
  currentStreak: 0,
  bestStreak: 0,
};

export function useGameStats() {
  const [storedStats, setStoredStats] = useLocalStorage<GameStats>(STORAGE_KEYS.stats, defaultStats);
  const [isOpen, setIsOpen] = useState(false);

  const stats = useMemo(() => storedStats, [storedStats]);

  const recordWin = (time: number) => {
    setStoredStats((current) => {
      const nextBestTime = current.bestTime === null ? time : Math.min(current.bestTime, time);
      const nextStreak = current.currentStreak + 1;
      return {
        ...current,
        gamesPlayed: current.gamesPlayed + 1,
        wins: current.wins + 1,
        bestTime: nextBestTime,
        currentStreak: nextStreak,
        bestStreak: Math.max(current.bestStreak, nextStreak),
      };
    });
  };

  const recordLoss = () => {
    setStoredStats((current) => ({
      ...current,
      gamesPlayed: current.gamesPlayed + 1,
      losses: current.losses + 1,
      currentStreak: 0,
    }));
  };

  const resetStats = () => setStoredStats(defaultStats);

  return { stats, isOpen, setIsOpen, recordWin, recordLoss, resetStats };
}
