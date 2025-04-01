import { NextResponse } from 'next/server';
import { getTaskById, updateTask, deleteTask } from '@/lib/task-operations';

/**
 * Handles GET request for a specific task by ID
 * @param request The incoming request object
 * @param params Route parameters containing the taskId
 * @returns The task data or error response
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string; }>; }
): Promise<Response> {
  try {
    const { taskId } = await params;

    const task = await getTaskById(taskId);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task', message: (error as Error).message },
      { status: 500 }
    );
  }
}
/**
 * Handles PATCH request to update a specific task by ID
 * @param request The incoming request object
 * @param params Route parameters containing the taskId
 * @returns The updated task data or error response
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string; }>; }
): Promise<Response> {
  try {
    const { taskId } = await params;
    const data = await request.json();
    const updatedTask = await updateTask(taskId, data);
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task', message: (error as Error).message },
      { status: 500 }
    );
  }
}
/**
 * Handles DELETE request to remove a specific task by ID
 * @param request The incoming request object
 * @param params Route parameters containing the taskId
 * @returns Success message or error response
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ taskId: string; }>; }
): Promise<Response> {
  try {
    const { taskId } = await params;
    const success = await deleteTask(taskId);
    if (!success) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task', message: (error as Error).message },
      { status: 500 }
    );
  }
}
