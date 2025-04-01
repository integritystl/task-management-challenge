import { NextResponse } from 'next/server';
import { prisma, TaskPriority, TaskStatus, Prisma } from '@/lib/db';
import { TaskSchema } from '@/lib/schemas/task';
import { TaskOperationError, TaskErrorType } from '@/lib/utils/TaskOperationError';

/**
 * Handles TaskOperationError instances and returns appropriate NextResponse.
 * @param error The TaskOperationError instance.
 * @returns A NextResponse object.
 */
const handleTaskErrorResponse = (error: TaskOperationError): NextResponse => {
  console.error(`Task Operation Error: ${error.type} - ${error.message}`, error.cause);
  switch (error.type) {
    case TaskErrorType.VALIDATION_ERROR:
      return NextResponse.json(
        { error: 'Validation failed', details: error.cause },
        { status: 400 }
      );
    case TaskErrorType.NOT_FOUND:
      return NextResponse.json({ error: error.message }, { status: 404 });
    case TaskErrorType.DATABASE_ERROR:
      return NextResponse.json({ error: error.message }, { status: 500 });
    case TaskErrorType.UNKNOWN_ERROR:
    default:
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
};
/**
 * Creates a new task
 * @param request The incoming request object
 * @returns The created task or error response
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();
    const validationResult = TaskSchema.safeParse(data);
    if (!validationResult.success) {
      throw new TaskOperationError(
        TaskErrorType.VALIDATION_ERROR,
        'Task data validation failed.',
        validationResult.error.format() as unknown as Error
      );
    }
    const validData = validationResult.data;
    const dueDate = validData.dueDate ? new Date(validData.dueDate) : null;
    const taskWithLabels = await prisma.$transaction(async tx => {
      const task = await tx.task.create({
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
          let label = await tx.label.findUnique({
            where: { name: labelData.name },
          });
          if (!label) {
            label = await tx.label.create({
              data: {
                name: labelData.name,
                color: labelData.color,
                icon: labelData.icon,
              },
            });
          }
          await tx.task.update({
            where: { id: task.id },
            data: {
              labels: {
                connect: { id: label.id },
              },
            },
          });
        }
      }
      const finalTask = await tx.task.findUnique({
        where: { id: task.id },
        include: { labels: true },
      });
      if (!finalTask) {
        throw new TaskOperationError(
          TaskErrorType.DATABASE_ERROR,
          'Failed to retrieve task immediately after creation.'
        );
      }
      return finalTask;
    });
    return NextResponse.json(taskWithLabels, { status: 201 });
  } catch (error) {
    if (error instanceof TaskOperationError) {
      return handleTaskErrorResponse(error);
    }
    console.error('Unhandled error creating task:', error);
    let message = 'Failed to create task due to an unexpected error.';
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      message = `Database error creating task: ${error.code}`;
      return handleTaskErrorResponse(
        new TaskOperationError(TaskErrorType.DATABASE_ERROR, message, error)
      );
    } else if (error instanceof Error) {
      message = error.message;
    }
    return handleTaskErrorResponse(
      new TaskOperationError(
        TaskErrorType.UNKNOWN_ERROR,
        message,
        error instanceof Error ? error : undefined
      )
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
    if (error instanceof TaskOperationError) {
      return handleTaskErrorResponse(error);
    }
    console.error('Error fetching tasks:', error);
    let message = 'Failed to fetch tasks due to an unexpected error.';
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      message = `Database error fetching tasks: ${error.code}`;
      return handleTaskErrorResponse(
        new TaskOperationError(TaskErrorType.DATABASE_ERROR, message, error)
      );
    } else if (error instanceof Error) {
      message = error.message;
    }
    return handleTaskErrorResponse(
      new TaskOperationError(
        TaskErrorType.UNKNOWN_ERROR,
        message,
        error instanceof Error ? error : undefined
      )
    );
  }
}
