import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Handles GET request for a specific task by ID
 * @param request The incoming request object
 * @param params Route parameters containing the taskId
 * @returns The task data or error response
 */
export async function GET(
  request: Request,
  { params }: { params: { taskId: string; }; }
): Promise<NextResponse> {
  try {
    const taskId = params.taskId;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { labels: true }
    });
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
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
  { params }: { params: { taskId: string; }; }
): Promise<NextResponse> {
  try {
    const taskId = params.taskId;
    const data = await request.json();
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId }
    });
    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);
    }
    if (data.labels) {
      await prisma.task.update({
        where: { id: taskId },
        data: {
          labels: {
            set: []
          }
        }
      });
      for (const labelData of data.labels) {
        let labelId: string;
        const existingLabel = await prisma.label.findFirst({
          where: { name: labelData.name }
        });
        if (existingLabel) {
          labelId = existingLabel.id;
        } else {
          const newLabel = await prisma.label.create({
            data: {
              name: labelData.name,
              color: labelData.color,
              icon: labelData.icon
            }
          });
          labelId = newLabel.id;
        }
        await prisma.task.update({
          where: { id: taskId },
          data: {
            labels: {
              connect: { id: labelId }
            }
          }
        });
      }
      delete data.labels;
    }
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data,
      include: { labels: true }
    });
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
  { params }: { params: { taskId: string; }; }
): Promise<NextResponse> {
  try {
    const taskId = params.taskId;
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId }
    });
    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    await prisma.task.update({
      where: { id: taskId },
      data: {
        labels: {
          set: []
        }
      }
    });
    await prisma.task.delete({
      where: { id: taskId }
    });
    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task', message: (error as Error).message },
      { status: 500 }
    );
  }
}
