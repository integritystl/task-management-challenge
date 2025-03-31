import { useState, useCallback } from 'react';
import { Task } from '@/lib/db';
import { TaskPriority, TaskStatus } from '@/app/api/tasks/route';

/**
 * Interface for task filter options
 */
export interface TaskFilterOptions {
  priority?: TaskPriority | null;
  status?: TaskStatus | null;
  labelIds?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
/**
 * Custom hook for managing task API operations with filtering
 * @returns Object containing tasks data and API operations
 */
export function useTasksApi() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<TaskFilterOptions>({});
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  /**
   * Builds the query string for filtering tasks
   * @param filters - Filter options for tasks
   * @returns Query string for the API request
   */
  const buildQueryString = (filters: TaskFilterOptions): string => {
    const params = new URLSearchParams();
    if (filters.priority) {
      params.append('priority', filters.priority);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.labelIds && filters.labelIds.length > 0) {
      filters.labelIds.forEach(id => params.append('labelId', id));
    }
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    if (filters.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }
    return params.toString();
  };
  /**
   * Fetch tasks from the API with optional filtering
   * @param filters - Optional filter options
   */
  const fetchTasks = useCallback(async (filters?: TaskFilterOptions): Promise<void> => {
    setIsLoading(true);
    const filtersToUse = filters || activeFilters;
    if (filters) {
      setActiveFilters(filters);
    }
    try {
      const queryString = buildQueryString(filtersToUse);
      const url = `/api/tasks${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters]);
  /**
   * Create a new task
   * @param data - Task data to create
   * @returns The created task
   */
  const createTask = useCallback(async (data: any): Promise<Task> => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }
      const createdTask = await response.json();
      setTasks(prevTasks => [...prevTasks, createdTask]);
      return createdTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  /**
   * Clear all active filters
   */
  const clearFilters = useCallback((): void => {
    setActiveFilters({});
    setResetTrigger(prev => prev + 1);
    fetchTasks({});
  }, [fetchTasks]);
  return {
    tasks,
    isLoading,
    isSubmitting,
    activeFilters,
    resetTrigger,
    fetchTasks,
    createTask,
    clearFilters,
  };
}
