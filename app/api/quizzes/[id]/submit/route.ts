import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST quiz submission and scoring
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { answers } = body; // Array of { questionId: string, answer: number }

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers are required' },
        { status: 400 }
      );
    }

    // Get quiz questions with correct answers
    const questions = await prisma.quizQuestion.findMany({
      where: { quizId: id },
      select: {
        id: true,
        correctAnswer: true,
        explanation: true,
      },
    });

    // Calculate score
    let correctAnswers = 0;
    const results = answers.map((answer: { questionId: string; answer: number }) => {
      const question = questions.find(q => q.id === answer.questionId);
      const isCorrect = question && question.correctAnswer === answer.answer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionId: answer.questionId,
        userAnswer: answer.answer,
        correctAnswer: question?.correctAnswer,
        isCorrect,
        explanation: question?.explanation,
      };
    });

    const score = Math.round((correctAnswers / questions.length) * 100);

    // Save or update quiz score
    await prisma.quizScore.upsert({
      where: {
        userId_quizId: {
          userId: session.user.id,
          quizId: id,
        },
      },
      update: {
        score,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        quizId: id,
        score,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      score,
      correctAnswers,
      totalQuestions: questions.length,
      results,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}

