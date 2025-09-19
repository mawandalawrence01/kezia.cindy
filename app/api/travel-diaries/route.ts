import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const travelDiaries = await prisma.travelDiary.findMany({
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(travelDiaries)
  } catch (error) {
    console.error('Error fetching travel diaries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch travel diaries' },
      { status: 500 }
    )
  }
}
