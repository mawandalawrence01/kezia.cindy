import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, type, location, image, publishedAt } = body;

    const update = await prisma.update.create({
      data: {
        title,
        content,
        type: type as 'UPDATE' | 'TRAVEL' | 'EXPERIENCE',
        location,
        image,
        publishedAt: new Date(publishedAt),
      },
    });

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json(
      { error: 'Failed to create update' },
      { status: 500 }
    );
  }
}
