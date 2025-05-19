import { z } from 'zod'

export const createLabelSchema = z.object({
  title: z.string().min(1, 'Title is required')
})

export type TCreateLabelRequest = z.infer<typeof createLabelSchema>
