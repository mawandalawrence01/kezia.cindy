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
  Tag
} from "lucide-react";

interface Outfit {
  id: string;
  title: string;
  description: string;
  image: string;
  publicId?: string;
  category: string;
  designer: string;
  occasion: string;
  culturalSignificance: string;
  tags: string[];
  location?: string;
  date: string;
}

export default function EditOutfitPage() {
  const router = useRouter();
  const params = useParams();
  const outfitId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "TRADITIONAL",
    designer: "",
    occasion: "",
    culturalSignificance: "",
    location: "",
    tags: "",
  });

  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        const response = await fetch(`/api/outfits/${outfitId}`);
        if (response.ok) {
          const outfitData = await response.json();
          setOutfit(outfitData);
          setFormData({
            title: outfitData.title,
            description: outfitData.description,
            category: outfitData.category,
            designer: outfitData.designer,
            occasion: outfitData.occasion,
            culturalSignificance: outfitData.culturalSignificance,
            location: outfitData.location || "",
            tags: outfitData.tags.join(", "),
          });
          setPreview(outfitData.image);
        } else {
          router.push('/admin/outfits');
        }
      } catch (error) {
        console.error('Error fetching outfit:', error);
        router.push('/admin/outfits');
      } finally {
        setFetching(false);
      }
    };

    if (outfitId) {
      fetchOutfit();
    }
  }, [outfitId, router]);

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
    setPreview(outfit?.image || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('designer', formData.designer);
      submitData.append('occasion', formData.occasion);
      submitData.append('culturalSignificance', formData.culturalSignificance);
      submitData.append('location', formData.location);
      submitData.append('tags', formData.tags);
      
      if (newImage) {
        submitData.append('image', newImage);
      }

      const response = await fetch(`/api/admin/outfits/${outfitId}`, {
        method: 'PUT',
        body: submitData,
      });

      if (response.ok) {
        router.push('/admin/outfits');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating outfit:', error);
      alert('Failed to update outfit');
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

  if (!outfit) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-foreground mb-2">Outfit not found</h3>
        <p className="text-muted-foreground mb-4">The outfit you&apos;re looking for doesn&apos;t exist.</p>
        <button
          onClick={() => router.push('/admin/outfits')}
          className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          Back to Outfits
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
          <h1 className="text-3xl font-bold text-foreground">Edit Outfit</h1>
          <p className="text-muted-foreground mt-2">
            Update outfit details and image
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
              Outfit Image
            </label>
            <div className="relative">
              {preview && !newImage && outfit.publicId ? (
                <CldImage
                  src={outfit.publicId}
                  alt="Current outfit"
                  width={400}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg"
                  crop="fill"
                  gravity="auto"
                />
              ) : (
                <img
                  src={preview || outfit.image}
                  alt="Current outfit"
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
              placeholder="Enter outfit title"
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
              placeholder="Enter outfit description"
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
              <option value="TRADITIONAL">Traditional</option>
              <option value="MODERN">Modern</option>
              <option value="FORMAL">Formal</option>
              <option value="CASUAL">Casual</option>
              <option value="CULTURAL">Cultural</option>
            </select>
          </div>

          {/* Designer */}
          <div className="space-y-2">
            <label htmlFor="designer" className="text-sm font-medium text-foreground">
              Designer *
            </label>
            <input
              type="text"
              id="designer"
              value={formData.designer}
              onChange={(e) => setFormData({ ...formData, designer: e.target.value })}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="Enter designer name"
              required
            />
          </div>

          {/* Occasion */}
          <div className="space-y-2">
            <label htmlFor="occasion" className="text-sm font-medium text-foreground">
              Occasion *
            </label>
            <input
              type="text"
              id="occasion"
              value={formData.occasion}
              onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="Enter occasion (e.g., Wedding, Festival, etc.)"
              required
            />
          </div>

          {/* Cultural Significance */}
          <div className="space-y-2">
            <label htmlFor="culturalSignificance" className="text-sm font-medium text-foreground">
              Cultural Significance *
            </label>
            <textarea
              id="culturalSignificance"
              value={formData.culturalSignificance}
              onChange={(e) => setFormData({ ...formData, culturalSignificance: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="Describe the cultural significance of this outfit"
              required
            />
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
              placeholder="Enter location (optional)"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium text-foreground">
              Tags
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                placeholder="Enter tags separated by commas (e.g., traditional, wedding, silk)"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Separate multiple tags with commas
            </p>
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
