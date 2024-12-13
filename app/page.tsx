import { TaskList } from '@/components/task-list';
import { CreateTaskButton } from '@/components/create-task-button';
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

export default async function Home() {
    const tasks = await getTasks();

    return (
        <main className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Task Management</h1>
                <CreateTaskButton />
            </div>
            <TaskList initialTasks={tasks} />
        </main>
    );
}
