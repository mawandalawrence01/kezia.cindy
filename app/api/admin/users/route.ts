import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            messages: true,
            votes: true,
            pollVotes: true,
            quizScores: true,
            submissions: true,
            comments: true,
            registrations: true,
            likes: true,
            accounts: true,
            sessions: true
          }
        },
        accounts: {
          select: {
            provider: true,
            type: true
          }
        },
        sessions: {
          select: {
            expires: true
          },
          orderBy: {
            expires: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to include activity summary
    const usersWithActivity = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.sessions[0]?.expires || null,
      provider: user.accounts[0]?.provider || 'unknown',
      activity: {
        totalMessages: user._count.messages,
        totalVotes: user._count.votes,
        totalPollVotes: user._count.pollVotes,
        totalQuizScores: user._count.quizScores,
        totalSubmissions: user._count.submissions,
        totalComments: user._count.comments,
        totalRegistrations: user._count.registrations,
        totalLikes: user._count.likes,
        totalActivity: user._count.messages + user._count.votes + user._count.pollVotes + 
                      user._count.quizScores + user._count.submissions + user._count.comments + 
                      user._count.registrations + user._count.likes
      }
    }))

    return NextResponse.json(usersWithActivity)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Delete user and all related data (cascade delete)
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
