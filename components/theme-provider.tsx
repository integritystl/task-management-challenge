'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';
import { JSX } from 'react';

/**
 * Theme provider component that wraps the application to provide theme context
 * @param props - Theme provider props including children and other theme configuration
 * @returns Theme provider component
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps): JSX.Element {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
