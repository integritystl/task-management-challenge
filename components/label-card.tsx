import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/lib/db'

interface LabelCardProps {
  label: Label
  isSkeleton?: boolean
}

export function LabelCard({ label, isSkeleton }: LabelCardProps) {
  return (
    <Card>
      <CardHeader className={isSkeleton ? 'p-0' : ''}>
        {isSkeleton ? (
          <Skeleton className='flex p-6' />
        ) : (
          <div className='flex justify-between items-start'>
            <CardTitle className='text-xl'>{label.title}</CardTitle>
          </div>
        )}
      </CardHeader>
    </Card>
  )
}
