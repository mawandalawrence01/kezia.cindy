"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Save, 
  ArrowLeft, 
  Loader2,
  Clock,
  Users,
  Star
} from "lucide-react";

export default function NewExperiencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "cultural",
    duration: "",
    participants: 1,
    rating: 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/experiences');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating experience:', error);
      alert('Failed to create experience');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'participants' || name === 'rating' ? parseInt(value) : value
    }));
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
          <h1 className="text-3xl font-bold text-foreground">Create New Experience</h1>
          <p className="text-muted-foreground mt-2">
            Add a new cultural experience or activity
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
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="Enter experience title"
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
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="Describe the cultural experience..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-foreground">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                required
              >
                <option value="cultural">Cultural</option>
                <option value="traditional">Traditional</option>
                <option value="modern">Modern</option>
                <option value="educational">Educational</option>
                <option value="entertainment">Entertainment</option>
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
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                  placeholder="e.g., 2 hours, 1 day"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Participants */}
            <div className="space-y-2">
              <label htmlFor="participants" className="text-sm font-medium text-foreground">
                Max Participants *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  id="participants"
                  name="participants"
                  value={formData.participants}
                  onChange={handleChange}
                  min="1"
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
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
                  <span>Create Experience</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
