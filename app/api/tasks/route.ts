// app/api/tasks/route.ts
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        labels: {
          create: data.labels?.map((label: string) => ({
            labelId: label
          }))
        }
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        dueDate: 'asc'
      },
      include: {
        labels: true
      }
    })
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}
