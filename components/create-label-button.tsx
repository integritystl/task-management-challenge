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
  createLabelSchema,
  TCreateLabelRequest
} from '@/types/api/request/CreateLabelRequest'
import { useCreateLabelMutation } from '@/services/queryService'

export function CreateLabelButton() {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TCreateLabelRequest>({
    resolver: zodResolver(createLabelSchema)
  })

  const { mutate: createLabel } = useCreateLabelMutation({
    onSuccess: () => {
      reset()
      setOpen(false)
    },
    onError: error => {
      console.log(error)
      console.error(
        'Error creating label:',
        new Error('Failed to create label')
      )
    }
  })

  const onSubmit = async (data: TCreateLabelRequest) => createLabel(data)

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className='mr-2 h-4 w-4' />
          Create Label
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Label</DialogTitle>
          <DialogDescription>Enter your new label below.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'
        >
          <div>
            <Label htmlFor='title'>Label</Label>
            <Input
              id='title'
              {...register('title')}
            />
            {errors.title && (
              <p className='text-red-500 text-sm'>{errors.title.message}</p>
            )}
          </div>
          <Button
            type='submit'
            className='w-full'
          >
            Create Label
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
