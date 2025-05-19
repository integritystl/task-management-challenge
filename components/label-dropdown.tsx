'use client'

import { Suspense } from 'react'
import { ListFilterIcon, PlusCircle } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useLabelsQuery } from '@/services/queryService'

interface ILabelDropdown {
  activeFilters: string[]
  onChange: (newFilters: string[]) => void
  isFilter?: boolean
  isSkeleton?: boolean
}

const SuspendableLabelDropdown = ({
  activeFilters,
  onChange,
  isFilter,
  isSkeleton
}: ILabelDropdown) => {
  const { data: labels } = isSkeleton
    ? { data: Array(3).fill(0) }
    : useLabelsQuery()

  const Icon = isFilter ? ListFilterIcon : PlusCircle

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: 'default', size: 'default' }))}
        disabled={isSkeleton}
      >
        <Icon className='mr-2 h-4 w-4' />
        Filter
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {labels.map(label => (
          <DropdownMenuCheckboxItem
            key={label.id}
            id={label.id}
            checked={activeFilters.includes(label.id)}
            onCheckedChange={() => {
              const newActiveFilters = activeFilters.concat()

              const foundIndex = newActiveFilters.indexOf(label.id)
              if (foundIndex >= 0) {
                newActiveFilters.splice(foundIndex, 1)
              } else {
                newActiveFilters.push(label.id)
              }

              onChange(newActiveFilters)
            }}
          >
            {label.title}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const LabelDropdown = (props: ILabelDropdown) => (
  <Suspense
    fallback={
      <SuspendableLabelDropdown
        {...props}
        isSkeleton
      />
    }
  >
    <SuspendableLabelDropdown {...props} />
  </Suspense>
)
