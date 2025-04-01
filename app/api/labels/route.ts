import { NextResponse } from 'next/server';
import {
  getAllLabels,
  createLabel,
  updateLabel,
  deleteLabel,
  LabelErrorType,
  LabelOperationError,
} from '@/lib/services/label';
import { Label } from '@/lib/db';

function handleErrorResponse(error: unknown): NextResponse<object> {
  if (error instanceof LabelOperationError) {
    switch (error.type) {
      case LabelErrorType.VALIDATION_ERROR:
        return NextResponse.json(
          {
            error: 'Validation Failed',
            message: error.message,
            details: error.details,
            type: error.type,
          },
          { status: 400 }
        );
      case LabelErrorType.DUPLICATE_ERROR:
        return NextResponse.json(
          {
            error: 'Conflict',
            message: error.message,
            type: error.type,
          },
          { status: 409 }
        );
      case LabelErrorType.NOT_FOUND_ERROR:
        return NextResponse.json(
          {
            error: 'Not Found',
            message: error.message,
            type: error.type,
          },
          { status: 404 }
        );
      case LabelErrorType.SERVER_ERROR:
      default:
        console.error('Label Service Server Error:', error);
        return NextResponse.json(
          {
            error: 'Internal Server Error',
            message: error.message || 'An unexpected error occurred',
            type: LabelErrorType.SERVER_ERROR,
          },
          { status: 500 }
        );
    }
  } else {
    console.error('Unhandled API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        type: LabelErrorType.SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}
/**
 * Retrieves all labels using the label service.
 * @returns List of labels or error response.
 */
export async function GET(): Promise<NextResponse<Label[] | object>> {
  try {
    const labels = await getAllLabels();
    return NextResponse.json(labels, { status: 200 });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
/**
 * Creates a new label using the label service.
 * @param request The incoming request object.
 * @returns The created label or error response.
 */
export async function POST(request: Request): Promise<NextResponse<Label | object>> {
  try {
    const data = await request.json();
    const newLabel = await createLabel(data);
    return NextResponse.json(newLabel, { status: 201 });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
/**
 * Updates an existing label using the label service.
 * @param request The incoming request object.
 * @returns The updated label or error response.
 */
export async function PATCH(request: Request): Promise<NextResponse<Label | object>> {
  try {
    const data = await request.json();
    const updatedLabel = await updateLabel(data);
    return NextResponse.json(updatedLabel, { status: 200 });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
/**
 * Deletes a label using the label service.
 * @param request The incoming request object.
 * @returns Success message or error response.
 */
export async function DELETE(request: Request): Promise<NextResponse<object>> {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Label ID is required',
          type: LabelErrorType.VALIDATION_ERROR,
        },
        { status: 400 }
      );
    }
    await deleteLabel({ id });
    return NextResponse.json(
      {
        success: true,
        message: 'Label deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleErrorResponse(error);
  }
}
