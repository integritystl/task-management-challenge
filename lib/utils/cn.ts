import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges class names using clsx and tailwind-merge
 * Compatible with Tailwind CSS v4
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
