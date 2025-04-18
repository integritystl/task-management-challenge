import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
type Label = {
  id: string;
  name: string;
  color: string;
};

type TaskLabel = {
  label: Label;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  labels?: TaskLabel[]; 
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{task.title}</CardTitle>
          <Badge variant="outline" className={
            task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }>
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
        <p className="text-gray-600 mb-4">{task.description}</p>
        
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={
            task.status === 'TODO' ? 'bg-gray-100 text-gray-800' :
            task.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
            'bg-green-100 text-green-800'
          }>
            {task.status}
          </Badge>
          
          {task.labels?.map((taskLabel) => (
            <Badge 
              key={taskLabel.label.id}
              className="rounded-full px-3 py-1"
              style={{
                backgroundColor: `${taskLabel.label.color}20`,
                borderColor: taskLabel.label.color,
                color: taskLabel.label.color
              }}
            >
              {taskLabel.label.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}