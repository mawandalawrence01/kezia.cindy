import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.experience.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching experience count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experience count' },
      { status: 500 }
    )
  }
}
