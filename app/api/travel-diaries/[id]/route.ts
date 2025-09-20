import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const travelDiary = await prisma.travelDiary.findUnique({
      where: { id },
    });

    if (!travelDiary) {
      return NextResponse.json(
        { error: 'Travel diary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(travelDiary);
  } catch (error) {
    console.error('Error fetching travel diary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch travel diary' },
      { status: 500 }
    );
  }
}
