'use server';

import { prisma } from '../../db';

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
