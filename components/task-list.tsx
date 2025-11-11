'use client';

import { useEffect, useState } from 'react';
import { TaskCard } from './task-card';
import { Task } from '@/lib/db';
import { tasks2tags } from '@/lib/tags';
import { toggleArrayValue } from '@/lib/array';
import { TagToggles } from './tag-toggles';

interface TaskListProps {
  initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tags, setTags] = useState<string[]>([]);

  const [tags2filterBy, setTags2filterBy] = useState<string[]>([]);
  const [displayedTasks, setDisplayedTasks] = useState(tasks);

  const onToggle = (tag: string) =>
    setTags2filterBy(toggleArrayValue(tags2filterBy, tag));

  /** <EFFECTS> */
  /** @note derive tags from tasks */
  useEffect(() => {
    setTags(tasks2tags(tasks));
  }, [tasks]);

  /** @note filter out tasks based on tag filter toggles */
  useEffect(() => {
    if (!tags2filterBy.length) return setDisplayedTasks(tasks);

    /** @note if a tag contains any toggle tasks, display it */
    setDisplayedTasks(
      tasks.filter((task) => {
        if (!task.description) return false;

        const taskTags = tasks2tags([task]);
        return taskTags.some((tag) => tags2filterBy.includes(tag));
      })
    );
  }, [tags2filterBy]);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);
  /** </EFFECTS> */

  const ToggleValues = Object.fromEntries(
    tags.map((tag) => [tag, tags2filterBy.includes(tag)])
  );

  return (
    <>
      <TagToggles onToggle={onToggle} values={ToggleValues} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </>
  );
}
