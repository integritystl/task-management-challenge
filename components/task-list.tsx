'use client';

import { useEffect, useState } from 'react';
import { TaskCard } from './task-card';
import { Task } from '@/lib/db';

interface TaskListProps {
  initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  useEffect(() => {
    const sortedTasks = initialTasks.slice().sort((a, b) => {
      const aDateStr = a.dueDate instanceof Date ? a.dueDate.toISOString() : a.dueDate;
      const bDateStr = b.dueDate instanceof Date ? b.dueDate.toISOString() : b.dueDate;
      if (!aDateStr) return 1;
      if (!bDateStr) return -1;

      return bDateStr.localeCompare(aDateStr);
    });

    setTasks(sortedTasks);
  }, [initialTasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}