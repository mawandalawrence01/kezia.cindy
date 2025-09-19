import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.travelDiary.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching travel diary count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch travel diary count' },
      { status: 500 }
    )
  }
}
