'use client'

import { Suspense } from 'react'

import { LabelCard } from '@/components/label-card'
import { useLabelsQuery } from '@/services/queryService'

interface LabelListProps {
  isSkeleton?: boolean
}

export function SuspendableLabelList({ isSkeleton }: LabelListProps) {
  const { data: labels } = isSkeleton
    ? { data: Array(3).fill(0) }
    : useLabelsQuery()

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {labels.map((label, index) => (
        <LabelCard
          key={label.id ?? index}
          label={label}
          isSkeleton={isSkeleton}
        />
      ))}
    </div>
  )
}

export function LabelList(_props: LabelListProps) {
  return (
    <Suspense fallback={<SuspendableLabelList isSkeleton />}>
      <SuspendableLabelList />
    </Suspense>
  )
}
