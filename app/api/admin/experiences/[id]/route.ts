import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if experience exists
    const experience = await prisma.experience.findUnique({
      where: { id }
    });

    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    // Delete the experience
    await prisma.experience.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { title, description, category, duration, participants, rating } = body;

    // Get existing experience
    const existingExperience = await prisma.experience.findUnique({
      where: { id }
    });

    if (!existingExperience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    // Update experience in database
    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: {
        title,
        description,
        category,
        duration,
        participants: parseInt(participants),
        rating: parseInt(rating),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedExperience);
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}
