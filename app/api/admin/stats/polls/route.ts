import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.poll.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching poll count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch poll count' },
      { status: 500 }
    )
  }
}
