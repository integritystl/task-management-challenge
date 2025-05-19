'use client'

import { Suspense, useMemo } from 'react'

import { TaskCard } from '@/components/task-card'
import { Task } from '@/lib/db'
import {
  getLabelsQueryOptions,
  getTasksQueryOptions
} from '@/services/queryService'
import { useSuspenseQueries } from '@tanstack/react-query'

interface TaskListProps {
  filters: string[]
  isSkeleton?: boolean
}

function SuspendableTaskList({ filters, isSkeleton }: TaskListProps) {
  const [{ data: labels }, { data: taskData }] = isSkeleton
    ? [
        {
          data: []
        },
        {
          data: Array(3).fill(0)
        }
      ]
    : useSuspenseQueries({
        queries: [getLabelsQueryOptions(), getTasksQueryOptions()]
      })

  const tasks = useMemo(() => {
    if (!filters.length) {
      return taskData
    }

    return taskData?.filter((task: Task) =>
      task.labels.find(label => filters.includes(label.labelId))
    )
  }, [taskData, filters])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id ?? index}
          task={task}
          labels={labels}
          isSkeleton={isSkeleton}
        />
      ))}
    </div>
  )
}

export function TaskList(props: TaskListProps) {
  return (
    <Suspense
      fallback={
        <SuspendableTaskList
          {...props}
          isSkeleton
        />
      }
    >
      <SuspendableTaskList {...props} />
    </Suspense>
  )
}
