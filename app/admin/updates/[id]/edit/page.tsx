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
  Upload,
  MapPin,
  Calendar
} from "lucide-react";

interface Update {
  id: string;
  title: string;
  content: string;
  type: string;
  location?: string;
  image?: string;
  publicId?: string;
  publishedAt: string;
}

export default function EditUpdatePage() {
  const router = useRouter();
  const params = useParams();
  const updateId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [update, setUpdate] = useState<Update | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "UPDATE",
    location: "",
    publishedAt: "",
  });

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const response = await fetch(`/api/updates/${updateId}`);
        if (response.ok) {
          const updateData = await response.json();
          setUpdate(updateData);
          setFormData({
            title: updateData.title,
            content: updateData.content,
            type: updateData.type,
            location: updateData.location || "",
            publishedAt: new Date(updateData.publishedAt).toISOString().split('T')[0],
          });
          setPreview(updateData.image);
        } else {
          router.push('/admin/updates');
        }
      } catch (error) {
        console.error('Error fetching update:', error);
        router.push('/admin/updates');
      } finally {
        setFetching(false);
      }
    };

    if (updateId) {
      fetchUpdate();
    }
  }, [updateId, router]);

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
    setPreview(update?.image || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('type', formData.type);
      submitData.append('location', formData.location);
      submitData.append('publishedAt', formData.publishedAt);
      
      if (newImage) {
        submitData.append('image', newImage);
      }

      const response = await fetch(`/api/admin/updates/${updateId}`, {
        method: 'PUT',
        body: submitData,
      });

      if (response.ok) {
        router.push('/admin/updates');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating update:', error);
      alert('Failed to update update');
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

  if (!update) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-foreground mb-2">Update not found</h3>
        <p className="text-muted-foreground mb-4">The update you&apos;re looking for doesn&apos;t exist.</p>
        <button
          onClick={() => router.push('/admin/updates')}
          className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          Back to Updates
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
          <h1 className="text-3xl font-bold text-foreground">Edit Update</h1>
          <p className="text-muted-foreground mt-2">
            Update content and image
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
          {preview && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Image
              </label>
              <div className="relative">
                {preview && !newImage && update.publicId ? (
                  <CldImage
                    src={update.publicId}
                    alt="Current image"
                    width={400}
                    height={256}
                    className="w-full h-64 object-cover rounded-lg"
                    crop="fill"
                    gravity="auto"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Current image"
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
          )}

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
              placeholder="Enter update title"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-foreground">
              Content *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="Write your update content here..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Type */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-foreground">
                Type *
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                required
              >
                <option value="UPDATE">Update</option>
                <option value="TRAVEL">Travel</option>
                <option value="EXPERIENCE">Experience</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium text-foreground">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                  placeholder="Enter location"
                />
              </div>
            </div>

            {/* Published Date */}
            <div className="space-y-2">
              <label htmlFor="publishedAt" className="text-sm font-medium text-foreground">
                Publish Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  id="publishedAt"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                  required
                />
              </div>
            </div>
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
