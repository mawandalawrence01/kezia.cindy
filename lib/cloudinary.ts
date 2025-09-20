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
