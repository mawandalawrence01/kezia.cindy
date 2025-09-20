"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { 
  Save, 
  ArrowLeft, 
  X,
  Loader2,
  Upload
} from "lucide-react";

interface Photo {
  id: string;
  title: string;
  description: string;
  image: string;
  publicId?: string;
  category: string;
  location?: string;
  date: string;
}

export default function EditPhotoPage() {
  const router = useRouter();
  const params = useParams();
  const photoId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "NATURE",
    location: "",
  });

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(`/api/photos/${photoId}`);
        if (response.ok) {
          const photoData = await response.json();
          setPhoto(photoData);
          setFormData({
            title: photoData.title,
            description: photoData.description,
            category: photoData.category,
            location: photoData.location || "",
          });
          setPreview(photoData.image);
        } else {
          router.push('/admin/photos');
        }
      } catch (error) {
        console.error('Error fetching photo:', error);
        router.push('/admin/photos');
      } finally {
        setFetching(false);
      }
    };

    if (photoId) {
      fetchPhoto();
    }
  }, [photoId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeNewImage = () => {
    setNewImage(null);
    setPreview(photo?.image || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('location', formData.location);
      
      if (newImage) {
        submitData.append('image', newImage);
      }

      const response = await fetch(`/api/admin/photos/${photoId}`, {
        method: 'PUT',
        body: submitData,
      });

      if (response.ok) {
        router.push('/admin/photos');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating photo:', error);
      alert('Failed to update photo');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold"></div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-foreground mb-2">Photo not found</h3>
        <p className="text-muted-foreground mb-4">The photo you&apos;re looking for doesn&apos;t exist.</p>
        <button
          onClick={() => router.push('/admin/photos')}
          className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          Back to Photos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Photo</h1>
          <p className="text-muted-foreground mt-2">
            Update photo details and image
          </p>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background rounded-xl p-6 shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Photo
            </label>
            <div className="relative">
              {preview && !newImage && photo.publicId ? (
                <CldImage
                  src={photo.publicId}
                  alt="Current photo"
                  width={400}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg"
                  crop="fill"
                  gravity="auto"
                />
              ) : (
                <img
                  src={preview || photo.image}
                  alt="Current photo"
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div className="absolute top-2 right-2 flex space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="p-2 bg-uganda-gold text-uganda-black rounded-full hover:bg-warm-gold transition-colors cursor-pointer"
                  title="Change image"
                >
                  <Upload className="h-4 w-4" />
                </label>
                {newImage && (
                  <button
                    type="button"
                    onClick={removeNewImage}
                    className="p-2 bg-uganda-red text-white rounded-full hover:bg-uganda-red/80 transition-colors"
                    title="Remove new image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            {newImage && (
              <p className="text-sm text-uganda-gold">
                New image selected: {newImage.name}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="Enter photo title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="Enter photo description"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-foreground">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              required
            >
              <option value="NATURE">Nature</option>
              <option value="CULTURE">Culture</option>
              <option value="FASHION">Fashion</option>
              <option value="EVENTS">Events</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-foreground">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="Enter photo location (optional)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-6 py-2 rounded-lg font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
