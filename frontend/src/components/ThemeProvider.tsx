// ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

type Theme = 'light' | 'dark';

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'homecare-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      return stored || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // detect system preference if no saved theme
  useEffect(() => {
    try {
      if (!localStorage.getItem(storageKey)) {
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setThemeState(systemPrefersDark ? 'dark' : 'light');
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  // apply theme and add scoped transition (color/background only)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Only transition color/background to prevent layout jank
    root.style.transition = 'background-color 0.25s ease, color 0.25s ease';
  }, [theme]);

  const setTheme = (t: Theme) => {
    try {
      localStorage.setItem(storageKey, t);
    } catch {
      // ignore storage errors
    }
    setThemeState(t);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook (safe): returns defaults if provider missing (prevents crash during isolated storybook/dev)
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // safe fallback
    return {
      theme: 'light' as Theme,
      setTheme: (t: Theme) => {},
      toggleTheme: () => {},
    };
  }
  return ctx;
}

// Also export a small UI toggle component
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export default ThemeProvider;
