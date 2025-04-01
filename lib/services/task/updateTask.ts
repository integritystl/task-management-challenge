'use server';

import { prisma, Prisma } from '../../db';
import { TaskData } from '../../schemas/task';

/**
 * Updates a task with the provided data
 * @param taskId - The ID of the task to update
 * @param data - The data to update the task with
 * @returns The updated task with its labels, or null if not found
 */
export async function updateTask(taskId: string, data: TaskData) {
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
  await prisma.task.update({
    where: { id: taskId },
    data: {
      labels: {
        disconnect: updatedTask.labels.map((label: { id: string }) => ({ id: label.id })),
      },
    },
  });
  if (labels && labels.length > 0) {
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
