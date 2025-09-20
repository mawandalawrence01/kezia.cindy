import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteImageFromCloudinary, updateImageInCloudinary } from '@/lib/cloudinary'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the update to access the publicId
    const update = await prisma.update.findUnique({
      where: { id }
    });

    if (!update) {
      return NextResponse.json(
        { error: 'Update not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if publicId exists
    if (update.publicId) {
      try {
        await deleteImageFromCloudinary(update.publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const type = formData.get('type') as string;
    const location = formData.get('location') as string;
    const publishedAt = formData.get('publishedAt') as string;
    const imageFile = formData.get('image') as File | null;

    // Get existing update
    const existingUpdate = await prisma.update.findUnique({
      where: { id }
    });

    if (!existingUpdate) {
      return NextResponse.json(
        { error: 'Update not found' },
        { status: 404 }
      );
    }

    let imageUrl = existingUpdate.image;
    let publicId = existingUpdate.publicId;

    // Handle image update if new image is provided
    if (imageFile && imageFile.size > 0) {
      try {
        const uploadResult = await updateImageInCloudinary(
          existingUpdate.publicId || '',
          imageFile,
          'the_queen/updates'
        );
        imageUrl = uploadResult.secure_url;
        publicId = uploadResult.public_id;
      } catch (uploadError) {
        console.error('Error updating image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to update image' },
          { status: 500 }
        );
      }
    }

    // Update update in database
    const updatedUpdate = await prisma.update.update({
      where: { id },
      data: {
        title,
        content,
        type: type as 'UPDATE' | 'TRAVEL' | 'EXPERIENCE',
        location: location || null,
        image: imageUrl,
        publicId,
        publishedAt: new Date(publishedAt),
        updatedAt: new Date(),
      },
      include: {
        likes: true,
        comments: true,
      },
    });

    return NextResponse.json(updatedUpdate);
  } catch (error) {
    console.error('Error updating update:', error);
    return NextResponse.json(
      { error: 'Failed to update update' },
      { status: 500 }
    );
  }
}
