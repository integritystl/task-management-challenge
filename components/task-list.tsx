'use client';

import { useEffect, useState } from 'react';
import { TaskCard } from './task-card';
import { Task } from '@/lib/db';
import { Check } from 'lucide-react';
import { ManageLabelsModal } from './manage-labels-modal';
import { SelectTaskLabelsModal } from './select-task-labels-modal'

interface TaskListProps {
  initialTasks: Task[];
}

interface Label {
  id: string;
  title: string;
}

interface TaskWithLabels extends Task {
  labelIds?: string[];
  labels?: Label[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const starterLabels: Label[] = [
    { id: '1', title: 'Work' },
    { id: '2', title: 'Home' },
    { id: '3', title: 'Fitness' },
  ];

  const [tasks, setTasks] = useState<TaskWithLabels[]>(initialTasks);
  const [labels, setLabels] = useState<Label[]>(starterLabels);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  useEffect(() => {
    const sortedTasks = tasks.slice();
    sortedTasks.map((task) => ({ ...task, labelIds: [] }));
    sortedTasks.sort((a, b) => {
      const aDateStr = a.dueDate instanceof Date ? a.dueDate.toISOString() : a.dueDate;
      const bDateStr = b.dueDate instanceof Date ? b.dueDate.toISOString() : b.dueDate;
      if (!aDateStr) return 1;
      if (!bDateStr) return -1;
      return bDateStr.localeCompare(aDateStr);
    });

    setTasks(sortedTasks);
  }, [initialTasks]);

  const filteredTasks = selectedLabelId
    ? tasks.filter((task) => task.labelIds?.includes(selectedLabelId))
    : tasks;

  const handleAssignLabel = (taskId: string, labelId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId && !task.labelIds?.includes(labelId)
          ? { ...task, labelIds: [...(task.labelIds || []), labelId] }
          : task
      )
    );
  };

  const handleUnassignLabel = (taskId: string, labelId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, labelIds: task.labelIds?.filter((id) => id !== labelId) }
          : task
      )
    );
  };

  return (
    <>
      <section className="flex flex-row flex-wrap gap-3 pb-5">
        {labels.map((label) => (
          <button
            key={label.id}
            onClick={() =>
              setSelectedLabelId(selectedLabelId === label.id ? null : label.id)
            }
            className={`py-2 px-4 flex items-center gap-2 rounded-md text-white ${selectedLabelId === label.id
                ? 'bg-blue-900'
                : 'bg-blue-600 hover:bg-blue-900'
              }`}
          >
            {selectedLabelId === label.id && <Check size={20} />}
            {label.title}
          </button>
        ))}
        <ManageLabelsModal
          labels={labels}
          setLabels={setLabels}
          selectedLabelId={selectedLabelId}
          setSelectedLabelId={setSelectedLabelId}
        />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => {
          const taskLabels = labels.filter((label) => task.labelIds?.includes(label.id));
          return (
            <TaskCard key={task.id} task={{ ...task, labels: taskLabels }}>
              <SelectTaskLabelsModal
                labels={labels}
                setLabels={setLabels}
                selectedLabelId={selectedLabelId}
                setSelectedLabelId={setSelectedLabelId}
                onLabelAssign={(labelId) => handleAssignLabel(task.id, labelId)}
                onLabelUnassign={(labelId) => handleUnassignLabel(task.id, labelId)}
                taskId={task.id}
                taskLabels={task.labelIds || []}
              />
            </TaskCard>
          );
        })}
      </div>
    </>
  );
}
