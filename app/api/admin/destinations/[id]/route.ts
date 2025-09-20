import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteImageFromCloudinary, uploadImageToCloudinary } from '@/lib/cloudinary'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the destination to access the publicId
    const destination = await prisma.destination.findUnique({
      where: { id }
    });

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if publicId exists
    if (destination.publicId) {
      try {
        await deleteImageFromCloudinary(destination.publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete the destination
    await prisma.destination.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return NextResponse.json(
      { error: 'Failed to delete destination' },
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
    
    const name = formData.get('name') as string;
    const region = formData.get('region') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const bestTime = formData.get('bestTime') as string;
    const duration = formData.get('duration') as string;
    const difficulty = formData.get('difficulty') as string;
    const rating = parseFloat(formData.get('rating') as string);
    const hasAudio = formData.get('hasAudio') === 'true';
    const has360 = formData.get('has360') === 'true';
    const highlightsJson = formData.get('highlights') as string;
    const coordinatesJson = formData.get('coordinates') as string;
    const imageFile = formData.get('image') as File;

    // Get existing destination
    const existingDestination = await prisma.destination.findUnique({
      where: { id }
    });

    if (!existingDestination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    // Parse highlights and coordinates
    const highlights = JSON.parse(highlightsJson || '[]');
    const coordinates = JSON.parse(coordinatesJson || '{}');

    let imageUrl = existingDestination.image;
    let publicId = existingDestination.publicId;

    // Handle new image upload
    if (imageFile && imageFile.size > 0) {
      try {
        // Delete old image if it exists
        if (publicId) {
          await deleteImageFromCloudinary(publicId);
        }

        // Upload new image
        const uploadResult = await uploadImageToCloudinary(imageFile, 'the_queen/destinations');
        imageUrl = uploadResult.secure_url;
        publicId = uploadResult.public_id;
      } catch (uploadError) {
        console.error('Error uploading new image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload new image' },
          { status: 500 }
        );
      }
    }

    // Update destination in database
    const updatedDestination = await prisma.destination.update({
      where: { id },
      data: {
        name,
        region,
        type: type as 'NATIONAL_PARK' | 'WATERFALL' | 'LAKE' | 'CITY' | 'CULTURAL_SITE',
        description,
        highlights,
        bestTime,
        duration,
        difficulty: difficulty as 'EASY' | 'MEDIUM' | 'HARD',
        rating,
        coordinates,
        hasAudio,
        has360,
        image: imageUrl,
        publicId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedDestination);
  } catch (error) {
    console.error('Error updating destination:', error);
    return NextResponse.json(
      { error: 'Failed to update destination' },
      { status: 500 }
    );
  }
}
