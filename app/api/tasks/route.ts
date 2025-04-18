// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {z} from 'zod';

const LabelSchema = z.object({
  name: z.string(),
  color: z.string()
  .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color format')
  .default('#3b82f6')
})

const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  priority: z.string()
    .refine(val => ['LOW', 'MEDIUM', 'HIGH'].includes(val), 'Invalid priority value')
    .default('MEDIUM').optional(),
  status: z.string()
    .refine(val => ['TODO', 'IN_PROGRESS', 'DONE'].includes(val), 'Invalid status value')
    .default('TODO').optional(),
  dueDate: z.string().optional().refine(val => !val || !isNaN(new Date(val).getTime())), 
  labels: z.array(LabelSchema).optional()
})
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (data.dueDate && isNaN(dueDate!.getTime())) {
      return NextResponse.json(
        { error: 'Invalid due date format' },
        { status: 400 }
      );
    }
    const task = await prisma.$transaction(async (prisma) => {
      // Create the main task
      const createdTask = await prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          dueDate: dueDate,
        },
      });

      // Process labels with while loop
      let labelIndex = 0;
      const labelData = data.labels || [];
      
      while (labelIndex < labelData.length) {
        const label = labelData[labelIndex];
        
        // Check if label exists
        const existingLabel = await prisma.label.findFirst({
          where: { name: label.name }
        });

        let labelId: string;
        
        if (existingLabel) {
          labelId = existingLabel.id;
        } else {
          // Create new label if it doesn't exist
          const newLabel = await prisma.label.create({
            data: {
              name: label.name,
              color: label.color || '#3b82f6', // Default color from your schema
            }
          });
          labelId = newLabel.id;
        }

        // Connect label to task
        await prisma.taskLabel.create({
          data: {
            taskId: createdTask.id,
            labelId: labelId
          }
        });

        labelIndex++; // Move to next label
      }

      return createdTask;
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams} = new URL(request.url)
    const labelNames = searchParams.getAll('label');
    const tasks = await prisma.task.findMany({
      where: labelNames.length > 0 ? {
        labels: {
          some: {
            label: {
              name: {
                in: labelNames
              }
            }
          }
        }
      } : undefined,
      orderBy: {
        dueDate: 'asc',
      },
      include: {
        labels: {
          include: {
            label: true
          }
        }
      }
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
