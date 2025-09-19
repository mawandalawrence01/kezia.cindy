import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = category && category !== 'all' 
      ? { category: category.toUpperCase() as 'NATURE' | 'CULTURE' | 'FASHION' | 'EVENTS' }
      : {}

    const photos = await prisma.photo.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
      include: {
        votes: true,
        comments: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}
