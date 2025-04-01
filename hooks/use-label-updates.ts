import { useEffect } from 'react';

/**
 * Custom hook to listen for label update events
 * @param callback - Function to call when labels are updated
 */
export function useLabelUpdates(callback: () => void): void {
  useEffect(() => {
    const handleLabelUpdate = () => {
      callback();
    };
    window.addEventListener('labelsUpdated', handleLabelUpdate);
    return () => {
      window.removeEventListener('labelsUpdated', handleLabelUpdate);
    };
  }, [callback]);
}
/**
 * Dispatch a label update event
 */
export function dispatchLabelUpdateEvent(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('labelsUpdated'));
  }
}
