import { TaskList } from '@/components/task-list';
import { CreateTaskButton } from '@/components/create-task-button';
import { EditTaskButton } from '@/components/update-task-button';

import axios from 'axios';
import https from 'https';

async function getTasks() {
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    });

    const response = await axios.get('https://localhost:7025/api/task', { httpsAgent });

    if (response.status !== 200)
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);

    return response.data;
}

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

export default async function Home() {
    const tasks = await getTasks();

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
                            <EditTaskButton task={task} />
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
