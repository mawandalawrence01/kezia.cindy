import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = category && category !== 'all' 
      ? { category: category.toUpperCase() as 'TRADITIONAL' | 'MODERN' | 'FORMAL' | 'CASUAL' | 'CULTURAL' }
      : {}

    const outfits = await prisma.outfit.findMany({
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
                image: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(outfits)
  } catch (error) {
    console.error('Error fetching outfits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch outfits' },
      { status: 500 }
    )
  }
}
