import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { TaskPriority, TaskStatus, Prisma } from '@prisma/client';
import { LabelSchema } from '@/types/label';


/**
 * Zod schema for task creation validation
 */
const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  dueDate: z
    .string()
    .optional()
    .refine(val => !val || !isNaN(new Date(val).getTime()), { message: 'Invalid date format' }),
  labels: z.array(LabelSchema).optional(),
});
/**
 * Creates a new task
 * @param request The incoming request object
 * @returns The created task or error response
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();
    const validationResult = CreateTaskSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }
    const validData = validationResult.data;
    const dueDate = validData.dueDate ? new Date(validData.dueDate) : null;
    const task = await prisma.task.create({
      data: {
        title: validData.title,
        description: validData.description,
        priority: validData.priority,
        status: validData.status,
        dueDate: dueDate,
      },
    });
    if (validData.labels && validData.labels.length > 0) {
      for (const labelData of validData.labels) {
        let labelId: string;
        const existingLabel = await prisma.label.findFirst({
          where: {
            name: labelData.name,
          },
        });
        if (existingLabel) {
          labelId = existingLabel.id;
        } else {
          const newLabel = await prisma.label.create({
            data: {
              name: labelData.name,
              color: labelData.color,
              icon: labelData.icon,
            },
          });

          labelId = newLabel.id;
        }
        await prisma.task.update({
          where: { id: task.id },
          data: {
            labels: {
              connect: { id: labelId },
            },
          },
        });
      }
    }
    const taskWithLabels = await prisma.task.findUnique({
      where: { id: task.id },
      include: { labels: true },
    });
    if (!taskWithLabels) {
      throw new Error('Failed to retrieve task with labels');
    }
    return NextResponse.json(taskWithLabels);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task', message: (error as Error).message },
      { status: 500 }
    );
  }
}
/**
 * Retrieves tasks with optional filtering
 * @param request The incoming request object
 * @returns List of filtered tasks or error response
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const labelIds = searchParams.getAll('labelId');
    const sortBy = searchParams.get('sortBy') || 'dueDate';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const where: Prisma.TaskWhereInput = {};
    if (priority && Object.values(TaskPriority).includes(priority as TaskPriority)) {
      where.priority = priority as TaskPriority;
    }
    if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
      where.status = status as TaskStatus;
    }
    if (labelIds.length > 0) {
      where.labels = {
        some: {
          id: {
            in: labelIds,
          },
        },
      };
    }
    const orderBy: Prisma.TaskOrderByWithRelationInput = {};
    if (['title', 'dueDate', 'priority', 'status', 'createdAt'].includes(sortBy)) {
      if (sortBy === 'title') orderBy.title = sortOrder === 'desc' ? 'desc' : 'asc';
      else if (sortBy === 'dueDate') orderBy.dueDate = sortOrder === 'desc' ? 'desc' : 'asc';
      else if (sortBy === 'priority') orderBy.priority = sortOrder === 'desc' ? 'desc' : 'asc';
      else if (sortBy === 'status') orderBy.status = sortOrder === 'desc' ? 'desc' : 'asc';
      else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.dueDate = 'asc';
    }
    const tasks = await prisma.task.findMany({
      where,
      orderBy,
      include: {
        labels: true,
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks', message: (error as Error).message },
      { status: 500 }
    );
  }
}
