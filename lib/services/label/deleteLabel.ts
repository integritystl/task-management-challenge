'use server';

import { prisma, Label } from '@/lib/db';
import { z } from 'zod';
import { LabelErrorType, LabelOperationError } from '../../utils/LabelOperationError';

const DeleteLabelPayloadSchema = z.object({
  id: z.string().min(1, 'Label ID is required for deletion'),
});
/**
 * Deletes a label from the database by its ID.
 * @param data - An object containing the ID of the label to delete.
 * @returns A promise that resolves when the deletion is successful.
 * @throws {LabelOperationError} If validation fails, the label is not found, or a server error occurs.
 */
export async function deleteLabel(data: unknown): Promise<void> {
  const validationResult = DeleteLabelPayloadSchema.safeParse(data);
  if (!validationResult.success) {
    throw new LabelOperationError(
      LabelErrorType.VALIDATION_ERROR,
      'Invalid delete payload structure',
      validationResult.error.format()
    );
  }
  const { id } = validationResult.data;
  let existingLabel: Label | null = null;
  try {
    existingLabel = await prisma.label.findUnique({
      where: { id },
    });
    if (!existingLabel) {
      throw new LabelOperationError(
        LabelErrorType.NOT_FOUND_ERROR,
        `Label with ID "${id}" not found for deletion`
      );
    }
    await prisma.label.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof LabelOperationError) {
      throw error;
    }
    if (error instanceof Error && 'code' in error && error.code === 'P2003') {
      console.warn(`Attempted to delete label "${id}" which is in use.`);
      const labelName = existingLabel ? existingLabel.name : id;
      throw new LabelOperationError(
        LabelErrorType.DUPLICATE_ERROR,
        `Cannot delete label "${labelName}" because it is currently assigned to one or more tasks.`
      );
    }
    console.error('Error deleting label in service:', error);
    throw new LabelOperationError(LabelErrorType.SERVER_ERROR, 'Failed to delete label');
  }
}
