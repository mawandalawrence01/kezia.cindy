"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Save, 
  ArrowLeft, 
  Upload,
  X,
  Loader2,
  MapPin,
  Clock,
  Star,
  Plus
} from "lucide-react";

interface Destination {
  id: string;
  name: string;
  region: string;
  type: string;
  description: string;
  highlights: string[];
  bestTime: string;
  duration: string;
  difficulty: string;
  rating: number;
  hasAudio: boolean;
  has360: boolean;
  image?: string;
  publicId?: string;
  coordinates: { x: number; y: number };
}

export default function EditDestinationPage() {
  const router = useRouter();
  const params = useParams();
  const destinationId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    type: "NATIONAL_PARK",
    description: "",
    bestTime: "",
    duration: "",
    difficulty: "EASY",
    rating: 0,
    hasAudio: false,
    has360: false,
    highlights: [""],
    coordinates: { x: "", y: "" }
  });

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations/${destinationId}`);
        if (response.ok) {
          const destinationData = await response.json();
          setDestination(destinationData);
          setFormData({
            name: destinationData.name,
            region: destinationData.region,
            type: destinationData.type,
            description: destinationData.description,
            bestTime: destinationData.bestTime,
            duration: destinationData.duration,
            difficulty: destinationData.difficulty,
            rating: destinationData.rating,
            hasAudio: destinationData.hasAudio,
            has360: destinationData.has360,
            highlights: destinationData.highlights.length > 0 ? destinationData.highlights : [""],
            coordinates: {
              x: destinationData.coordinates?.x?.toString() || "",
              y: destinationData.coordinates?.y?.toString() || ""
            }
          });
        } else {
          router.push('/admin/destinations');
        }
      } catch (error) {
        console.error('Error fetching destination:', error);
        router.push('/admin/destinations');
      }
    };

    if (destinationId) {
      fetchDestination();
    }
  }, [destinationId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
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
      submitData.append('name', formData.name);
      submitData.append('region', formData.region);
      submitData.append('type', formData.type);
      submitData.append('description', formData.description);
      submitData.append('bestTime', formData.bestTime);
      submitData.append('duration', formData.duration);
      submitData.append('difficulty', formData.difficulty);
      submitData.append('rating', formData.rating.toString());
      submitData.append('hasAudio', formData.hasAudio.toString());
      submitData.append('has360', formData.has360.toString());
      submitData.append('highlights', JSON.stringify(formData.highlights.filter(h => h.trim())));
      submitData.append('coordinates', JSON.stringify({
        x: parseFloat(formData.coordinates.x) || 0,
        y: parseFloat(formData.coordinates.y) || 0
      }));
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const response = await fetch(`/api/admin/destinations/${destinationId}`, {
        method: 'PUT',
        body: submitData,
      });

      if (response.ok) {
        router.push('/admin/destinations');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating destination:', error);
      alert('Failed to update destination');
    } finally {
      setLoading(false);
    }
  };

  if (!destination) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold"></div>
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
          <h1 className="text-3xl font-bold text-foreground">Edit Destination</h1>
          <p className="text-muted-foreground mt-2">
            Update the tourism destination details
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
              Image
            </label>
            
            {/* Current Image */}
            {destination.image && !imagePreview && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Current Image:</p>
                <img
                  src={destination.image}
                  alt="Current destination image"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* New Image Upload */}
            {!imagePreview ? (
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-uganda-gold transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {destination.image ? "Replace image" : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-uganda-red text-white rounded-full hover:bg-uganda-red/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                placeholder="Enter destination name"
                required
              />
            </div>

            {/* Region */}
            <div className="space-y-2">
              <label htmlFor="region" className="text-sm font-medium text-foreground">
                Region *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                  placeholder="Enter region"
                  required
                />
              </div>
            </div>
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
                <option value="NATIONAL_PARK">National Park</option>
                <option value="WATERFALL">Waterfall</option>
                <option value="LAKE">Lake</option>
                <option value="CITY">City</option>
                <option value="CULTURAL_SITE">Cultural Site</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium text-foreground">
                Duration *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                  placeholder="e.g., 2-3 days"
                  required
                />
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label htmlFor="difficulty" className="text-sm font-medium text-foreground">
                Difficulty *
              </label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                required
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
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
              placeholder="Describe the destination..."
              required
            />
          </div>

          {/* Best Time */}
          <div className="space-y-2">
            <label htmlFor="bestTime" className="text-sm font-medium text-foreground">
              Best Time to Visit *
            </label>
            <input
              type="text"
              id="bestTime"
              value={formData.bestTime}
              onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="e.g., June to September"
              required
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Rating (0-5)
            </label>
            <div className="flex items-center space-x-2">
              {[0, 1, 2, 3, 4, 5].map((star) => (
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
                {formData.rating}/5
              </span>
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="coordinatesX" className="text-sm font-medium text-foreground">
                Latitude
              </label>
              <input
                type="number"
                id="coordinatesX"
                value={formData.coordinates.x}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  coordinates: { ...formData.coordinates, x: e.target.value }
                })}
                className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                placeholder="0.000000"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="coordinatesY" className="text-sm font-medium text-foreground">
                Longitude
              </label>
              <input
                type="number"
                id="coordinatesY"
                value={formData.coordinates.y}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  coordinates: { ...formData.coordinates, y: e.target.value }
                })}
                className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                placeholder="0.000000"
                step="any"
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Features</label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.hasAudio}
                  onChange={(e) => setFormData({ ...formData, hasAudio: e.target.checked })}
                  className="rounded border-muted"
                />
                <span className="text-sm text-foreground">Has Audio Stories</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.has360}
                  onChange={(e) => setFormData({ ...formData, has360: e.target.checked })}
                  className="rounded border-muted"
                />
                <span className="text-sm text-foreground">Has 360° View</span>
              </label>
            </div>
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
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Update Destination</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
