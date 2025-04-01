'use server';

import { prisma } from '@/lib/db';
import { Label } from '@/lib/db';
import { LabelErrorType, LabelOperationError } from '../../utils/LabelOperationError';

/**
 * Retrieves all labels from the database, ordered by name.
 * @returns A promise that resolves to an array of labels.
 * @throws {LabelOperationError} If there's an error fetching labels.
 */
export async function getAllLabels(): Promise<Label[]> {
  try {
    const labels = await prisma.label.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return labels;
  } catch (error) {
    console.error('Error fetching labels in service:', error);
    throw new LabelOperationError(LabelErrorType.SERVER_ERROR, 'Failed to fetch labels');
  }
}
