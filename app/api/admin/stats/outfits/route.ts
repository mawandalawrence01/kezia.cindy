import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.outfit.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching outfit count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch outfit count' },
      { status: 500 }
    )
  }
}
