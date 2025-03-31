'use client';

import { JSX, useEffect, useState, Suspense } from 'react';
import { TaskCard } from './task-card';
import { Task } from '@/lib/db';
import { PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UpdateTaskButton } from './update-task-button';

/**
 * Props for the TaskList component
 */
interface TaskListProps {
  initialTasks: Task[];
  onTaskCreated?: (task: Task) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}
/**
 * TaskList Component - Displays a list of tasks and provides a way to create new tasks
 * @param props - Component props
 * @returns JSX element with the task list
 */
export function TaskList({ initialTasks, onTaskCreated, hasActiveFilters = false, onClearFilters }: TaskListProps): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    // Update tasks immediately to prevent state mismatch
    setTasks(initialTasks);
    // Use a short timeout to ensure loading state is properly handled
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [initialTasks]);
  /**
   * Handle task creation
   * @param newTask - The newly created task
   */
  const handleTaskCreated = (newTask: Task): void => {
    setTasks(prevTasks => [...prevTasks, newTask]);
    setIsDialogOpen(false);
    if (onTaskCreated) {
      onTaskCreated(newTask);
    }
  };
  /**
   * Handle task edit button click
   * @param task - The task to edit
   */
  const handleEditTask = (task: Task): void => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };
  /**
   * Handle task update
   * @param updatedTask - The updated task
   */
  const handleTaskUpdated = (updatedTask: Task): void => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    setIsEditDialogOpen(false);
    setEditingTask(null);
  };
  /**
   * Handle task deletion
   * @param taskId - The ID of the task to delete
   */
  const handleDeleteTask = async (taskId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new task.
            </DialogDescription>
          </DialogHeader>
          <UpdateTaskButton onTaskCreated={handleTaskCreated} />
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the details for this task.
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <UpdateTaskButton
              task={editingTask}
              onTaskUpdated={handleTaskUpdated}
            />
          )}
        </DialogContent>
      </Dialog>
      {isLoading ? (
        <TaskListSkeleton />
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 w-full max-w-md mx-auto shadow-sm">
              {hasActiveFilters ? (
                <>
                  <h3 className="text-xl mb-4 font-semibold">No Tasks Match Your Filters</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filter criteria or clear all filters to see more tasks.
                  </p>
                  {onClearFilters && (
                    <Button
                      onClick={onClearFilters}
                      variant="outline"
                      className="mb-2 w-full"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear All Filters
                    </Button>
                  )}
                </>
              ) : (
                <>
                      <h3 className="text-xl mb-4 font-semibold">No Tasks Have Been Created</h3>
                      <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="inline-flex items-center justify-center"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Task
                      </Button>
                </>
              )}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Skeleton loader for the task list
 * @returns JSX element with skeleton UI for loading state
 */
export function TaskListSkeleton(): JSX.Element {
  // Create an array of 6 skeleton cards
  const skeletonCards = Array.from({ length: 6 }, (_, index) => (
    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      {/* Title skeleton */}
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>

      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>

      {/* Status and priority skeleton */}
      <div className="flex justify-between mb-4">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>

      {/* Labels skeleton */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
      </div>

      {/* Footer skeleton */}
      <div className="flex justify-end mt-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>
  ));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skeletonCards}
    </div>
  );
}