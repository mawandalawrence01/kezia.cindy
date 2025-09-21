import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get photos with vote counts, ordered by most votes
    const topPhotos = await prisma.photo.findMany({
      include: {
        votes: true,
        _count: {
          select: {
            votes: true
          }
        }
      },
      orderBy: {
        votes: {
          _count: 'desc'
        }
      },
      take: 6 // Get top 6 photos
    })

    // Get weekly and monthly top picks
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const weeklyTop = await prisma.photo.findMany({
      where: {
        votes: {
          some: {
            createdAt: {
              gte: weekAgo
            }
          }
        }
      },
      include: {
        votes: {
          where: {
            createdAt: {
              gte: weekAgo
            }
          }
        },
        _count: {
          select: {
            votes: true
          }
        }
      },
      orderBy: {
        votes: {
          _count: 'desc'
        }
      },
      take: 2
    })

    const monthlyTop = await prisma.photo.findMany({
      where: {
        votes: {
          some: {
            createdAt: {
              gte: monthAgo
            }
          }
        }
      },
      include: {
        votes: {
          where: {
            createdAt: {
              gte: monthAgo
            }
          }
        },
        _count: {
          select: {
            votes: true
          }
        }
      },
      orderBy: {
        votes: {
          _count: 'desc'
        }
      },
      take: 2
    })

    return NextResponse.json({
      allTime: topPhotos,
      weekly: weeklyTop,
      monthly: monthlyTop
    })
  } catch (error) {
    console.error('Error fetching top picks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top picks' },
      { status: 500 }
    )
  }
}
