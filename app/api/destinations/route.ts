import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      include: {
        stories: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(destinations)
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    )
  }
}