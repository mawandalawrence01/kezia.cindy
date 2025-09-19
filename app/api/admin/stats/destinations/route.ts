import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.destination.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching destination count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch destination count' },
      { status: 500 }
    )
  }
}
