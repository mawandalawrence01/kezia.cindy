import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if photo exists
    const photo = await prisma.photo.findUnique({
      where: { id }
    })

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    // Check if user already voted for this photo
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_photoId: {
          userId: session.user.id,
          photoId: id
        }
      }
    })

    if (existingVote) {
      return NextResponse.json(
        { error: 'Already voted for this photo' },
        { status: 400 }
      )
    }

    // Create vote
    const vote = await prisma.vote.create({
      data: {
        userId: session.user.id,
        photoId: id
      }
    })

    // Get updated vote count
    const voteCount = await prisma.vote.count({
      where: { photoId: id }
    })

    return NextResponse.json({
      success: true,
      voteCount,
      voted: true
    })
  } catch (error) {
    console.error('Error voting for photo:', error)
    return NextResponse.json(
      { error: 'Failed to vote for photo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if vote exists
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_photoId: {
          userId: session.user.id,
          photoId: id
        }
      }
    })

    if (!existingVote) {
      return NextResponse.json(
        { error: 'Vote not found' },
        { status: 404 }
      )
    }

    // Delete vote
    await prisma.vote.delete({
      where: {
        userId_photoId: {
          userId: session.user.id,
          photoId: id
        }
      }
    })

    // Get updated vote count
    const voteCount = await prisma.vote.count({
      where: { photoId: id }
    })

    return NextResponse.json({
      success: true,
      voteCount,
      voted: false
    })
  } catch (error) {
    console.error('Error removing vote:', error)
    return NextResponse.json(
      { error: 'Failed to remove vote' },
      { status: 500 }
    )
  }
}
