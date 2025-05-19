import { CreateLabelButton } from '@/components/create-label-button'
import { CreateTaskButton } from '@/components/create-task-button'
import { LabelSection } from '@/components/label-section'
import { TaskSection } from '@/components/task-section'

export default async function Home() {
  return (
    <main className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold'>Task Management</h1>
        <CreateTaskButton />
        <CreateLabelButton />
      </div>
      <div className='flex flex-col gap-12'>
        <TaskSection />
        <LabelSection />
      </div>
    </main>
  )
}
