'use server';

import { prisma } from '@/lib/db';
import { Label, IconName } from '@/lib/db';
import { LabelSchema } from '@/lib/schemas/label';
import { z } from 'zod';
import { LabelErrorType, LabelOperationError } from '../../utils/LabelOperationError';

const UpdateLabelPayloadSchema = LabelSchema.partial().extend({
  id: z.string().min(1, 'Label ID is required'),
});
/**
 * Validates and updates an existing label in the database.
 * @param data - The data containing the label ID and fields to update.
 * @returns A promise that resolves to the updated label.
 * @throws {LabelOperationError} If validation fails, the label is not found, a duplicate name exists, or a server error occurs.
 */
export async function updateLabel(data: unknown): Promise<Label> {
  const validationResult = UpdateLabelPayloadSchema.safeParse(data);
  if (!validationResult.success) {
    throw new LabelOperationError(
      LabelErrorType.VALIDATION_ERROR,
      'Invalid update payload structure',
      validationResult.error.format()
    );
  }
  const { id, ...updateData } = validationResult.data;
  if (Object.keys(updateData).length === 0) {
    throw new LabelOperationError(LabelErrorType.VALIDATION_ERROR, 'No fields provided for update');
  }
  try {
    const existingLabel = await prisma.label.findUnique({
      where: { id },
    });
    if (!existingLabel) {
      throw new LabelOperationError(
        LabelErrorType.NOT_FOUND_ERROR,
        `Label with ID "${id}" not found`
      );
    }
    if (updateData.name !== undefined && updateData.name !== existingLabel.name) {
      const duplicateLabel = await prisma.label.findFirst({
        where: {
          name: updateData.name,
          id: { not: id },
        },
      });
      if (duplicateLabel) {
        throw new LabelOperationError(
          LabelErrorType.DUPLICATE_ERROR,
          `Another label with the name "${updateData.name}" already exists`
        );
      }
    }
    const prismaUpdateData: { name?: string; color?: string; icon?: IconName } = {};
    if (updateData.name !== undefined) prismaUpdateData.name = updateData.name;
    if (updateData.color !== undefined) prismaUpdateData.color = updateData.color;
    if (updateData.icon !== undefined) prismaUpdateData.icon = updateData.icon as IconName;
    const updatedLabel = await prisma.label.update({
      where: { id },
      data: prismaUpdateData,
    });
    return updatedLabel;
  } catch (error) {
    if (error instanceof LabelOperationError) {
      throw error;
    }
    console.error('Error updating label in service:', error);
    throw new LabelOperationError(LabelErrorType.SERVER_ERROR, 'Failed to update label');
  }
}
