import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.fanMessage.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching fan message count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fan message count' },
      { status: 500 }
    )
  }
}
