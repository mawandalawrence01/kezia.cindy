import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteAudioFromCloudinary, uploadAudioToCloudinary } from '@/lib/cloudinary'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the story to access the publicId
    const story = await prisma.story.findUnique({
      where: { id }
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    // Delete audio from Cloudinary if publicId exists
    if (story.publicId) {
      try {
        await deleteAudioFromCloudinary(story.publicId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete the story
    await prisma.story.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { error: 'Failed to delete story' },
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
    const destinationId = formData.get('destinationId') as string;
    const duration = formData.get('duration') as string;
    const transcript = formData.get('transcript') as string;
    const audioFile = formData.get('audio') as File;

    // Get existing story
    const existingStory = await prisma.story.findUnique({
      where: { id }
    });

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    // Get destination name if destination changed
    let destinationName = existingStory.destinationName;
    if (destinationId !== existingStory.destinationId) {
      const destination = await prisma.destination.findUnique({
        where: { id: destinationId },
        select: { name: true }
      });

      if (!destination) {
        return NextResponse.json(
          { error: 'Destination not found' },
          { status: 404 }
        );
      }

      destinationName = destination.name;
    }

    let audioUrl = existingStory.audioUrl;
    let publicId = existingStory.publicId;

    // Handle new audio upload
    if (audioFile && audioFile.size > 0) {
      try {
        console.log('Processing audio file:', {
          name: audioFile.name,
          size: audioFile.size,
          type: audioFile.type
        });

        // Delete old audio if it exists
        if (publicId) {
          console.log('Deleting old audio:', publicId);
          await deleteAudioFromCloudinary(publicId);
        }

        // Upload new audio
        console.log('Uploading new audio file...');
        const uploadResult = await uploadAudioToCloudinary(audioFile, 'the_queen/stories');
        audioUrl = uploadResult.secure_url;
        publicId = uploadResult.public_id;
        console.log('Audio upload successful:', { audioUrl, publicId });
      } catch (uploadError) {
        console.error('Error uploading new audio:', uploadError);
        return NextResponse.json(
          { 
            error: 'Failed to upload new audio',
            details: uploadError instanceof Error ? uploadError.message : 'Unknown error'
          },
          { status: 500 }
        );
      }
    }

    // Update story in database
    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        title,
        destinationName,
        duration,
        audioUrl,
        publicId,
        transcript,
        destinationId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    );
  }
}
