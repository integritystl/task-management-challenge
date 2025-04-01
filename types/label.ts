import { z } from 'zod';
// Define icon type for better type safety
export type IconName = 'tag' | 'check' | 'star' | 'flag' | 'bookmark' | 'heart' | 'bell' | 'alertCircle';
export const ICON_VALUES = ['tag', 'check', 'star', 'flag', 'bookmark', 'heart', 'bell', 'alertCircle'] as const;
// Predefined colors for labels
export const PREDEFINED_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
  '#ec4899', // pink
] as const;
/**
 * Label schema for validation
 */
export const LabelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Label name is required'),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Color must be a valid hex code'),
  icon: z.enum(ICON_VALUES)
});
export type LabelData = z.infer<typeof LabelSchema>;
