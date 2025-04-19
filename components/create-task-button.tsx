import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { PlusCircle, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'] as const;

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(PRIORITIES),
  status: z.enum(STATUSES),
  dueDate: z.string().optional(),
  labels: z.array(
    z.object({
      name: z.string().min(1, 'Label name is required'),
      color: z.string()
        .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color format')
        .default('#3b82f6')
    })
  ).optional()
});

type TaskFormData = z.infer<typeof taskSchema>;

export function CreateTaskButton() {
  const [open, setOpen] = useState(false);
  const { 
    register, 
    handleSubmit, 
    reset, 
    control,
    formState: { errors },
    setValue,
    watch
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'MEDIUM',
      status: 'TODO',
      labels: []
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "labels"
  });

  const [newLabel, setNewLabel] = useState({
    name: '',
    color: '#3b82f6'
  });

  const addLabel = () => {
    if (newLabel.name.trim()) {
      append({
        name: newLabel.name.trim(),
        color: newLabel.color
      });
      setNewLabel({ name: '', color: '#3b82f6' });
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      const formattedData = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        labels: data.labels || []
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      reset();
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating task:', error);
      alert(error instanceof Error ? error.message : 'Failed to create task');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Enter the details for your new task below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                onValueChange={(value) =>
                  register('priority').onChange({
                    target: { value, name: 'priority' },
                  })
                }
                defaultValue="MEDIUM"
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
                defaultValue="TODO"
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
          </div>


          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              type="date"
              id="dueDate"
              {...register('dueDate')}  
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {fields.map((field, index) => (
                <Badge 
                  key={field.id}
                  className="flex items-center gap-1 rounded-full px-3 py-1"
                  style={{ 
                    backgroundColor: `${field.color}20`,
                    borderColor: field.color,
                    color: field.color
                  }}
                >
                  {field.name}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-full hover:bg-black/10 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {errors.labels && (
              <p className="text-red-500 text-sm">{errors.labels.message}</p>
            )}

            <div className="flex gap-2 items-center">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Label name"
                  value={newLabel.name}
                  onChange={(e) => setNewLabel({...newLabel, name: e.target.value})}
                  className="h-10"
                />
              </div>
              <div className="relative w-10 h-10">
                <input
                  type="color"
                  value={newLabel.color}
                  onChange={(e) => setNewLabel({...newLabel, color: e.target.value})}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                  id="color-picker"
                />
                <label 
                  htmlFor="color-picker"
                  className="absolute inset-0 rounded-full border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: newLabel.color }}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 rounded-full"
                onClick={addLabel}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}