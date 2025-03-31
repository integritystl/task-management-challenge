'use client';

import { Loader2 } from 'lucide-react';
import { JSX } from 'react';

/**
 * LoadingSpinner component that displays an animated spinner
 * Used to indicate loading states throughout the application
 * @returns JSX element with the loading spinner
 */
export function LoadingSpinner(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">Loading tasks...</p>
    </div>
  );
}
