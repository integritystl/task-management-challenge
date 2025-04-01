'use client';

import { useState, useEffect, useCallback, useMemo, JSX } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Label as LabelComponent } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Tag,
  PlusCircle,
  Check,
  Star,
  Flag,
  Bookmark,
  Heart,
  Bell,
  AlertCircle,
  Loader2,
  Pencil,
  Trash2,
  Tags,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useLabelsApi } from '../hooks/use-labels-api';
import { ICON_VALUES, IconName, LabelData, LabelSchema, PREDEFINED_COLORS } from '@/types/label';
import { Label } from '@/lib/db';

/**
 * Props for the LabelFormDialog component
 */
interface LabelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (label: LabelData) => void;
  onCancel: () => void;
  initialData?: LabelData;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

/**
 * Helper function to render the appropriate icon component
 * @param iconName - Name of the icon to render
 * @param className - Optional CSS class name for styling
 * @returns JSX element with the appropriate icon
 */
const renderIcon = (iconName: IconName, className?: string): JSX.Element => {
  switch (iconName) {
    case 'tag':
      return <Tag className={className} />;
    case 'check':
      return <Check className={className} />;
    case 'star':
      return <Star className={className} />;
    case 'flag':
      return <Flag className={className} />;
    case 'bookmark':
      return <Bookmark className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'bell':
      return <Bell className={className} />;
    case 'alertCircle':
      return <AlertCircle className={className} />;
    default:
      return <Tag className={className} />;
  }
};

/**
 * LabelFormDialog Component - Dialog for creating and editing labels
 */
const LabelFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  initialData,
  isSubmitting,
  mode,
}: LabelFormDialogProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<LabelData>({
    resolver: zodResolver(LabelSchema),
    defaultValues: initialData || {
      name: '',
      color: PREDEFINED_COLORS[0],
      icon: 'tag',
    },
    mode: 'onChange',
  });

  const currentLabel = watch();

  // Reset form when dialog opens with initialData
  useEffect(() => {
    if (open && initialData) {
      reset(initialData);
    } else if (open && !initialData) {
      reset({
        name: '',
        color: PREDEFINED_COLORS[0],
        icon: 'tag',
      });
    }
  }, [open, initialData, reset]);

  // Handle dialog close
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onCancel();
      }
      onOpenChange(open);
    },
    [onCancel, onOpenChange]
  );

  // Handle form submission
  const handleFormSubmit = useCallback(
    (data: LabelData) => {
      onSubmit(data);
    },
    [onSubmit]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Label' : 'Edit Label'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Create a new label with a name, icon, and color.'
              : 'Update the label properties.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
          <div>
            <LabelComponent htmlFor="labelName">Label Name</LabelComponent>
            <Input
              id="labelName"
              {...register('name')}
              placeholder="Enter label name"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'labelNameError' : undefined}
            />
            {errors.name && (
              <p id="labelNameError" className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <LabelComponent htmlFor="labelIcon">Icon</LabelComponent>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={value => setValue('icon', value as IconName)}
                >
                  <SelectTrigger id="labelIcon">
                    <SelectValue placeholder="Select icon">
                      <div className="flex items-center">
                        {renderIcon(currentLabel.icon, 'h-4 w-4 mr-2')} {currentLabel.icon}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_VALUES.map(icon => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center">
                          {renderIcon(icon, 'h-4 w-4 mr-2')} {icon}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon.message}</p>}
          </div>

          <div>
            <LabelComponent htmlFor="labelColor">Color</LabelComponent>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {PREDEFINED_COLORS.map(color => (
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
              {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>}
            </div>
          </div>

          {/* Label Preview */}
          <div className="mt-3">
            <LabelComponent>Label</LabelComponent>
            <div className="flex items-center mt-1 p-2 border rounded-md">
              <div
                className="flex items-center rounded-md px-2 py-1 text-white"
                style={{ backgroundColor: currentLabel.color }}
              >
                {renderIcon(currentLabel.icon, 'h-3 w-3 mr-1')}
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
            <Button type="submit" size="sm" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : mode === 'create' ? (
                'Create'
              ) : (
                'Update'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

/**
 * ManageLabelsButton Component - Button and dialog for managing labels
 * @returns JSX element with the manage labels button and dialog
 */
export function ManageLabelsButton(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [labelFormOpen, setLabelFormOpen] = useState<boolean>(false);
  const [currentLabel, setCurrentLabel] = useState<LabelData | undefined>(undefined);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();
  const { labels, isLoading, isSubmitting, fetchLabels, createLabel, updateLabel, deleteLabel } =
    useLabelsApi();

  useEffect(() => {
    if (open) {
      fetchLabels();
    }
  }, [open, fetchLabels]);
  const handleCreateLabel = useCallback(() => {
    setCurrentLabel(undefined);
    setFormMode('create');
    setLabelFormOpen(true);
  }, []);
  const handleEditLabel = useCallback((label: LabelData) => {
    setCurrentLabel(label);
    setFormMode('edit');
    setLabelFormOpen(true);
  }, []);
  const handleDeleteLabel = useCallback(
    async (id: string) => {
      if (
        !window.confirm(
          'Are you sure you want to delete this label? It will be removed from all tasks.'
        )
      ) {
        return;
      }
      try {
        await deleteLabel(id);
        toast({
          title: 'Label deleted',
          description: 'The label has been successfully deleted.',
          variant: 'default',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed to delete label: ${(error as Error).message}`,
          variant: 'destructive',
        });
      }
    },
    [deleteLabel, toast]
  );
  const handleLabelSubmit = useCallback(
    async (data: LabelData) => {
      try {
        if (formMode === 'create') {
          await createLabel(data);
          toast({
            title: 'Label created',
            description: 'Your label has been successfully created.',
            variant: 'default',
          });
        } else {
          await updateLabel(data);
          toast({
            title: 'Label updated',
            description: 'Your label has been successfully updated.',
            variant: 'default',
          });
        }
        setLabelFormOpen(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed to ${formMode === 'create' ? 'create' : 'update'} label: ${(error as Error).message}`,
          variant: 'destructive',
        });
      }
    },
    [formMode, createLabel, updateLabel, toast]
  );
  const handleLabelFormCancel = useCallback(() => {
    setLabelFormOpen(false);
  }, []);
  const labelTable = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    if (labels.length === 0) {
      return (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">
            No labels found. Create your first label to get started.
          </p>
        </div>
      );
    }
    return (
      <>
        <div className="md:hidden w-full overflow-hidden">
          <div className="grid gap-4">
            {labels.map(label => (
              <div key={label.id} className="p-3 border rounded-md bg-background shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0"
                      style={{ backgroundColor: label.color }}
                    ></div>
                    <div className="font-medium">{label.name}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditLabel(label)}
                      disabled={isSubmitting}
                      aria-label={`Edit ${label.name}`}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => label.id && handleDeleteLabel(label.id)}
                      disabled={isSubmitting}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Delete ${label.name}`}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>Icon:</span>
                    {renderIcon(label.icon, 'h-4 w-4')}
                    <span className="capitalize">{label.icon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Color:</span>
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded mr-1"
                        style={{ backgroundColor: label.color }}
                      ></div>
                      <span className="text-xs truncate max-w-[100px]">{label.color}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:block overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labels.map(label => (
                <TableRow key={label.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: label.color }}
                      ></div>
                      {label.name}
                    </div>
                  </TableCell>
                  <TableCell>{renderIcon(label.icon, 'h-4 w-4')}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className="w-6 h-6 rounded mr-2"
                        style={{ backgroundColor: label.color }}
                      ></div>
                      <span className="text-sm">{label.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditLabel(label)}
                        disabled={isSubmitting}
                        aria-label={`Edit ${label.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => label.id && handleDeleteLabel(label.id)}
                        disabled={isSubmitting}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Delete ${label.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }, [labels, isLoading, isSubmitting, handleEditLabel, handleDeleteLabel]);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" aria-label="Manage Labels">
            <Tags className="h-4 w-4" />
            <span className="hidden lg:inline ml-2">Manage Labels</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Labels</DialogTitle>
            <DialogDescription>Create, edit, and delete labels for your tasks.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mb-4">
            <Button onClick={handleCreateLabel} aria-label="Create new label">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Label
            </Button>
          </div>
          {labelTable}
        </DialogContent>
      </Dialog>
      <LabelFormDialog
        open={labelFormOpen}
        onOpenChange={setLabelFormOpen}
        onSubmit={handleLabelSubmit}
        onCancel={handleLabelFormCancel}
        initialData={currentLabel}
        isSubmitting={isSubmitting}
        mode={formMode}
      />
    </>
  );
}
