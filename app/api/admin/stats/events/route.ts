import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.event.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching event count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event count' },
      { status: 500 }
    )
  }
}
