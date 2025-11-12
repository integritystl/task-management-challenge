import { NextResponse } from 'next/server';
import { prisma, Task } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }
    const rawData: Task = await request.json();
    const data = {
      ...rawData,
      dueDate: rawData.dueDate ? new Date(rawData.dueDate + 'T00:00:00') : null,
    };

    const task = await prisma.task.update({ where: { id }, data });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
