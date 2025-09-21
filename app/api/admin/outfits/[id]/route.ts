import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteImageFromCloudinary, updateImageInCloudinary } from '@/lib/cloudinary'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the outfit to access the publicId
    const outfit = await prisma.outfit.findUnique({
      where: { id }
    });

    if (!outfit) {
      return NextResponse.json(
        { error: 'Outfit not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if publicId exists
    if (outfit.publicId) {
      try {
        await deleteImageFromCloudinary(outfit.publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete related records first
    await prisma.vote.deleteMany({
      where: { outfitId: id }
    });

    await prisma.comment.deleteMany({
      where: { outfitId: id }
    });

    // Delete the outfit
    await prisma.outfit.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting outfit:', error);
    return NextResponse.json(
      { error: 'Failed to delete outfit' },
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
    const designer = formData.get('designer') as string;
    const occasion = formData.get('occasion') as string;
    const culturalSignificance = formData.get('culturalSignificance') as string;
    const location = formData.get('location') as string;
    const tags = formData.get('tags') as string;
    const imageFile = formData.get('image') as File | null;

    // Get existing outfit
    const existingOutfit = await prisma.outfit.findUnique({
      where: { id }
    });

    if (!existingOutfit) {
      return NextResponse.json(
        { error: 'Outfit not found' },
        { status: 404 }
      );
    }

    let imageUrl = existingOutfit.image;
    let publicId = existingOutfit.publicId;

    // Handle image update if new image is provided
    if (imageFile && imageFile.size > 0) {
      try {
        const uploadResult = await updateImageInCloudinary(
          existingOutfit.publicId || '',
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

    // Parse tags
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

    // Update outfit in database
    const updatedOutfit = await prisma.outfit.update({
      where: { id },
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
        updatedAt: new Date(),
      },
      include: {
        votes: true,
        comments: true,
      },
    });

    return NextResponse.json(updatedOutfit);
  } catch (error) {
    console.error('Error updating outfit:', error);
    return NextResponse.json(
      { error: 'Failed to update outfit' },
      { status: 500 }
    );
  }
}
