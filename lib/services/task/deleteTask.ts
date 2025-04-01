'use server';

import { prisma } from '../../db';

/**
 * Deletes a task by its ID
 * @param taskId - The ID of the task to delete
 * @returns true if the task was deleted, false if not found
 */
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
