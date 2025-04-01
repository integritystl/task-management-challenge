import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { Label, Task } from '@prisma/client';
import { LabelSchema } from '@/types/label';

/**
 * Error types for label operations
 */
enum LabelErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DUPLICATE_ERROR = 'DUPLICATE_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  PARAMETER_ERROR = 'PARAMETER_ERROR',
}
/**
 * Retrieves all labels
 * @returns List of labels or error response
 */
export async function GET(): Promise<
  NextResponse<Label[] | { error: string; message: string; type?: string; }>
> {
  try {
    const labels = await prisma.label.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(labels, { status: 200 });
  } catch (error) {
    console.error('Error fetching labels:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch labels',
        message: (error as Error).message,
        type: LabelErrorType.SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}
/**
 * Creates a new label
 * @param request The incoming request object
 * @returns The created label or error response
 */
export async function POST(
  request: Request
): Promise<
  NextResponse<
    Label | { error: string; message: string; details?: Record<string, unknown>; type?: string; }
  >
> {
  try {
    const data = await request.json();
    const validationResult = LabelSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'The provided label data is invalid',
          details: validationResult.error.format(),
          type: LabelErrorType.VALIDATION_ERROR,
        },
        { status: 400 }
      );
    }
    const validData = validationResult.data;
    const existingLabel = await prisma.label.findFirst({
      where: {
        name: validData.name,
      },
    }); 
    if (existingLabel) {
      return NextResponse.json(
        {
          error: 'Label already exists',
          message: 'A label with this name already exists',
          type: LabelErrorType.DUPLICATE_ERROR,
        },
        { status: 409 }
      );
    }
    const label = await prisma.label.create({
      data: {
        name: validData.name,
        color: validData.color,
        icon: validData.icon,
      },
    });
    return NextResponse.json(label, { status: 201 });
  } catch (error) {
    console.error('Error creating label:', error);
    return NextResponse.json(
      {
        error: 'Failed to create label',
        message: (error as Error).message,
        type: LabelErrorType.SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}
/**
 * Updates an existing label
 * @param request The incoming request object
 * @returns The updated label or error response
 */
export async function PATCH(
  request: Request
): Promise<
  NextResponse<
    Label | { error: string; message: string; details?: Record<string, unknown>; type?: string; }
  >
> {
  try {
    const data = await request.json();
    const UpdateLabelSchema = LabelSchema.extend({
      id: z.string().min(1, 'Label ID is required'),
    });

    const validationResult = UpdateLabelSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'The provided label data is invalid',
          details: validationResult.error.format(),
          type: LabelErrorType.VALIDATION_ERROR,
        },
        { status: 400 }
      );
    }
    const validData = validationResult.data;

    const existingLabel = await prisma.label.findUnique({
      where: {
        id: validData.id,
      },
    });
    if (!existingLabel) {
      return NextResponse.json(
        {
          error: 'Label not found',
          message: 'The label you are trying to update does not exist',
          type: LabelErrorType.NOT_FOUND_ERROR,
        },
        { status: 404 }
      );
    }

    if (validData.name !== existingLabel.name) {
      const duplicateLabel = await prisma.label.findFirst({
        where: {
          name: validData.name,
          id: { not: validData.id },
        },
      });
      if (duplicateLabel) {
        return NextResponse.json(
          {
            error: 'Label name already exists',
            message: 'Another label with this name already exists',
          },
          { status: 409 }
        );
      }
    }
    const updatedLabel = await prisma.label.update({
      where: { id: validData.id },
      data: {
        name: validData.name,
        color: validData.color,
        icon: validData.icon,
      },
    });
    return NextResponse.json(updatedLabel, { status: 200 });
  } catch (error) {
    console.error('Error updating label:', error);
    return NextResponse.json(
      {
        error: 'Failed to update label',
        message: (error as Error).message,
        type: LabelErrorType.SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}
/**
 * Deletes a label
 * @param request The incoming request object
 * @returns Success message or error response
 */
export async function DELETE(
  request: Request
): Promise<
  NextResponse<
    { success: boolean; message: string; } | { error: string; message: string; type?: string; }
  >
> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        {
          error: 'Missing parameter',
          message: 'Label ID is required',
          type: LabelErrorType.PARAMETER_ERROR,
        },
        { status: 400 }
      );
    }
    const existingLabel = await prisma.label.findUnique({
      where: { id },
      include: { tasks: true },
    });
    if (!existingLabel) {
      return NextResponse.json(
        {
          error: 'Label not found',
          message: 'The label you are trying to delete does not exist',
          type: LabelErrorType.NOT_FOUND_ERROR,
        },
        { status: 404 }
      );
    }
    return await prisma.$transaction(async tx => {
      await tx.label.update({
        where: { id },
        data: {
          tasks: {
            disconnect: existingLabel.tasks.map((task: Task) => ({ id: task.id })),
          },
        },
      });
      await tx.label.delete({
        where: { id },
      });
      return NextResponse.json(
        {
          success: true,
          message: 'Label deleted successfully',
        },
        { status: 200 }
      );
    });
  } catch (error) {
    console.error('Error deleting label:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete label',
        message: (error as Error).message,
        type: LabelErrorType.SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}
