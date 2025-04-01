import { LabelSchema } from '@/types/label';
import { prisma } from './db';
import { TaskPriority, TaskStatus, Prisma } from '@prisma/client';
import { z } from 'zod';

export const taskUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().optional(),
  labels: z.array(z.union([z.string(), LabelSchema])).optional(),
});
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
/**
 * Retrieves a task by its ID
 * @param taskId - The ID of the task to retrieve
 * @returns The task with its labels, or null if not found
 */
export async function getTaskById(taskId: string) {
  return await prisma.task.findUnique({
    where: { id: taskId },
    include: { labels: true },
  });
}
/**
 * Updates a task with the provided data
 * @param taskId - The ID of the task to update
 * @param data - The data to update the task with
 * @returns The updated task with its labels, or null if not found
 */
export async function updateTask(taskId: string, data: TaskUpdateInput) {
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });
  if (!existingTask) {
    return null;
  }
  const { labels, ...updateFields } = data;
  const updateData: Prisma.TaskUpdateInput = { ...updateFields };
  if (data.dueDate) {
    updateData.dueDate = new Date(data.dueDate);
  }
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: { labels: true },
  });
  if (labels && labels.length > 0) {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        labels: {
          disconnect: updatedTask.labels.map((label: { id: string; }) => ({ id: label.id })),
        },
      },
    });
    for (const label of labels) {
      const labelName = typeof label === 'string' ? label : label.name;
      const labelColor = typeof label === 'string' ? '#000000' : label.color;
      const labelIcon = typeof label === 'string' ? 'tag' : label.icon;
      const existingLabel = await prisma.label.findFirst({
        where: { name: labelName },
      });
      if (existingLabel) {
        await prisma.task.update({
          where: { id: taskId },
          data: {
            labels: {
              connect: { id: existingLabel.id },
            },
          },
        });
      } else {
        const newLabel = await prisma.label.create({
          data: { name: labelName, color: labelColor, icon: labelIcon },
        });
        await prisma.task.update({
          where: { id: taskId },
          data: {
            labels: {
              connect: { id: newLabel.id },
            },
          },
        });
      }
    }
  }
  return await prisma.task.findUnique({
    where: { id: taskId },
    include: { labels: true },
  });
}
export async function deleteTask(taskId: string) {
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });
  if (!existingTask) {
    return false;
  }
  await prisma.task.update({
    where: { id: taskId },
    data: {
      labels: {
        set: [],
      },
    },
  });
  await prisma.task.delete({
    where: { id: taskId },
  });
  return true;
}
