import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const update = await prisma.update.findUnique({
      where: { id },
      include: {
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
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!update) {
      return NextResponse.json(
        { error: 'Update not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error fetching update:', error);
    return NextResponse.json(
      { error: 'Failed to fetch update' },
      { status: 500 }
    );
  }
}
