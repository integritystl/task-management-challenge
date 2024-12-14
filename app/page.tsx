'use client';

import { useEffect, useState } from 'react';
import { CreateTaskButton } from '@/components/create-task-button';
import { EditTaskButton } from '@/components/update-task-button';
import axios from 'axios';
import https from 'https';

function formatDueDate(dateString: string | null) {
    if (!dateString) return 'No due date';

    try {
        const date = new Date(dateString);

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).format(date);
    } catch {
        return 'Invalid date';
    }
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'TODO':
            return { label: 'To Do', className: 'badge bg-secondary' };
        case 'IN_PROGRESS':
            return { label: 'In Progress', className: 'badge bg-warning text-dark' };
        case 'DONE':
            return { label: 'Done', className: 'badge bg-success' };
        default:
            return { label: status, className: 'badge bg-light text-dark' };
    }
}

export default function Home() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const httpsAgent = new https.Agent({
                    rejectUnauthorized: false,
                });

                const response = await axios.get('https://localhost:7025/api/task', { httpsAgent });

                if (response.status === 200)
                    setTasks(response.data);

            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, []);

    const handleDelete = async (taskId: string) => {
        try {
            const httpsAgent = new https.Agent({
                rejectUnauthorized: false,
            });

            const response = await axios.delete(`https://localhost:7025/api/task/${taskId}`, { httpsAgent });

            if (response.status === 204) { 
                setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
            } else {
                alert('Failed to delete the task.');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('An error occurred while deleting the task.');
        }
    };

    if (loading)
        return <p>Loading tasks...</p>;

    return (
        <main className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Task Management</h1>
                <CreateTaskButton />
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task: any) => {
                    const { label, className } = getStatusBadge(task.status);

                    return (
                        <div key={task.id} className="border p-4 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-2">{task.title}</h2>
                            <p className="text-gray-600 mb-2">
                                {task.description || 'No description provided'}
                            </p>
                            <p className="text-gray-800 mb-2">Priority: {task.priority}</p>
                            <p>
                                <span className={className}>{label}</span>
                            </p>
                            <p className="text-gray-600 mb-4">
                                Due Date: {formatDueDate(task.dueDate)}
                            </p>
                            <div className="flex gap-2">
                                <EditTaskButton task={task} />
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(task.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}