'use client';

import { useState, useEffect, JSX } from 'react';
import { CreateTaskButton } from '@/components/create-task-button';
import { ManageLabelsButton } from '@/components/manage-labels-button';
import { TaskFilter } from '@/components/task-filter';
import { ErrorBoundary } from '@/components/error-boundary';
import { LoadingSpinner } from '@/components/loading-spinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTasksApi, TaskFilterOptions } from '@/hooks/use-tasks-api';
import { Badge } from '@/components/ui/badge';
import { TaskList } from '@/components/task-list';
import { X } from 'lucide-react';

/**
 * Home component that displays the task management dashboard
 * @returns {JSX.Element} The rendered Home component
 */
export default function Home(): JSX.Element {
  const {
    tasks,
    isLoading,
    activeFilters,
    resetTrigger,
    fetchTasks,
    clearFilters
  } = useTasksApi();
  const [error, setError] = useState<Error | null>(null);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const hasActiveFilters = (
    !!activeFilters.priority ||
    !!activeFilters.status ||
    (activeFilters.labelIds && activeFilters.labelIds.length > 0)
  );
  useEffect(() => {
    loadTasks();
  }, []);
  const loadTasks = async (): Promise<void> => {
    setError(null);
    try {
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    }
  };
  const handleRefresh = async (): Promise<void> => {
    setIsRefetching(true);
    try {
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsRefetching(false);
    }
  };
  const handleTaskCreated = (): void => {
    loadTasks();
  };
  const handleFilterChange = (filters: TaskFilterOptions): void => {
    fetchTasks(filters).catch(err => {
      setError(err instanceof Error ? err : new Error('An error occurred while filtering tasks'));
    });
  };
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-background border-b shadow-sm">
          <div className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl sm:text-4xl font-bold">Task Management</h1>
              <div className="flex space-x-2">
                <TaskFilter
                  onFilterChange={handleFilterChange}
                  activeFilters={activeFilters}
                  resetTrigger={resetTrigger}
                />
                <ManageLabelsButton />
                <CreateTaskButton onTaskCreated={handleTaskCreated} />
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 flex-grow">
          {error ? (
            <div className="w-full p-6 flex items-center justify-center">
              <div className="bg-destructive/10 text-destructive rounded-lg p-6 max-w-md">
                <h3 className="font-semibold mb-2">Error Loading Tasks</h3>
                <p>{error.message}</p>
                <Button
                  onClick={handleRefresh}
                  className="mt-4"
                  disabled={isRefetching}
                >
                  {isRefetching ? 'Retrying...' : 'Retry'}
                </Button>
              </div>
            </div>
          ) : isLoading || isRefetching ? (
            <LoadingSpinner />
            ) : (
                <>
                  {hasActiveFilters && (
                    <div className="mb-4 flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-medium">Active filters:</span>
                      {activeFilters.priority && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Priority: {activeFilters.priority}
                        </Badge>
                      )}
                      {activeFilters.status && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Status: {activeFilters.status.replace('_', ' ')}
                        </Badge>
                      )}
                      {activeFilters.labelIds && activeFilters.labelIds.length > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Labels: {activeFilters.labelIds.length}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={clearFilters}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear all
                      </Button>
                    </div>
                  )}
                  <TaskList
                    initialTasks={tasks}
                    onTaskCreated={handleTaskCreated}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={clearFilters}
                  />
                </>
          )}
        </main>
        <footer className="bg-background border-t py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} <Link href="https://integrityxd.com" target="_blank" className="hover:underline text-primary">IntegrityXD</Link>. All rights reserved.
              </div>
              <Link
                href="https://github.com/integrityxd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub Profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
