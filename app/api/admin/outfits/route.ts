import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const designer = formData.get('designer') as string;
    const occasion = formData.get('occasion') as string;
    const culturalSignificance = formData.get('culturalSignificance') as string;
    const location = formData.get('location') as string;
    const tags = formData.get('tags') as string;
    const imageFile = formData.get('image') as File;

    // Validate required fields
    if (!title || !description || !category || !designer || !occasion || !culturalSignificance || !imageFile) {
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

    // Parse tags
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

    // Create outfit in database
    const outfit = await prisma.outfit.create({
      data: {
        title,
        description,
        category: category as 'TRADITIONAL' | 'MODERN' | 'FORMAL' | 'CASUAL' | 'CULTURAL',
        designer,
        occasion,
        culturalSignificance,
        location: location || null,
        tags: tagsArray,
        image: imageUrl,
        publicId,
        date: new Date(),
      },
      include: {
        votes: true,
        comments: true,
      },
    });

    return NextResponse.json(outfit, { status: 201 });
  } catch (error) {
    console.error('Error creating outfit:', error);
    return NextResponse.json(
      { error: 'Failed to create outfit' },
      { status: 500 }
    );
  }
}
