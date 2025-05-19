'use client'

import { LabelList } from '@/components/label-list'

export function LabelSection() {
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-3xl font-bold'>Labels</h2>
      <LabelList />
    </div>
  )
}
