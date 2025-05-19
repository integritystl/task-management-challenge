import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQueryClient,
  useSuspenseQuery,
  UseSuspenseQueryOptions
} from '@tanstack/react-query'

import { Label, Task } from '@/lib/db'
import { TCreateLabelRequest } from '@/types/api/request/CreateLabelRequest'
import { TCreateTaskRequest } from '@/types/api/request/CreateTaskRequest'

const queryKeys = {
  labels: ['labels'] as QueryKey,
  tasks: ['tasks'] as QueryKey
}

//
// LABELS
//

async function getLabels() {
  const res = await fetch('http://localhost:3000/api/labels', {
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error('Failed to fetch labels')
  }

  return res.json()
}

type UseLabelsSuspenseQueryOptions = UseSuspenseQueryOptions<
  Array<Label>,
  unknown
>
export const getLabelsQueryOptions = (
  options?: Omit<UseLabelsSuspenseQueryOptions, 'queryKey'>
): UseLabelsSuspenseQueryOptions => ({
  ...options,
  queryFn: () => getLabels(),
  queryKey: queryKeys.labels,
  staleTime: Infinity
})

export const useLabelsQuery = (
  options?: Omit<UseLabelsSuspenseQueryOptions, 'queryKey'>
) => useSuspenseQuery(getLabelsQueryOptions(options))

export const useCreateLabelMutation = (
  options?: UseMutationOptions<Response, Error, TCreateLabelRequest>
) => {
  const queryClient = useQueryClient()

  return useMutation<Response, Error, TCreateLabelRequest>({
    ...options,
    mutationFn: data =>
      fetch('/api/labels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.labels })

      options?.onSuccess?.(data, variables, context)
    }
  })
}

//
// TASKS
//

async function getTasks() {
  const res = await fetch('http://localhost:3000/api/tasks', {
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error('Failed to fetch tasks')
  }

  return res.json()
}

type UseTasksSuspenseQueryOptions = UseSuspenseQueryOptions<
  Array<Task>,
  unknown
>
export const getTasksQueryOptions = (
  options?: Omit<UseTasksSuspenseQueryOptions, 'queryKey'>
): UseTasksSuspenseQueryOptions => ({
  ...options,
  queryFn: () => getTasks(),
  queryKey: queryKeys.tasks,
  staleTime: Infinity
})

export const useTasksQuery = (
  options?: Omit<UseTasksSuspenseQueryOptions, 'queryKey'>
) => useSuspenseQuery(getTasksQueryOptions(options))

export const useCreateTaskMutation = (
  options?: UseMutationOptions<Response, Error, TCreateTaskRequest>
) => {
  const queryClient = useQueryClient()

  return useMutation<Response, Error, TCreateTaskRequest>({
    ...options,
    mutationFn: async data =>
      await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks })

      options?.onSuccess?.(data, variables, context)
    }
  })
}
