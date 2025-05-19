'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useCreateTaskMutation } from '@/services/queryService'
import {
  createTaskSchema,
  TCreateTaskRequest
} from '@/types/api/request/CreateTaskRequest'
import { ETaskPriority } from '@/types/api/TaskPriority'
import { LabelDropdown } from './label-dropdown'

export function CreateTaskButton() {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<TCreateTaskRequest>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: 'MEDIUM',
      status: 'TODO'
    }
  })

  const { mutate: createTask } = useCreateTaskMutation({
    onSuccess: () => {
      reset()
      setOpen(false)
    },
    onError: error => {
      console.log(error)
      console.error('Error creating task:', new Error('Failed to create task'))
    }
  })

  const handleLabelsChange = (newLabels: TCreateTaskRequest['labels']) => {
    setValue('labels', newLabels, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true
    })
  }

  const onSubmit = async (data: TCreateTaskRequest) => {
    if (data.dueDate) {
      const date = new Date(data.dueDate)

      date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000)

      data.dueDate = date.toUTCString()
    }

    createTask(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className='mr-2 h-4 w-4' />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Enter the details for your new task below.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'
        >
          <div>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              {...register('title')}
            />
            {errors.title && (
              <p className='text-red-500 text-sm'>{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor='description'>Description</Label>
            <Input
              id='description'
              {...register('description')}
            />
          </div>
          <div>
            <Label htmlFor='priority'>Priority</Label>
            <Select
              onValueChange={value =>
                register('priority').onChange({
                  target: { value, name: 'priority' }
                })
              }
              defaultValue='MEDIUM'
            >
              <SelectTrigger>
                <SelectValue placeholder='Select priority' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ETaskPriority).map(priority => (
                  <SelectItem
                    key={priority}
                    value={priority}
                  >
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='dueDate'>Due Date</Label>
            <Input
              type='date'
              id='dueDate'
              {...register('dueDate')}
            />
          </div>
          <div>
            <LabelDropdown
              activeFilters={getValues('labels') ?? []}
              onChange={handleLabelsChange}
            />
            {/* <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: 'default', size: 'default' })
                )}
              >
                <PlusCircle className='mr-2 h-4 w-4' />
                Add Labels
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {labels.map(label => (
                  <DropdownMenuCheckboxItem
                    key={label.id}
                    id={label.id}
                    checked={getValues('labels')?.includes(label.id)}
                    onCheckedChange={() => {
                      const currentLabels = getValues('labels') ?? []

                      const foundIndex = currentLabels.indexOf(label.id)
                      if (foundIndex >= 0) {
                        currentLabels.splice(foundIndex, 1)
                      } else {
                        currentLabels.push(label.id)
                      }

                      setValue('labels', currentLabels, {
                        shouldDirty: true,
                        shouldValidate: true,
                        shouldTouch: true
                      })
                    }}
                  >
                    {label.title}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
          <Button
            type='submit'
            className='w-full'
          >
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
