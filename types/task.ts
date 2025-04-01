/**
 * Task status enum representing the different stages of a task
 */
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
/**
 * Task priority enum representing the importance level of a task
 */
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}
/**
 * Label interface representing a tag that can be applied to tasks
 */
export interface Label {
  id?: string;
  name: string;
  color: string;
  icon?: string;
}
/**
 * Task interface representing a task in the system
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | Date | null;
  labels?: Label[];
  createdAt: Date;
  updatedAt: Date;
}
/**
 * TaskInput interface for creating or updating a task
 */
export interface TaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | Date | null;
  labels?: Label[];
}