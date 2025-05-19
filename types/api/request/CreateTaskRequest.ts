import { z } from 'zod'
import { ETaskPriority, TTaskPriority } from '@/types/api/TaskPriority'
import { ETaskStatus, TTaskStatus } from '@/types/api/TaskStatus'
import { formatEnumForZodSchema } from '@/utils/zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(formatEnumForZodSchema<TTaskPriority>(ETaskPriority)),
  status: z.enum(formatEnumForZodSchema<TTaskStatus>(ETaskStatus)),
  dueDate: z.string().optional(),
  labels: z.array(z.string()).optional()
})

export type TCreateTaskRequest = z.infer<typeof createTaskSchema>
