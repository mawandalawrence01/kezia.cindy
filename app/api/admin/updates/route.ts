import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const type = formData.get('type') as string;
    const location = formData.get('location') as string;
    const publishedAt = formData.get('publishedAt') as string;
    const imageFile = formData.get('image') as File | null;

    // Validate required fields
    if (!title || !content || !type || !publishedAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary if provided
    let imageUrl = '';
    let publicId = '';
    
    if (imageFile && imageFile.size > 0) {
      try {
        const uploadResult = await uploadImageToCloudinary(imageFile, 'the_queen/updates');
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

    // Create update in database
    const update = await prisma.update.create({
      data: {
        title,
        content,
        type: type as 'UPDATE' | 'TRAVEL' | 'EXPERIENCE',
        location: location || null,
        image: imageUrl || null,
        publicId: publicId || null,
        publishedAt: new Date(publishedAt),
      },
      include: {
        likes: true,
        comments: true,
      },
    });

    return NextResponse.json(update, { status: 201 });
  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json(
      { error: 'Failed to create update' },
      { status: 500 }
    );
  }
}
