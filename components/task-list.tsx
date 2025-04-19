'use client';

import { useEffect, useState } from 'react';
import { TaskCard } from './task-card';
import { TaskFilters } from './task-filters';

interface TaskListProps {
  initialTasks: Task[];
}

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
type FilterOptions = {
  priority?: string[];
  status?: string[];
  labels?: string[];
};

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [taskCount, setTaskCount] = useState(initialTasks.length); // New state for count

  // Extract available labels and update count
  useEffect(() => {
    const labels = new Set<string>();
    initialTasks.forEach(task => {
      task.labels?.forEach(taskLabel => {
        labels.add(taskLabel.label.name);
      });
    });
    setAvailableLabels(Array.from(labels));
    setTaskCount(initialTasks.length); // Initialize count
  }, [initialTasks]);

  // Fetch tasks when filters change
  useEffect(() => {
    const fetchFilteredTasks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (filters.priority) {
          filters.priority.forEach(p => params.append('priority', p));
        }
        if (filters.status) {
          filters.status.forEach(s => params.append('status', s));
        }
        if (filters.labels) {
          filters.labels.forEach(l => params.append('label', l));
        }

        const response = await fetch(`/api/tasks?${params.toString()}`);
        const data = await response.json();
        setTasks(data);
        setTaskCount(data.length); // Update count when filtered
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredTasks();
  }, [filters]);

  const toggleFilter = (type: keyof FilterOptions, value: string) => {
    setFilters(prev => {
      const currentValues = prev[type] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value) // Remove if already selected
        : [...currentValues, value]; // Add if not selected
      
      return { 
        ...prev, 
        [type]: newValues.length > 0 ? newValues : undefined 
      };
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {loading ? 'Loading tasks...' : `Tasks (${taskCount})`}
        </h2>
        <TaskFilters
          availableLabels={availableLabels}
          filters={filters}
          onFilterChange={toggleFilter}
          onClearFilters={clearFilters}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No tasks found matching your filters
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}