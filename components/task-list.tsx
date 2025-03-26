'use client';

import { useEffect, useState } from 'react';

// Components
import { ManageLabelsModal } from './manage-labels-modal';
import { SelectTaskLabelsModal } from './select-task-labels-modal'
import { TaskCard } from './task-card';
import { Check, CalendarArrowUp, CalendarArrowDown } from 'lucide-react';

// Types
import { Task } from '@/lib/db';
import { TaskListProps, Label, TaskWithLabels } from '@/types/task-list';

const starterLabels: Label[] = [
  { id: '1', title: 'Work' },
  { id: '2', title: 'Home' },
  { id: '3', title: 'Fitness' },
]

function sortArrayOfTasks(arrayOfTasks: (Task[] | TaskWithLabels[]), sortOrder: 'asc' | 'desc') {
  arrayOfTasks.sort((a, b) => {
    const aDateStr = a.dueDate instanceof Date ? a.dueDate.toISOString() : a.dueDate;
    const bDateStr = b.dueDate instanceof Date ? b.dueDate.toISOString() : b.dueDate;
    if (!aDateStr) return 1;
    if (!bDateStr) return -1;
    return sortOrder === 'desc'
      ? bDateStr.localeCompare(aDateStr)
      : aDateStr.localeCompare(bDateStr);
  });
}


export function TaskList({ initialTasks }: TaskListProps) {
  sortArrayOfTasks(initialTasks, "desc")
  const [tasks, setTasks] = useState<TaskWithLabels[]>(initialTasks);
  const [labels, setLabels] = useState<Label[]>(starterLabels);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const sortedTasks = tasks.slice();
    sortedTasks.map((task) => ({ ...task, labelIds: [] }));
    sortArrayOfTasks(sortedTasks, sortOrder)
    setTasks(sortedTasks);
  }, [initialTasks, sortOrder]);

  const filteredTasks = selectedLabelId
    ? tasks.filter((task) => task.labelIds?.includes(selectedLabelId))
    : tasks;

  const handleAssignLabel = (taskId: string, labelId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId && !task.labelIds?.includes(labelId)) {
        const updatedLabelIds = [...(task.labelIds || []), labelId];
        return { ...task, labelIds: updatedLabelIds };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const handleUnassignLabel = (taskId: string, labelId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const filteredLabelIds = task.labelIds?.filter((id) => id !== labelId) || [];
        return { ...task, labelIds: filteredLabelIds };
      }
      return task;
    });
    setTasks(updatedTasks);
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
            className={`py-1 px-4 flex items-center gap-2 rounded-md text-white ${selectedLabelId === label.id
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
      <section>
        <div className="flex justify-start pb-3">
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400 flex items-center gap-2"
          >
            Sort Due Date: {sortOrder === 'desc' ? <CalendarArrowUp size={22} /> : <CalendarArrowDown size={22} />}
          </button>
        </div>
      </section>
      <hr className='pb-4 border-t-2 border-slate-300'></hr>
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
        {filteredTasks.length === 0 &&
          <p className='text-lg pt-5'>There are no tasks for this selected filter.</p>
        }
      </div>
    </>
  );
}
