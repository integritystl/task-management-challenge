import { Label } from '@/lib/db';
import { LabelData } from '@/lib/label-types';
import { useState, useCallback } from 'react';

/**
 * Custom hook for managing label API operations
 * @returns Object containing labels data and API operations
 */
export function useLabelsApi() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  /**
   * Fetch all labels from the API
   */
  const fetchLabels = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/labels');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch labels');
      }
      const data = await response.json();
      setLabels(data);
    } catch (error) {
      console.error('Error fetching labels:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  /**
   * Create a new label
   * @param data - Label data to create
   * @returns The created label
   */
  const createLabel = useCallback(async (data: LabelData): Promise<Label> => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/labels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create label');
      }
      const createdLabel = await response.json();
      setLabels(prevLabels => [...prevLabels, createdLabel]);
      return createdLabel;
    } catch (error) {
      console.error('Error creating label:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  /**
   * Update an existing label
   * @param data - Label data to update
   * @returns The updated label
   */
  const updateLabel = useCallback(async (data: LabelData): Promise<Label> => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/labels', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update label');
      }
      const updatedLabel = await response.json();
      setLabels(prevLabels =>
        prevLabels.map(label =>
          label.id === updatedLabel.id ? updatedLabel : label
        )
      );
      return updatedLabel;
    } catch (error) {
      console.error('Error updating label:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  /**
   * Delete a label by ID
   * @param id - ID of the label to delete
   */
  const deleteLabel = useCallback(async (id: string): Promise<void> => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/labels?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete label');
      }
      setLabels(prevLabels => prevLabels.filter(label => label.id !== id));
    } catch (error) {
      console.error('Error deleting label:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  return {
    labels,
    isLoading,
    isSubmitting,
    fetchLabels,
    createLabel,
    updateLabel,
    deleteLabel,
  };
}
