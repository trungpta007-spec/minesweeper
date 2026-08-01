import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { THEME_KEY } from '../constants/difficulties';

type ThemePreference = 'light' | 'dark';

function systemPrefersDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function useDarkMode() {
  const [theme, setTheme] = useLocalStorage<ThemePreference>(THEME_KEY, systemPrefersDark() ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  return { isDark: theme === 'dark', toggle };
}
