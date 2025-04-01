import { useState, useCallback, useEffect } from 'react';
import { Task } from '@/lib/db';
import { TaskPriority, TaskStatus } from '@/lib/db';

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
 * Parse URL search params into TaskFilterOptions
 * @param searchParams - URL search parameters
 * @returns TaskFilterOptions object
 */
export function parseUrlToFilters(searchParams: URLSearchParams): TaskFilterOptions {
  const filters: TaskFilterOptions = {};
  const priority = searchParams.get('priority');
  if (priority && Object.values(TaskPriority).includes(priority as TaskPriority)) {
    filters.priority = priority as TaskPriority;
  }
  const status = searchParams.get('status');
  if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
    filters.status = status as TaskStatus;
  }
  const labelIds = searchParams.getAll('labelId');
  if (labelIds.length > 0) {
    filters.labelIds = labelIds;
  }
  const sortBy = searchParams.get('sortBy');
  if (sortBy && ['title', 'dueDate', 'priority', 'status', 'createdAt'].includes(sortBy)) {
    filters.sortBy = sortBy;
  }
  const sortOrder = searchParams.get('sortOrder');
  if (sortOrder && ['asc', 'desc'].includes(sortOrder)) {
    filters.sortOrder = sortOrder as 'asc' | 'desc';
  }
  return filters;
}
/**
 * Convert TaskFilterOptions to URLSearchParams
 * @param filters - Filter options
 * @returns URLSearchParams object
 */
export function filtersToSearchParams(filters: TaskFilterOptions): URLSearchParams {
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
  return params;
}
/**
 * Custom hook for managing task API operations with filtering
 * @returns Object containing tasks data and API operations
 */
export function useTasksApi() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<TaskFilterOptions>({});
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  /**
   * Builds the query string for filtering tasks
   * @param filters - Filter options for tasks
   * @returns Query string for the API request
   */
  const buildQueryString = (filters: TaskFilterOptions): string => {
    return filtersToSearchParams(filters).toString();
  };
  /**
   * Fetch tasks from the API with optional filtering
   * @param filters - Optional filter options
   */
  const fetchTasks = useCallback(
    async (filters?: TaskFilterOptions): Promise<void> => {
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
    },
    [activeFilters]
  );
  /**
   * Initialize filters from URL on component mount
   */
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      const url = new URL(window.location.href);
      const initialFilters = parseUrlToFilters(url.searchParams);
      if (Object.keys(initialFilters).length > 0) {
        setActiveFilters(initialFilters);
        void fetchTasks(initialFilters);
      } else {
        void fetchTasks({});
      }
      setIsInitialized(true);
    }
  }, [isInitialized, fetchTasks]);
  /**
   * Create a new task
   * @param data - Task data to create
   * @returns The created task
   */
  /**
   * Type for task creation data matching the CreateTaskSchema in the API
   */
  type TaskCreateInput = {
    title: string;
    description?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: string;
    labels?: Array<{
      name: string;
      color: string;
      icon: string;
    }>;
  };

  const createTask = useCallback(async (data: TaskCreateInput): Promise<Task> => {
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
      setTasks(prevTasks => (prevTasks ? [...prevTasks, createdTask] : [createdTask]));
      return createdTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  /**
   * Clear all active filters and reset URL
   */
  const clearFilters = useCallback((): void => {
    setActiveFilters({});
    setResetTrigger(prev => prev + 1);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url.toString());
    }
    fetchTasks({});
  }, [fetchTasks]);
  /**
   * Update a task in the local state
   * @param updatedTask - The updated task data
   */
  const updateTask = useCallback((updatedTask: Task): void => {
    setTasks(prevTasks => {
      if (!prevTasks) return prevTasks;
      return prevTasks.map(task => {
        if (task.id === updatedTask.id) {
          return updatedTask;
        }
        return task;
      });
    });
  }, []);
  /**
   * Delete a task from the local state
   * @param taskId - The ID of the task to delete
   */
  const deleteTask = useCallback((taskId: string): void => {
    setTasks(prevTasks => {
      if (!prevTasks) return prevTasks;
      return prevTasks.filter(task => task.id !== taskId);
    });
  }, []);
  return {
    tasks,
    isLoading,
    isSubmitting,
    activeFilters,
    resetTrigger,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearFilters,
    isInitialized,
  };
}
