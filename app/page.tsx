'use client';

import { useState, useEffect, JSX } from 'react';
import { CreateTaskButton } from '@/components/create-task-button';
import { ManageLabelsButton } from '@/components/manage-labels-button';
import { Task } from '@/lib/db';
import { ErrorBoundary } from '@/components/error-boundary';
import { LoadingSpinner } from '@/components/loading-spinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TaskList } from '@/components/task-list';

/**
 * Fetches all tasks from the API
 * @returns {Promise<Task[]>} A promise that resolves to an array of tasks
 */
const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch('/api/tasks', {
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.statusText}`);
  }

  return res.json();
};
/**
 * Home component that displays the task management dashboard
 * @returns {JSX.Element} The rendered Home component
 */
export default function Home(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  useEffect(() => {
    loadTasks();
  }, []);
  const loadTasks = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };
  const handleRefresh = async (): Promise<void> => {
    setIsRefetching(true);
    try {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsRefetching(false);
    }
  };
  const handleTaskCreated = (newTask: Task): void => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-background border-b shadow-sm">
          <div className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl sm:text-4xl font-bold">Task Management</h1>
              <div className="flex space-x-2">
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
            <TaskList initialTasks={tasks} onTaskCreated={handleTaskCreated} />
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
