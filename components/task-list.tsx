'use client';

import { useEffect, useState } from 'react';
import { TaskCard } from './task-card';
import { Task } from '@/lib/db';
import { tasks2tags } from '@/lib/tags';

interface TaskListProps {
  initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setTags(tasks2tags(tasks));
  }, [tasks]);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}