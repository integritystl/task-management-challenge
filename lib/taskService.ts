import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7025/api/task';

export async function deleteTask(taskId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'DELETE',
    });

    return response.ok;
}

export async function fetchTasks(): Promise<any[]> {
    const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        const data = await response.json();
        return data.tasks || [];
    } else {
        console.error('Failed to fetch tasks');
        return [];
    }
}

export async function updateTask(taskId: string, updatedTask: any): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
    });

    return response.ok;
}

export async function createTask(newTask: any): Promise<boolean> {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
    });

    return response.ok;
}
