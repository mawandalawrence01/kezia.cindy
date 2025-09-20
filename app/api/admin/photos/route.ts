import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const imageFile = formData.get('image') as File;

    // Validate required fields
    if (!title || !description || !category || !imageFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    let imageUrl = '';
    let publicId = '';
    
    try {
      const uploadResult = await uploadImageToCloudinary(imageFile);
      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    } catch (uploadError) {
      console.error('Error uploading image:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Create photo in database
    const photo = await prisma.photo.create({
      data: {
        title,
        description,
        category: category as 'NATURE' | 'CULTURE' | 'FASHION' | 'EVENTS',
        location: location || null,
        image: imageUrl,
        publicId,
        date: new Date(),
      },
      include: {
        votes: true,
        comments: true,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Failed to create photo' },
      { status: 500 }
    );
  }
}
