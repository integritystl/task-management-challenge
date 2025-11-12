'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PencilIcon, PlusCircle } from 'lucide-react';
import { Task } from '@/lib/db';
import { format } from 'date-fns';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'] as const;

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(PRIORITIES),
  status: z.enum(STATUSES),
  dueDate: z.string().optional(),
});

const TEXT_CREATE = {
  errorCaught: 'Error creating task:',
  errorNotOk: 'Failed to create task',

  openModalButtonText: 'Create Task',
  submitButtonText: 'Create Task',

  description: 'Enter the details for your new task below.',
  title: 'Create New Task',
};
const TEXT_UPDATE = {
  errorCaught: 'Error updating task:',
  errorNotOk: 'Failed to update task',

  openModalButtonText: 'Edit Task',
  submitButtonText: 'Update Task',

  description: 'Update the details for your task below.',
  title: 'Edit Task',
};

type TaskFormData = z.infer<typeof taskSchema>;

export function EditTaskButton({
  task,
}: {
  task?: Omit<Task, 'dueDate'> & { dueDate?: string };
}) {
  const [open, setOpen] = useState(false);
  const isUpdateMode = !!task;
  const TEXT = isUpdateMode ? TEXT_UPDATE : TEXT_CREATE;

  const defaultDueDate = task?.dueDate
    ? format(new Date(task?.dueDate), 'yyyy-MM-dd')
    : '';

  const defaultValues: Partial<TaskFormData> = Object.assign(
    {
      priority: 'MEDIUM' as 'MEDIUM',
      status: 'TODO' as 'TODO',
    },
    task ?? {},
    { dueDate: defaultDueDate }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, reset, task]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const url = isUpdateMode ? `/api/tasks/${task!.id}` : '/api/tasks';
      const method = isUpdateMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(TEXT.errorNotOk);

      // Reset form to clean state and close
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(TEXT.errorCaught, error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {!isUpdateMode ? (
            <PlusCircle className="mr-2 h-4 w-4" />
          ) : (
            <PencilIcon className="mr-2 h-4 w-4" />
          )}
          {TEXT.openModalButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{TEXT.title}</DialogTitle>
          <DialogDescription>{TEXT.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Add tags #likeThis. (Or escape \#nonTags)"
              {...register('description')}
            />
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              onValueChange={(value) =>
                register('priority').onChange({
                  target: { value, name: 'priority' },
                })
              }
              defaultValue={task?.priority || 'MEDIUM'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) =>
                register('status').onChange({
                  target: { value, name: 'status' },
                })
              }
              defaultValue={task?.status || 'TODO'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              type="date"
              id="dueDate"
              {...register('dueDate')}
              defaultValue={defaultDueDate}
            />
          </div>
          <Button type="submit" className="w-full">
            {TEXT.submitButtonText}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
