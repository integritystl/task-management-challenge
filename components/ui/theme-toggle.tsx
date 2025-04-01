'use client';

import { useTheme } from 'next-themes';
import { JSX, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * ThemeToggle component for switching between light and dark modes
 * @returns Theme toggle button component
 */
export function ThemeToggle(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  // Only render the toggle on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-md p-2 inline-flex items-center justify-center cursor-pointer hover:text-green-400 dark:text-white"
        aria-label="Toggle theme"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }
  return (
    <button
      type="button"
      className="rounded-md p-2 inline-flex items-center justify-center cursor-pointer hover:text-green-400 dark:text-white"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
