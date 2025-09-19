import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete related records first
    await prisma.like.deleteMany({
      where: { updateId: id }
    });

    await prisma.comment.deleteMany({
      where: { updateId: id }
    });

    // Delete the update
    await prisma.update.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting update:', error);
    return NextResponse.json(
      { error: 'Failed to delete update' },
      { status: 500 }
    );
  }
}
