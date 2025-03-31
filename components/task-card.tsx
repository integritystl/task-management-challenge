import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Task, Label } from '@/lib/db';
import { Tag, Check, Star, Flag, Bookmark, Heart, Bell, AlertCircle } from 'lucide-react';
import { memo } from 'react';
import { TaskPriority, TaskStatus } from '@/app/api/tasks/route';
import { IconName } from '@/lib/label-types';

const priorityColors = {
  [TaskPriority.LOW]: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  [TaskPriority.MEDIUM]: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  [TaskPriority.HIGH]: 'bg-red-100 text-red-800 hover:bg-red-200',
} as const;
const statusColors = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  [TaskStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  [TaskStatus.DONE]: 'bg-green-100 text-green-800 hover:bg-green-200',
} as const;
/**
 * Helper function to render the appropriate icon component
 * @param iconName - Name of the icon to render
 * @param className - Optional CSS class name for styling
 * @returns JSX element with the appropriate icon
 */
export const renderIcon = (iconName: IconName, className?: string) => {
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
 * TaskLabel Component - Displays a single label with icon and name
 */
const TaskLabel = ({ label }: { label: Label; }) => {
  return (
    <div
      className="flex items-center rounded-md px-2 py-1 text-white transition-transform hover:scale-105"
      style={{ backgroundColor: label.color }}
      role="listitem"
      aria-label={`Label: ${label.name}`}
    >
      {renderIcon(label.icon as IconName, "h-3 w-3 mr-1")}
      <span className="text-xs">{label.name}</span>
    </div>
  );
};
/**
 * Props for the TaskCard component
 */
interface TaskCardProps {
  task: Task & { labels?: Label[]; };
}
/**
 * TaskCard Component - Displays a task with its details in a card format
 * @param props - Component props
 * @returns JSX element with the task card
 */
function TaskCardComponent({ task }: TaskCardProps) {
  const hasDueDate = !!task.dueDate;
  const hasLabels = task.labels && task.labels.length > 0;
  // Convert to Date only if dueDate exists and is valid
  const dueDate = hasDueDate && task.dueDate ? new Date(task.dueDate) : null;
  // Only check for overdue if we have a valid date
  const isOverdue = dueDate instanceof Date && !isNaN(dueDate.getTime()) &&
    dueDate < new Date() &&
    task.status !== TaskStatus.DONE;
  // Format date safely
  const formatDate = (date: Date | null): string => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return format(date, 'PPP');
    }
    return 'Not set';
  };
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{task.title}</CardTitle>
          <Badge
            variant="outline"
            className={priorityColors[task.priority as keyof typeof priorityColors]}
            aria-label={`Priority: ${task.priority}`}
          >
            {task.priority}
          </Badge>
        </div>
        {hasDueDate && (
          <CardDescription>
            <span
              className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}
              aria-label={`Due date: ${formatDate(dueDate)}${isOverdue ? ', overdue' : ''}`}
            >
              Due: {formatDate(dueDate)}
              {isOverdue && ' (Overdue)'}
            </span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {task.description ? (
          <p className="text-gray-600 mb-4">{task.description}</p>
        ) : (
          <p className="text-gray-400 italic mb-4">No description provided</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            className={statusColors[task.status as keyof typeof statusColors]}
            aria-label={`Status: ${task.status.replace('_', ' ')}`}
          >
            {task.status.replace('_', ' ')}
          </Badge>
          {hasLabels && (
            <div
              className="flex flex-wrap gap-2"
              role="list"
              aria-label="Task labels"
            >
              {(task.labels || []).map((label) => (
                <TaskLabel key={label.id} label={label} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export const TaskCard = memo(TaskCardComponent);