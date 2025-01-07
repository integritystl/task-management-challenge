import axios from 'axios';
import https from 'https';
import { useEffect, useState } from 'react';

function Button({ label, onClick, className, type = 'button' }: {
    label: string;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit';
}) {
    return (
        <button
            type={type}
            className={`px-4 py-2 rounded ${className}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

function formatDueDate(dateString: string | null) {
    if (!dateString) return 'No due date';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }).format(date);
}

function getStatusBadge(status: string) {
    if (status === 'TODO')
        return { label: 'To Do', className: 'badge bg-secondary' };
    if (status === 'IN_PROGRESS')
        return { label: 'In Progress', className: 'badge bg-warning text-dark' };
    if (status === 'DONE')
        return { label: 'Done', className: 'badge bg-success' };

    return { label: status, className: 'badge bg-light text-dark' };
}

function getPriorityBadge(priority: string) {
    if (priority === 'LOW')
        return { label: 'Low', className: 'badge bg-blue-100 text-black' };
    if (priority === 'MEDIUM')
        return { label: 'Medium', className: 'badge bg-yellow-100 text-black' };
    if (priority === 'HIGH')
        return { label: 'High', className: 'badge bg-red-100 text-black' };
    return { label: priority, className: 'badge bg-light text-dark' };
}

// Use Azure backend URL from environment variable
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7025/api/task',
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

// Intercept errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        alert(
            error.response?.data?.message || 'An unexpected error occurred. Please try again later.'
        );
        return Promise.reject(error);
    }
);

export default function Home() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch tasks on mount
        api.get('')
            .then((response) => {
                if (response.status === 200 && response.data) {
                    setTasks(response.data);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = (taskId: string) => {
        // Delete a task
        api.delete(`/${taskId}`).then((response) => {
            if (response.status === 200) {
                setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
            }
        });
    };

    if (loading) return <p>Loading tasks...</p>;

    return (
        <main className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Task Management</h1>
                <Button label="Create Task" className="bg-blue-500 text-white hover:bg-blue-600" />
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
                            <p className="text-gray-800 mb-2">
                                Priority:{' '}
                                <span className={getPriorityBadge(task.priority).className}>
                                    {getPriorityBadge(task.priority).label}
                                </span>
                            </p>
                            <p>
                                <span className={className}>{label}</span>
                            </p>
                            <p className="text-gray-600 mb-4">
                                Due Date: {formatDueDate(task.dueDate)}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    label="Edit"
                                    className="bg-yellow-500 text-black hover:bg-yellow-600"
                                    onClick={() => console.log(`Edit ${task.id}`)}
                                />
                                <Button
                                    label="Delete"
                                    className="bg-red-500 text-white hover:bg-red-600"
                                    onClick={() => handleDelete(task.id)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
