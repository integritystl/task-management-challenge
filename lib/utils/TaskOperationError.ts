/**
 * Enum for specific task operation error types.
 */
export enum TaskErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
/**
 * Custom error class for task operations.
 * Allows wrapping specific error types for targeted handling.
 */
export class TaskOperationError extends Error {
  /**
   * The specific type of task error.
   */
  public type: TaskErrorType;
  /**
   * Optional original error for debugging.
   */
  public cause?: Error;
  /**
   * Creates an instance of TaskOperationError.
   * @param type - The specific type of task error.
   * @param message - The error message.
   * @param cause - Optional original error.
   */
  constructor(type: TaskErrorType, message: string, cause?: Error) {
    super(message);
    this.name = 'TaskOperationError';
    this.type = type;
    this.cause = cause;
    Object.setPrototypeOf(this, TaskOperationError.prototype);
  }
}
