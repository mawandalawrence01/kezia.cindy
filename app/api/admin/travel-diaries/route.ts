import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const content = formData.get('content') as string;
    const rating = parseInt(formData.get('rating') as string);
    const date = formData.get('date') as string;
    const highlightsJson = formData.get('highlights') as string;

    // Validate required fields
    if (!title || !location || !content || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse highlights
    const highlights = JSON.parse(highlightsJson || '[]');

    // Upload images to Cloudinary
    const images: string[] = [];
    const publicIds: string[] = [];
    
    // Get all image files from form data
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        imageFiles.push(value);
      }
    }

    // Upload each image
    for (const imageFile of imageFiles) {
      try {
        const uploadResult = await uploadImageToCloudinary(imageFile, 'the_queen/travel-diaries');
        images.push(uploadResult.secure_url);
        publicIds.push(uploadResult.public_id);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Create travel diary in database
    const travelDiary = await prisma.travelDiary.create({
      data: {
        title,
        location,
        content,
        images,
        publicIds,
        highlights,
        rating,
        date: new Date(date),
      },
    });

    return NextResponse.json(travelDiary, { status: 201 });
  } catch (error) {
    console.error('Error creating travel diary:', error);
    return NextResponse.json(
      { error: 'Failed to create travel diary' },
      { status: 500 }
    );
  }
}
