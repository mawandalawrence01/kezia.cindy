import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.update.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching update count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch update count' },
      { status: 500 }
    )
  }
}
