import { ICON_VALUES } from '@/lib/const';
import { z } from 'zod';

export const LabelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Label name is required'),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Color must be a valid hex code'),
  icon: z.enum(ICON_VALUES),
});
export type LabelData = z.infer<typeof LabelSchema>;
