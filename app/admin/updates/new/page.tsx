"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon,
  MapPin,
  Calendar
} from "lucide-react";

export default function NewUpdatePage() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "UPDATE",
    location: "",
    image: "",
    publishedAt: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.href = '/admin/updates';
      } else {
        console.error('Failed to create update');
      }
    } catch (error) {
      console.error('Error creating update:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <a
          href="/admin/updates"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </a>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Update</h1>
          <p className="text-muted-foreground mt-2">
            Share news, travel experiences, or cultural insights
          </p>
        </div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-background rounded-xl p-6 shadow-lg space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="Enter update title"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-foreground mb-2">
              Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
            >
              <option value="UPDATE">Update</option>
              <option value="TRAVEL">Travel</option>
              <option value="EXPERIENCE">Experience</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
            placeholder="Write your update content here..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                placeholder="Enter location"
              />
            </div>
          </div>

          <div>
            <label htmlFor="publishedAt" className="block text-sm font-medium text-foreground mb-2">
              Publish Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                id="publishedAt"
                name="publishedAt"
                value={formData.publishedAt}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-foreground mb-2">
            Image URL
          </label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-muted">
          <a
            href="/admin/updates"
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-6 py-2 rounded-lg font-semibold hover:shadow-md transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-uganda-black"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{loading ? 'Creating...' : 'Create Update'}</span>
          </button>
        </div>
      </motion.form>
    </div>
  );
}
