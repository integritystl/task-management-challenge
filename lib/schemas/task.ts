import { TaskPriority, TaskStatus } from '@/lib/db';
import { z } from 'zod';
import { LabelSchema } from './label';

export const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus),
  dueDate: z
    .string()
    .optional()
    .refine(val => !val || !isNaN(new Date(val).getTime()), { message: 'Invalid date format' }),
  labels: z.array(LabelSchema).optional(),
});
export type TaskData = z.infer<typeof TaskSchema>;
