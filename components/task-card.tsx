import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Task, Label } from '@/lib/db';
import {
  Tag,
  Check,
  Star,
  Flag,
  Bookmark,
  Heart,
  Bell,
  AlertCircle,
  Trash2,
  Edit,
  Calendar,
  Clock,
} from 'lucide-react';
import { JSX, memo } from 'react';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { IconName } from '@/types/label';

const priorityColors = {
  [TaskPriority.LOW]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    hover: 'hover:bg-blue-100',
    border: 'border-blue-200',
    icon: 'text-blue-500',
  },
  [TaskPriority.MEDIUM]: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    hover: 'hover:bg-amber-100',
    border: 'border-amber-200',
    icon: 'text-amber-500',
  },
  [TaskPriority.HIGH]: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    hover: 'hover:bg-rose-100',
    border: 'border-rose-200',
    icon: 'text-rose-500',
  },
} as const;
const statusColors = {
  [TaskStatus.TODO]: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    hover: 'hover:bg-slate-100',
    border: 'border-slate-200',
    icon: 'text-slate-500',
  },
  [TaskStatus.IN_PROGRESS]: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    hover: 'hover:bg-violet-100',
    border: 'border-violet-200',
    icon: 'text-violet-500',
  },
  [TaskStatus.DONE]: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    hover: 'hover:bg-emerald-100',
    border: 'border-emerald-200',
    icon: 'text-emerald-500',
  },
} as const;
const getPriorityIcon = (priority: TaskPriority): JSX.Element => {
  switch (priority) {
    case TaskPriority.LOW:
      return <Flag className="h-3.5 w-3.5" />;
    case TaskPriority.MEDIUM:
      return <Flag className="h-3.5 w-3.5" />;
    case TaskPriority.HIGH:
      return <Flag className="h-3.5 w-3.5" />;
    default:
      return <Flag className="h-3.5 w-3.5" />;
  }
};
const getStatusIcon = (status: TaskStatus): JSX.Element => {
  switch (status) {
    case TaskStatus.TODO:
      return <Clock className="h-3.5 w-3.5" />;
    case TaskStatus.IN_PROGRESS:
      return <Bell className="h-3.5 w-3.5" />;
    case TaskStatus.DONE:
      return <Check className="h-3.5 w-3.5" />;
    default:
      return <Clock className="h-3.5 w-3.5" />;
  }
};
/**
 * Helper function to render the appropriate icon component
 * @param iconName - Name of the icon to render
 * @param className - Optional CSS class name for styling
 * @returns JSX element with the appropriate icon
 */
export const renderIcon = (iconName: IconName, className?: string): JSX.Element => {
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
 * TaskLabel Component - Displays a single label with icon and name
 */
const TaskLabel = ({ label }: {
  label: Label;
}): JSX.Element => {
  return (
    <div
      className="flex items-center rounded-full px-2.5 py-1 text-white transition-all hover:scale-105 hover:shadow-sm"
      style={{ backgroundColor: label.color }}
      role="listitem"
      aria-label={`Label: ${label.name}`}
    >
      {renderIcon(label.icon as IconName, 'h-3.5 w-3.5 mr-1.5')}
      <span className="text-xs font-medium">{label.name}</span>
    </div>
  );
};
/**
 * Props for the TaskCard component
 */
interface TaskCardProps {
  task: Task & { labels?: Label[]; };
  onDelete?: (taskId: string) => Promise<void>;
  onEdit?: (task: Task & { labels?: Label[]; }) => void;
}
/**
 * TaskCard Component - Displays a task with its details in a card format
 * @param props - Component props
 * @returns JSX element with the task card
 */
function TaskCardComponent({ task, onDelete, onEdit }: TaskCardProps): JSX.Element {
  const hasDueDate = !!task.dueDate;
  const hasLabels = task.labels && task.labels.length > 0;
  // Convert to Date only if dueDate exists and is valid
  const dueDate = hasDueDate && task.dueDate ? new Date(task.dueDate) : null;
  // Only check for overdue if we have a valid date
  const isOverdue =
    dueDate instanceof Date &&
    !isNaN(dueDate.getTime()) &&
    dueDate < new Date() &&
    task.status !== TaskStatus.DONE;
  // Format date safely
  const formatDate = (date: Date | null): string => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return format(date, 'PPP');
    }
    return 'Not set';
  };
  const priorityStyle = priorityColors[task.priority as keyof typeof priorityColors];
  const statusStyle = statusColors[task.status as keyof typeof statusColors];
  return (
    <Card className="group transition-all duration-300 hover:shadow-lg border border-slate-200 hover:border-slate-300 overflow-hidden">
      <div
        className={cn(
          'h-1 w-full',
          task.status === TaskStatus.DONE
            ? 'bg-emerald-400'
            : task.priority === TaskPriority.HIGH
              ? 'bg-rose-400'
              : task.priority === TaskPriority.MEDIUM
                ? 'bg-amber-400'
                : 'bg-blue-400'
        )}
      />
      <CardHeader className="pb-3 pt-4">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl font-semibold text-slate-800 dark:text-green-400 leading-tight">
            {task.title}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-colors',
              priorityStyle.bg,
              priorityStyle.text,
              priorityStyle.hover,
              priorityStyle.border
            )}
            aria-label={`Priority: ${task.priority}`}
          >
            {getPriorityIcon(task.priority as TaskPriority)}
            <span>{task.priority}</span>
          </Badge>
        </div>
        {hasDueDate && (
          <div className="mt-2">
            <span
              className={cn(
                'flex items-center text-sm',
                isOverdue ? 'text-rose-600' : 'text-slate-500 dark:text-green-200'
              )}
              aria-label={`Due date: ${formatDate(dueDate)}${isOverdue ? ', overdue' : ''}`}
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>{formatDate(dueDate)}</span>
              {isOverdue && <span className="ml-1.5 font-medium">(Overdue)</span>}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-5">
        {task.description ? (
          <p className="text-slate-600 dark:text-gray-300 mb-5 leading-relaxed">
            {task.description}
          </p>
        ) : (
            <p className="text-slate-400 italic mb-5">No description provided</p>
        )}
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-colors',
              statusStyle.bg,
              statusStyle.text,
              statusStyle.hover,
              statusStyle.border
            )}
            aria-label={`Status: ${task.status.replace('_', ' ')}`}
          >
            {getStatusIcon(task.status as TaskStatus)}
            <span>{task.status.replace('_', ' ')}</span>
          </Badge>
          {hasLabels && (
            <div className="flex flex-wrap gap-2" role="list" aria-label="Task labels">
              {(task.labels || []).map(label => (
                <TaskLabel key={label.id} label={label} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
      {(onDelete || onEdit) && (
        <CardFooter className="pt-0 pb-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 text-slate-600 dark:text-green-200 dark:hover:text-blue-600 dark:hover:border-blue-200 dark:hover:bg-blue-50"
              onClick={() => onEdit(task)}
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs font-medium">Edit</span>
            </Button>
          )}
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-slate-200 text-slate-600 dark:text-green-200 dark:hover:text-rose-600 dark:hover:border-rose-200 dark:hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs font-medium">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-lg border-slate-200 dark:border-green-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-slate-800 dark:text-green-200">
                    Are you sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-600 dark:text-green-200">
                    This action cannot be undone. This will permanently delete the task &quot;
                    {task.title}&quot;.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full border-slate-200 text-slate-700 dark:text-green-200 dark:hover:bg-green-50 dark:hover:text-green-200">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(task.id)}
                    className="rounded-full bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export const TaskCard = memo(TaskCardComponent);
