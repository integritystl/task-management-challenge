import { IconName } from '@/lib/db';

/**
 * Error types for label operations.
 */
export enum LabelErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DUPLICATE_ERROR = 'DUPLICATE_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  PARAMETER_ERROR = 'PARAMETER_ERROR',
}
/**
 * Custom error class for label operations.
 */
export class LabelOperationError extends Error {
  /**
   * The specific type of error.
   */
  public readonly type: LabelErrorType;
  /**
   * Optional details, e.g., validation errors.
   */
  public readonly details?: unknown;
  constructor(type: LabelErrorType, message: string, details?: unknown) {
    super(message);
    this.name = 'LabelOperationError';
    this.type = type;
    this.details = details;
    // Ensure the prototype chain is correctly set
    Object.setPrototypeOf(this, LabelOperationError.prototype);
  }
}
/**
 * Type definition for data needed to create a label.
 */
export interface CreateLabelData {
  name: string;
  color: string;
  icon: IconName;
}
/**
 * Type definition for data needed to update a label.
 * Includes all fields from CreateLabelData as optional.
 */
export type UpdateLabelData = Partial<CreateLabelData>;
