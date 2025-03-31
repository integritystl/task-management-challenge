import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Task } from '@/lib/db';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
} as const;

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  DONE: 'bg-green-100 text-green-800',
} as const;

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const hasDueDate = !!task.dueDate;
  // Convert to Date only if dueDate exists and is valid
  const dueDate = hasDueDate && task.dueDate ? new Date(task.dueDate) : null;
  // Only check for overdue if we have a valid date
  const isOverdue =
    dueDate instanceof Date &&
    !isNaN(dueDate.getTime()) &&
    dueDate < new Date() &&
    task.status !== "DONE";

  const formatDate = (date: Date | null): string => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      // Create a new date with the UTC values to prevent timezone issues
      const localDate = new Date(date.getTime());
      localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
      return format(localDate, 'PPP');
    }
    return 'Not set';
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{task.title}</CardTitle>
          <Badge variant="outline" className={priorityColors[task.priority as keyof typeof priorityColors]}>
            {task.priority}
          </Badge>
        </div>
        <CardDescription>
          {task.dueDate && (
            <span
              className={cn(
                'flex items-center text-sm',
                isOverdue ? 'text-rose-600' : 'text-slate-500 dark:text-green-200'
              )}
              aria-label={`Due date: ${formatDate(dueDate)}${isOverdue ? ', overdue' : ''}`}
            >
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span className={isOverdue ? 'text-rose-600' : 'text-slate-500 dark:text-green-200'}>
                {formatDate(dueDate)}
              </span>
              {isOverdue && <span className="ml-1.5 font-medium text-rose-600">(Overdue)</span>}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{task.description}</p>
        <Badge className={statusColors[task.status as keyof typeof statusColors]}>{task.status}</Badge>
      </CardContent>
    </Card>
  );
}