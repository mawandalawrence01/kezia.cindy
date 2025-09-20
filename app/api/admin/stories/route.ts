import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadAudioToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const destinationId = formData.get('destinationId') as string;
    const duration = formData.get('duration') as string;
    const transcript = formData.get('transcript') as string;
    const audioFile = formData.get('audio') as File;

    // Validate required fields
    if (!title || !destinationId || !duration || !transcript) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get destination name
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

    let audioUrl: string | undefined;
    let publicId: string | undefined;

    // Upload audio to Cloudinary if provided
    if (audioFile && audioFile.size > 0) {
      try {
        console.log('Processing audio file:', {
          name: audioFile.name,
          size: audioFile.size,
          type: audioFile.type
        });

        console.log('Uploading audio file...');
        const uploadResult = await uploadAudioToCloudinary(audioFile, 'the_queen/stories');
        audioUrl = uploadResult.secure_url;
        publicId = uploadResult.public_id;
        console.log('Audio upload successful:', { audioUrl, publicId });
      } catch (uploadError) {
        console.error('Error uploading audio:', uploadError);
        return NextResponse.json(
          { 
            error: 'Failed to upload audio file',
            details: uploadError instanceof Error ? uploadError.message : 'Unknown error'
          },
          { status: 500 }
        );
      }
    }

    // Create story in database
    const story = await prisma.story.create({
      data: {
        title,
        destinationName: destination.name,
        duration,
        audioUrl,
        publicId,
        transcript,
        destinationId,
      },
    });

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    );
  }
}
