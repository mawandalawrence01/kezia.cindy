import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteImageFromCloudinary, updateImageInCloudinary } from '@/lib/cloudinary'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the photo to access the publicId
    const photo = await prisma.photo.findUnique({
      where: { id }
    });

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if publicId exists
    if (photo.publicId) {
      try {
        await deleteImageFromCloudinary(photo.publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete related records first
    await prisma.vote.deleteMany({
      where: { photoId: id }
    });

    await prisma.comment.deleteMany({
      where: { photoId: id }
    });

    // Delete the photo
    await prisma.photo.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
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
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const imageFile = formData.get('image') as File | null;

    // Get existing photo
    const existingPhoto = await prisma.photo.findUnique({
      where: { id }
    });

    if (!existingPhoto) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    let imageUrl = existingPhoto.image;
    let publicId = existingPhoto.publicId;

    // Handle image update if new image is provided
    if (imageFile && imageFile.size > 0) {
      try {
        const uploadResult = await updateImageInCloudinary(
          existingPhoto.publicId || '',
          imageFile
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

    // Update photo in database
    const updatedPhoto = await prisma.photo.update({
      where: { id },
      data: {
        title,
        description,
        category: category as 'NATURE' | 'CULTURE' | 'FASHION' | 'EVENTS',
        location: location || null,
        image: imageUrl,
        publicId,
        updatedAt: new Date(),
      },
      include: {
        votes: true,
        comments: true,
      },
    });

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    );
  }
}
