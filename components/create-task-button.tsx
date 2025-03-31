'use client';

import { useState, useCallback, JSX } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { X, PlusCircle, Tag, Check, Star, Flag, Bookmark, Heart, Bell, AlertCircle, Loader2 } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '@/lib/db';

// Define icon type for better type safety
type IconName = 'tag' | 'check' | 'star' | 'flag' | 'bookmark' | 'heart' | 'bell' | 'alertCircle';
const ICON_VALUES = ['tag', 'check', 'star', 'flag', 'bookmark', 'heart', 'bell', 'alertCircle'] as const;

// Predefined colors for labels
const PREDEFINED_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
  '#ec4899', // pink
] as const;

/**
 * Label schema for validation
 */
const labelSchema = z.object({
  name: z.string().min(1, 'Label name is required'),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Color must be a valid hex code'),
  icon: z.enum(ICON_VALUES)
});

/**
 * Task schema for form validation
 */
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus),
  dueDate: z.string().optional().refine(
    (val) => !val || !isNaN(new Date(val).getTime()),
    { message: 'Invalid date format' }
  ),
  labels: z.array(labelSchema).optional()
});

type LabelData = z.infer<typeof labelSchema>;
type TaskFormData = z.infer<typeof taskSchema>;

/**
 * Props for the LabelsList component
 */
interface LabelsListProps {
  labels: LabelData[];
  onRemove: (index: number) => void;
}

/**
 * Props for the LabelDialog component
 */
interface LabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLabel: (label: LabelData) => void;
  onCancel: () => void;
}

/**
 * Props for the CreateTaskButton component
 */
interface CreateTaskButtonProps {
  onTaskCreated?: (task: Task) => void;
}

/**
 * Helper function to render the appropriate icon component
 * @param iconName - Name of the icon to render
 * @param className - Optional CSS class name for styling
 * @returns JSX element with the appropriate icon
 */
const renderIcon = (iconName: IconName, className?: string): JSX.Element => {
  switch (iconName) {
    case 'tag': return <Tag className={className} />;
    case 'check': return <Check className={className} />;
    case 'star': return <Star className={className} />;
    case 'flag': return <Flag className={className} />;
    case 'bookmark': return <Bookmark className={className} />;
    case 'heart': return <Heart className={className} />;
    case 'bell': return <Bell className={className} />;
    case 'alertCircle': return <AlertCircle className={className} />;
    default: return <Tag className={className} />;
  }
};

/**
 * LabelsList Component - Displays a list of labels with remove functionality
 */
