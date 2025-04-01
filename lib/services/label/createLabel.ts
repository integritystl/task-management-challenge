'use server';

import { prisma } from '@/lib/db';
import { Label, IconName } from '@/lib/db';
import { LabelSchema } from '@/lib/schemas/label';
import {
  LabelErrorType,
  LabelOperationError,
  CreateLabelData,
} from '../../utils/LabelOperationError';

/**
 * Validates and creates a new label in the database.
 * @param data - The data for the new label.
 * @returns A promise that resolves to the created label.
 * @throws {LabelOperationError} If validation fails, a duplicate exists, or a server error occurs.
 */
export async function createLabel(data: unknown): Promise<Label> {
  const validationResult = LabelSchema.safeParse(data);
  if (!validationResult.success) {
    throw new LabelOperationError(
      LabelErrorType.VALIDATION_ERROR,
      'The provided label data is invalid',
      validationResult.error.format()
    );
  }
  const validData: CreateLabelData = validationResult.data;
  try {
    const existingLabel = await prisma.label.findFirst({
      where: {
        name: validData.name,
      },
    });
    if (existingLabel) {
      throw new LabelOperationError(
        LabelErrorType.DUPLICATE_ERROR,
        'A label with this name already exists'
      );
    }
    const label = await prisma.label.create({
      data: {
        name: validData.name,
        color: validData.color,
        icon: validData.icon as IconName,
      },
    });
    return label;
  } catch (error) {
    if (error instanceof LabelOperationError) {
      throw error;
    }
    console.error('Error creating label in service:', error);
    throw new LabelOperationError(LabelErrorType.SERVER_ERROR, 'Failed to create label');
  }
}
