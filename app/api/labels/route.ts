// app/api/labels/route.ts
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const label = await prisma.label.create({
      data: {
        title: data.title
      }
    })

    return NextResponse.json(label)
  } catch (error) {
    console.error('Error creating label:', error)
    return NextResponse.json(
      { error: 'Failed to create label' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const labels = await prisma.label.findMany({
      orderBy: {
        title: 'asc'
      }
    })

    return NextResponse.json(labels)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch labels' },
      { status: 500 }
    )
  }
}
