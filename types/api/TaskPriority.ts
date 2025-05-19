// This is how I've implemented my own TypeScript enums of sorts
// to avoid the funkiness that comes with actual enums
export const ETaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
} as const

export type TTaskPriority = (typeof ETaskPriority)[keyof typeof ETaskPriority]
