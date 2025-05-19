export const ETaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const

export type TTaskStatus = (typeof ETaskStatus)[keyof typeof ETaskStatus]
