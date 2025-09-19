import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET comments for a specific item (update, photo, outfit, or message)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const updateId = searchParams.get('updateId');
    const photoId = searchParams.get('photoId');
    const outfitId = searchParams.get('outfitId');
    const messageId = searchParams.get('messageId');

    if (!updateId && !photoId && !outfitId && !messageId) {
      return NextResponse.json(
        { error: 'At least one item ID is required' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        ...(updateId && { updateId }),
        ...(photoId && { photoId }),
        ...(outfitId && { outfitId }),
        ...(messageId && { messageId }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST new comment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, updateId, photoId, outfitId, messageId } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (!updateId && !photoId && !outfitId && !messageId) {
      return NextResponse.json(
        { error: 'At least one item ID is required' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        ...(updateId && { updateId }),
        ...(photoId && { photoId }),
        ...(outfitId && { outfitId }),
        ...(messageId && { messageId }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
