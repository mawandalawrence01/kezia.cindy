import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const fanMessages = await prisma.fanMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(fanMessages)
  } catch (error) {
    console.error('Error fetching fan messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fan messages' },
      { status: 500 }
    )
  }
}
