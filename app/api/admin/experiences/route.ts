import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, duration, participants, rating } = body;

    // Validate required fields
    if (!title || !description || !category || !duration || !participants || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create experience in database
    const experience = await prisma.experience.create({
      data: {
        title,
        description,
        category,
        duration,
        participants: parseInt(participants),
        rating: parseInt(rating),
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}
