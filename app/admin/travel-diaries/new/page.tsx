"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Save, 
  ArrowLeft, 
  Upload,
  X,
  Loader2,
  MapPin,
  Calendar,
  Star,
  Plus
} from "lucide-react";

export default function NewTravelDiaryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    content: "",
    rating: 5,
    date: new Date().toISOString().split('T')[0],
    highlights: [""]
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      // Create previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, ""]
    }));
  };

  const updateHighlight = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((highlight, i) => i === index ? value : highlight)
    }));
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('location', formData.location);
      submitData.append('content', formData.content);
      submitData.append('rating', formData.rating.toString());
      submitData.append('date', formData.date);
      submitData.append('highlights', JSON.stringify(formData.highlights.filter(h => h.trim())));
      
      imageFiles.forEach((file, index) => {
        submitData.append(`image_${index}`, file);
      });

      const response = await fetch('/api/admin/travel-diaries', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        router.push('/admin/travel-diaries');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating travel diary:', error);
      alert('Failed to create travel diary');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-foreground">Create New Travel Diary</h1>
          <p className="text-muted-foreground mt-2">
            Document your travel experiences and adventures
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
          {/* Images Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Images
            </label>
            {previews.length === 0 ? (
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-uganda-gold transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  multiple
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-uganda-red text-white rounded-full hover:bg-uganda-red/80 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center hover:border-uganda-gold transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="add-more-images"
                    multiple
                  />
                  <label
                    htmlFor="add-more-images"
                    className="cursor-pointer flex flex-col items-center space-y-2 h-full justify-center"
                  >
                    <Plus className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add More</span>
                  </label>
                </div>
              </div>
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
              placeholder="Enter travel diary title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium text-foreground">
                Location *
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
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium text-foreground">
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label htmlFor="rating" className="text-sm font-medium text-foreground">
              Rating *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`p-1 ${
                    star <= formData.rating 
                      ? 'text-uganda-gold' 
                      : 'text-muted-foreground hover:text-uganda-gold'
                  } transition-colors`}
                >
                  <Star className={`h-6 w-6 ${star <= formData.rating ? 'fill-current' : ''}`} />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {formData.rating} star{formData.rating !== 1 ? 's' : ''}
              </span>
            </div>
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
              placeholder="Write about your travel experience..."
              required
            />
          </div>

          {/* Highlights */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Highlights
            </label>
            <div className="space-y-2">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                    placeholder="Enter a highlight"
                  />
                  {formData.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="p-2 text-uganda-red hover:bg-uganda-red/10 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addHighlight}
                className="flex items-center space-x-2 text-uganda-gold hover:text-warm-gold transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Highlight</span>
              </button>
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
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create Diary</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
