import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET quiz questions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const questions = await prisma.quizQuestion.findMany({
      where: { quizId: id },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        question: true,
        options: true,
        order: true,
        // Don't include correctAnswer or explanation in the response
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz questions' },
      { status: 500 }
    );
  }
}

