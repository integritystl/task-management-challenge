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

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
} as const;

const statusColors = {
  TODO: 'bg-gray-300 text-gray-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  DONE: 'bg-green-100 text-green-800',
} as const;

interface Label {
  id: string;
  title: string;
}

interface TaskWithLabels extends Task {
  labels?: Label[];
}

interface TaskCardProps {
  task: TaskWithLabels;
  children?: React.ReactNode; // modal for label editing
}

export function TaskCard({ task, children }: TaskCardProps) {
  return (
    <Card className='shadow-md'>
      <CardHeader>
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-xl">{task.title}</CardTitle>
          <Badge
            variant="outline"
            className={priorityColors[task.priority as keyof typeof priorityColors]}
          >
            {task.priority}
          </Badge>
        </div>
        <CardDescription>
          {task.dueDate && (
            <span className="text-sm text-gray-500">
              Due: {format(new Date(task.dueDate), 'PPP')}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{task.description}</p>
        <div className="flex flex-wrap gap-2 pb-3">
          <span>Labels:</span>
          {task.labels?.map((label) => (
            <Badge key={label.id} variant="default" className='bg-blue-600 h-fit'>
              {label.title}
            </Badge>
          ))}
          <div className="">{children}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span>Type:</span>
          <Badge className={statusColors[task.status as keyof typeof statusColors]}>
            {task.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
