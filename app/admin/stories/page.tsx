"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  MapPin, 
  Play,
  Search,
  Filter
} from "lucide-react";

interface Story {
  id: string;
  title: string;
  destinationName: string;
  duration: string;
  audioUrl?: string;
  publicId?: string;
  transcript: string;
  destinationId: string;
  createdAt: string;
  updatedAt: string;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDestination, setFilterDestination] = useState("all");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories');
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.destinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.transcript.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterDestination === "all" || story.destinationName.toLowerCase() === filterDestination.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      try {
        const response = await fetch(`/api/admin/stories/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setStories(stories.filter(story => story.id !== id));
        }
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };

  const formatDuration = (duration: string) => {
    // Handle different duration formats
    if (duration.includes(':')) {
      return duration;
    }
    if (duration.includes('min')) {
      return duration;
    }
    return `${duration} min`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Narrated Stories</h1>
          <p className="text-muted-foreground mt-2">
            Manage audio stories and narratives
          </p>
        </div>
        <Link
          href="/admin/stories/new"
          className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>New Story</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-background rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterDestination}
              onChange={(e) => setFilterDestination(e.target.value)}
              className="px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
            >
              <option value="all">All Destinations</option>
              {Array.from(new Set(stories.map(story => story.destinationName))).map(destination => (
                <option key={destination} value={destination.toLowerCase()}>
                  {destination}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stories List */}
      <div className="space-y-4">
        {filteredStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-bold text-foreground">{story.title}</h3>
                  <span className="px-2 py-1 bg-uganda-green/20 text-uganda-green text-xs rounded-full">
                    {story.destinationName}
                  </span>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">{story.transcript}</p>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(story.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{story.destinationName}</span>
                  </div>
                  {story.audioUrl && (
                    <div className="flex items-center space-x-2">
                      <Play className="h-4 w-4 text-uganda-gold" />
                      <span className="text-uganda-gold">Audio Available</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href={`/admin/stories/${story.id}`}
                  className="p-2 text-muted-foreground hover:text-uganda-green transition-colors"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/stories/${story.id}/edit`}
                  className="p-2 text-muted-foreground hover:text-uganda-gold transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(story.id)}
                  className="p-2 text-muted-foreground hover:text-uganda-red transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No stories found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterDestination !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first narrated story."
            }
          </p>
        </div>
      )}
    </div>
  );
}
