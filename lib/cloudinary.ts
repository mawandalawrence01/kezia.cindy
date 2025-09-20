import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Utility function to upload image to Cloudinary
export async function uploadImageToCloudinary(
  file: File,
  folder: string = 'the_queen/photos'
): Promise<{ public_id: string; secure_url: string }> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          upload_preset: 'the_queen',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
            });
          } else {
            reject(new Error('Upload failed'));
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    throw new Error(`Failed to upload image: ${error}`);
  }
}

// Utility function to delete image from Cloudinary
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Failed to delete image: ${error}`);
  }
}

// Utility function to update image in Cloudinary
export async function updateImageInCloudinary(
  oldPublicId: string,
  newFile: File,
  folder: string = 'the_queen/photos'
): Promise<{ public_id: string; secure_url: string }> {
  try {
    // Delete old image
    if (oldPublicId) {
      await deleteImageFromCloudinary(oldPublicId);
    }
    
    // Upload new image
    return await uploadImageToCloudinary(newFile, folder);
  } catch (error) {
    throw new Error(`Failed to update image: ${error}`);
  }
}

// Utility function to upload audio to Cloudinary
export async function uploadAudioToCloudinary(
  file: File,
  folder: string = 'the_queen/stories'
): Promise<{ public_id: string; secure_url: string }> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine resource type based on file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let resourceType: 'image' | 'auto' | 'video' | 'raw' = 'auto'; // Let Cloudinary auto-detect
    
    // For audio files, we can use 'auto' or 'raw' depending on the format
    if (['mp3', 'wav', 'aac', 'ogg', 'm4a', 'flac'].includes(fileExtension || '')) {
      resourceType = 'auto'; // Let Cloudinary handle it automatically
    }

    console.log(`Uploading audio file: ${file.name}, size: ${file.size}, type: ${file.type}, resource_type: ${resourceType}`);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          format: fileExtension, // Specify format explicitly
          quality: 'auto',
          // Try without upload_preset first, as it might be causing issues
          // upload_preset: 'the_queen',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else if (result) {
            console.log('Upload successful:', result.public_id);
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
            });
          } else {
            reject(new Error('Upload failed - no result returned'));
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    throw new Error(`Failed to upload audio: ${error}`);
  }
}

// Utility function to delete audio from Cloudinary
export async function deleteAudioFromCloudinary(publicId: string): Promise<void> {
  try {
    console.log(`Deleting audio from Cloudinary: ${publicId}`);
    // Try different resource types to find and delete the file
    const resourceTypes = ['auto', 'video', 'raw'];
    
    for (const resourceType of resourceTypes) {
      try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        if (result.result === 'ok') {
          console.log(`Delete successful with resource_type: ${resourceType}`, result);
          return;
        }
      } catch (deleteError) {
        console.log(`Failed to delete with resource_type ${resourceType}:`, deleteError instanceof Error ? deleteError.message : 'Unknown error');
        continue;
      }
    }
    
    console.log('Could not delete file with any resource type');
  } catch (error) {
    console.error('Error deleting audio from Cloudinary:', error);
    throw new Error(`Failed to delete audio: ${error}`);
  }
}
