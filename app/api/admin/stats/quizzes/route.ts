import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.quiz.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching quiz count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz count' },
      { status: 500 }
    )
  }
}
