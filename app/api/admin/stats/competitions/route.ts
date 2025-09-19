import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.competition.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching competition count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competition count' },
      { status: 500 }
    )
  }
}
