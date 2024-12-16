import { TaskList } from '@/components/task-list';
import { CreateTaskButton } from '@/components/create-task-button';

async function getTasks() {
  const res = await fetch('http://localhost:5072/task', {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return res.json();
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
