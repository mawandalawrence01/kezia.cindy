import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.dailyQuote.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching quote count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quote count' },
      { status: 500 }
    )
  }
}
