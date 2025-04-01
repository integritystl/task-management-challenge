'use client';

import { JSX, useState } from 'react';
import { TaskCard } from './task-card';
import { Task, Label } from '@/lib/db';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UpdateTaskButton } from './update-task-button';

/**
 * Task change event type
 */
type TaskChangeEvent =
  | { type: 'updated'; task: Task & { labels?: Label[] } }
  | { type: 'deleted'; taskId: string }
  | { type: 'created'; task: Task & { labels?: Label[] } };
/**
 * Props for the TaskList component
 */
interface TaskListProps {
  tasks: Task[] | null;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  onTaskChange?: (event: TaskChangeEvent) => void;
}
/**
 * TaskList Component - Displays a list of tasks and provides a way to create new tasks
 * @param props - Component props
 * @returns JSX element with the task list
 */
export function TaskList({
  tasks,
  hasActiveFilters = false,
  onClearFilters,
  onTaskChange,
}: TaskListProps): JSX.Element {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<(Task & { labels?: Label[] }) | null>(null);
  const handleOpenEditDialog = (taskToEdit: Task & { labels?: Label[] }): void => {
    setEditingTask(taskToEdit);
    setIsEditDialogOpen(true);
  };
  /**
   * Handle task update success
   * @param updatedTask - The updated task object
   */
  const handleTaskUpdated = (updatedTask: Task & { labels?: Label[] }): void => {
    setIsEditDialogOpen(false);
    setEditingTask(null);
    if (onTaskChange) {
      onTaskChange({ type: 'updated', task: updatedTask });
    }
  };
  /**
   * Handle task creation success
   * @param createdTask - The newly created task object
   */
  const handleTaskCreated = (createdTask: Task & { labels?: Label[] }): void => {
    if (onTaskChange) {
      onTaskChange({ type: 'created', task: createdTask });
    }
  };
  /**
   * Handle closing the edit dialog
   */
  const handleEditDialogClose = (open: boolean): void => {
    if (!open) {
      setEditingTask(null);
    }
    setIsEditDialogOpen(open);
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
      if (onTaskChange) {
        onTaskChange({ type: 'deleted', taskId });
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };
  const noTasksAvailable = tasks !== null && tasks.length === 0;
  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogClose}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-black">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the task details below.</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <UpdateTaskButton task={editingTask} onTaskChange={task => handleTaskUpdated(task)} />
          )}
        </DialogContent>
      </Dialog>
      <div className="">
        {noTasksAvailable ? (
          <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">
              {hasActiveFilters ? 'No Tasks Match Your Filters' : 'No Tasks Yet!'}
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {hasActiveFilters
                ? 'Try adjusting or clearing your filters.'
                : 'Get started by creating your first task.'}
            </p>
            <div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
              {hasActiveFilters && onClearFilters && (
                <Button onClick={onClearFilters} variant="secondary">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
              <UpdateTaskButton onTaskChange={task => handleTaskCreated(task)} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks
              ? tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={() => handleOpenEditDialog(task)}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
                ))
              : null}
          </div>
        )}
      </div>
    </>
  );
}
