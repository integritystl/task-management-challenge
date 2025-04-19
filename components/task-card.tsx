import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
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
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const [isDeleted, setIsDeleted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleted(true); // Optimistic update
    
    try {
      const response = await fetch(`/api/tasks?id=${task.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error();
      
      // Option A: Parent-managed state
      if (onDelete) onDelete(task.id);
      
      // Option B: Revalidate (choose one)
      router.refresh(); // or revalidatePath()
      
      toast({ title: 'Task deleted successfully' });
    } catch (error) {
      setIsDeleted(false); // Rollback
      toast({ 
        title: 'Deletion failed', 
        description: 'Task still exists in database',
        variant: 'destructive',
      });
    }
  };

  if (isDeleted) return null; // Hide immediately

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl">{task.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={
              task.priority === 'HIGH' ? 'bg-red-100 text-red-800 border-red-200' :
              task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
              'bg-blue-100 text-blue-800 border-blue-200'
            }>
              {task.priority}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleDelete}
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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
          {/* Status Badge with hover effect removed */}
          <Badge className={
            task.status === 'TODO' ? 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100' :
            task.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100' :
            'bg-green-100 text-green-800 border-green-200 hover:bg-green-100'
          }>
            {task.status}
          </Badge>
          
          {task.labels?.map((taskLabel) => (
            <Badge 
              key={taskLabel.label.id}
              className="rounded-full px-3 py-1 border"
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