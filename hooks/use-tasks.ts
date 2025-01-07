import { useState } from 'react';
import { Task } from '@/lib/db';

export function useTasks(initialTasks: Task[]) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const addTask = (task: Task) => {
        setTasks((prev) => [...prev, task]);
    };

    const removeTask = (taskId: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
    };

    const updateTask = (updatedTask: Task) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
    };

    return { tasks, addTask, removeTask, updateTask };
}