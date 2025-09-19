import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.photo.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error fetching photo count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photo count' },
      { status: 500 }
    )
  }
}
