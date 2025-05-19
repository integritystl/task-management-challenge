'use client'

import { useState } from 'react'

import { LabelDropdown } from '@/components/label-dropdown'
import { TaskList } from '@/components/task-list'

export function TaskSection() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleLableFilterChange = (newFilters: typeof activeFilters) =>
    setActiveFilters(newFilters)

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>Tasks</h2>
        <LabelDropdown
          activeFilters={activeFilters}
          onChange={handleLableFilterChange}
          isFilter
        />
      </div>
      <TaskList filters={activeFilters} />
    </div>
  )
}
