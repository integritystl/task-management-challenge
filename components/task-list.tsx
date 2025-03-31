'use client';

import { JSX, useEffect, useState } from 'react';
import { TaskCard } from './task-card';
import { Task } from '@/lib/db';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateTaskButton } from './create-task-button';

/**
 * Props for the TaskList component
 */
interface TaskListProps {
  initialTasks: Task[];
  onTaskCreated?: (task: Task) => void;
}
/**
 * TaskList Component - Displays a list of tasks and provides a way to create new tasks
 * @param props - Component props
 * @returns JSX element with the task list
 */
export function TaskList({ initialTasks, onTaskCreated }: TaskListProps): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  useEffect(() => {
    setTasks(initialTasks);
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
          <CreateTaskButton onTaskCreated={handleTaskCreated} />
        </DialogContent>
      </Dialog>
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 w-full max-w-md mx-auto shadow-sm">
            <h3 className="text-xl mb-4 font-semibold">No Tasks Have Been Created</h3>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center justify-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </div>
        </div>
      )}
    </>
  );
}