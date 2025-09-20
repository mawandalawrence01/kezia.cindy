import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
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

    // Validate required fields
    if (!name || !region || !type || !description || !bestTime || !duration || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse highlights and coordinates
    const highlights = JSON.parse(highlightsJson || '[]');
    const coordinates = JSON.parse(coordinatesJson || '{}');

    let imageUrl: string | undefined;
    let publicId: string | undefined;

    // Upload image to Cloudinary if provided
    if (imageFile && imageFile.size > 0) {
      try {
        const uploadResult = await uploadImageToCloudinary(imageFile, 'the_queen/destinations');
        imageUrl = uploadResult.secure_url;
        publicId = uploadResult.public_id;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Create destination in database
    const destination = await prisma.destination.create({
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
      },
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json(
      { error: 'Failed to create destination' },
      { status: 500 }
    );
  }
}
