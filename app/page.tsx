'use client';

import { useState, useEffect, JSX } from 'react';
import { TaskList } from '@/components/task-list';
import { CreateTaskButton } from '@/components/create-task-button';
import { Task } from '@/lib/db';

async function getTasks(): Promise<Task[]> {
  const res = await fetch('/api/tasks', {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return res.json();
}

export default function Home(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTasks = async (): Promise<void> => {
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleTaskCreated = (newTask: Task): void => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Task Management</h1>
        <CreateTaskButton onTaskCreated={handleTaskCreated} />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      ) : (
          <TaskList initialTasks={tasks} />
      )}
    </main>
  );
}
