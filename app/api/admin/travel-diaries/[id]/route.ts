import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteImageFromCloudinary, uploadImageToCloudinary } from '@/lib/cloudinary'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the travel diary to access the publicIds
    const travelDiary = await prisma.travelDiary.findUnique({
      where: { id }
    });

    if (!travelDiary) {
      return NextResponse.json(
        { error: 'Travel diary not found' },
        { status: 404 }
      );
    }

    // Delete images from Cloudinary if publicIds exist
    if (travelDiary.publicIds && travelDiary.publicIds.length > 0) {
      try {
        await Promise.all(
          travelDiary.publicIds.map(publicId => 
            deleteImageFromCloudinary(publicId)
          )
        );
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete the travel diary
    await prisma.travelDiary.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting travel diary:', error);
    return NextResponse.json(
      { error: 'Failed to delete travel diary' },
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
    const location = formData.get('location') as string;
    const content = formData.get('content') as string;
    const rating = parseInt(formData.get('rating') as string);
    const date = formData.get('date') as string;
    const highlightsJson = formData.get('highlights') as string;

    // Get existing travel diary
    const existingDiary = await prisma.travelDiary.findUnique({
      where: { id }
    });

    if (!existingDiary) {
      return NextResponse.json(
        { error: 'Travel diary not found' },
        { status: 404 }
      );
    }

    // Parse highlights
    const highlights = JSON.parse(highlightsJson || '[]');

    let images = [...existingDiary.images];
    let publicIds = [...(existingDiary.publicIds || [])];

    // Handle new image uploads
    const newImageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        newImageFiles.push(value);
      }
    }

    // Upload new images if any
    if (newImageFiles.length > 0) {
      try {
        const newImages: string[] = [];
        const newPublicIds: string[] = [];
        
        for (const imageFile of newImageFiles) {
          const uploadResult = await uploadImageToCloudinary(imageFile, 'the_queen/travel-diaries');
          newImages.push(uploadResult.secure_url);
          newPublicIds.push(uploadResult.public_id);
        }
        
        images = [...images, ...newImages];
        publicIds = [...publicIds, ...newPublicIds];
      } catch (uploadError) {
        console.error('Error uploading new images:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload new images' },
          { status: 500 }
        );
      }
    }

    // Update travel diary in database
    const updatedDiary = await prisma.travelDiary.update({
      where: { id },
      data: {
        title,
        location,
        content,
        images,
        publicIds,
        highlights,
        rating,
        date: new Date(date),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedDiary);
  } catch (error) {
    console.error('Error updating travel diary:', error);
    return NextResponse.json(
      { error: 'Failed to update travel diary' },
      { status: 500 }
    );
  }
}