const LabelsList = ({ labels, onRemove }: LabelsListProps): JSX.Element | null => {
  if (labels.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2" role="list" aria-label="Task labels">
      {labels.map((label, index) => (
        <div
          key={index}
          className="flex items-center rounded-md px-2 py-1 text-white"
          style={{ backgroundColor: label.color }}
          role="listitem"
        >
          {renderIcon(label.icon, "h-3 w-3 mr-1")}
          <span className="text-xs mr-1">{label.name}</span>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="ml-1 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full"
            aria-label={`Remove ${label.name} label`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

/**
 * LabelDialog Component - Dialog for creating and customizing labels
 */
const LabelDialog = ({
  open,
  onOpenChange,
  onAddLabel,
  onCancel
}: LabelDialogProps): JSX.Element => {
  const { register, handleSubmit, watch, reset, setValue, control, formState: { errors, isValid } } = useForm<LabelData>({
    resolver: zodResolver(labelSchema),
    defaultValues: {
      name: '',
      color: PREDEFINED_COLORS[0],
      icon: 'tag' as IconName
    }
  });

  const currentLabel = watch();

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      onCancel();
    }
    onOpenChange(open);
  }, [onCancel, onOpenChange]);

  const handleAddLabel = useCallback((data: LabelData) => {
    onAddLabel(data);
    reset();
  }, [onAddLabel, reset]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Label</DialogTitle>
          <DialogDescription>
            Customize your label with a name, icon, and color.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleAddLabel)} className="space-y-3">
          <div>
            <Label htmlFor="labelName">Label Name</Label>
            <Input
              id="labelName"
              {...register('name')}
              placeholder="Enter label name"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "labelNameError" : undefined}
            />
            {errors.name && (
              <p id="labelNameError" className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="labelIcon">Icon</Label>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => setValue('icon', value as IconName)}
                >
                  <SelectTrigger id="labelIcon">
                    <SelectValue placeholder="Select icon">
                      <div className="flex items-center">
                        {renderIcon(currentLabel.icon, "h-4 w-4 mr-2")} {currentLabel.icon}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_VALUES.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center">
                          {renderIcon(icon, "h-4 w-4 mr-2")} {icon}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.icon && (
              <p className="text-red-500 text-sm mt-1">{errors.icon.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="labelColor">Color</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {PREDEFINED_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-8 rounded-md border-2 ${currentLabel.color === color ? 'border-black dark:border-white' : 'border-transparent'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  style={{ backgroundColor: color }}
                  onClick={() => setValue('color', color)}
                  aria-label={`Select color ${color}`}
                  aria-pressed={currentLabel.color === color}
                />
              ))}
            </div>
            <div className="mt-2">
              <Input
                type="color"
                {...register('color')}
                className="h-8 w-full"
                aria-label="Custom color picker"
              />
              {errors.color && (
                <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>
              )}
            </div>
          </div>
          <div className="mt-3">
            <Label>Preview</Label>
            <div className="flex items-center mt-1 p-2 border rounded-md">
              <div
                className="flex items-center rounded-md px-2 py-1 text-white"
                style={{ backgroundColor: currentLabel.color }}
              >
                {renderIcon(currentLabel.icon, "h-3 w-3 mr-1")}
                <span className="text-xs">{currentLabel.name || 'Label Name'}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!isValid}
            >
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

/**
 * CreateTaskButton Component - Button and dialog for creating new tasks
 * @param props - Component props
 * @returns JSX element with the create task button and dialog
 */
export function CreateTaskButton({ onTaskCreated }: CreateTaskButtonProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [labelDialogOpen, setLabelDialogOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: '',
      labels: []
    },
  });

  const labels = watch('labels') || [];

  /**
   * Add a new label to the form
   */
  const addLabel = useCallback((newLabel: LabelData): void => {
    const currentLabels = [...(watch('labels') || [])];
    setValue('labels', [...currentLabels, newLabel], { shouldDirty: true });
    setLabelDialogOpen(false);
  }, [setValue, watch]);

  /**
   * Remove a label from the list
   * @param index - Index of the label to remove
   */
  const removeLabel = useCallback((index: number): void => {
    const currentLabels = [...(watch('labels') || [])];
    currentLabels.splice(index, 1);
    setValue('labels', currentLabels, { shouldDirty: true });
  }, [setValue, watch]);

  /**
   * Handle dialog close with confirmation if form is dirty
   */
  const handleDialogClose = useCallback((open: boolean) => {
    if (!open && isDirty) {
      // In a real app, you might want to show a confirmation dialog here
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        reset();
        setOpen(false);
      } else {
        return;
      }
    }
    setOpen(open);
  }, [isDirty, reset]);

  /**
   * Submit handler for the form
   * @param data - Form data
   */
  const onSubmit = async (data: TaskFormData): Promise<void> => {
    setIsSubmitting(true);
    try {
      // Ensure dueDate is properly formatted as an ISO string if it exists
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        labels: data.labels && data.labels.length > 0 ? data.labels : undefined
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
        throw new Error(errorData.message || 'Failed to create task');
      }

      const createdTask = await response.json();

      if (onTaskCreated) {
        onTaskCreated(createdTask);
      }
      toast({
        title: "Task created",
        description: "Your task has been successfully created.",
        variant: "default",
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: `Failed to create task: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle cancel for label dialog
   */
  const handleLabelCancel = useCallback(() => {
    setLabelDialogOpen(false);
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogTrigger asChild>
          <Button aria-label="Create Task">
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                aria-required="true"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "titleError" : undefined}
              />
              {errors.title && (
                <p id="titleError" className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                className="min-h-[80px] resize-y"
                placeholder="Add details about this task..."
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TaskPriority).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && (
                <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TaskStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                type="date"
                id="dueDate"
                {...register('dueDate')}
                aria-invalid={!!errors.dueDate}
                aria-describedby={errors.dueDate ? "dueDateError" : undefined}
              />
              {errors.dueDate && (
                <p id="dueDateError" className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Labels</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setLabelDialogOpen(true)}
                  className="h-8"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Label
                </Button>
              </div>
              <LabelsList labels={labels} onRemove={removeLabel} />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <LabelDialog
        open={labelDialogOpen}
        onOpenChange={setLabelDialogOpen}
        onAddLabel={addLabel}
        onCancel={handleLabelCancel}
      />
    </>
  );
}