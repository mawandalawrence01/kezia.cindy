"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Clock, 
  MapPin, 
  Play,
  Loader2,
  Volume2,
  BookOpen
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
  destination: {
    name: string;
    region: string;
    type: string;
    description: string;
    highlights: string[];
  };
}

export default function StoryViewPage() {
  const router = useRouter();
  const params = useParams();
  const storyId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/stories/${storyId}`);
        if (response.ok) {
          const storyData = await response.json();
          setStory(storyData);
        } else {
          router.push('/admin/stories');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
        router.push('/admin/stories');
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/admin/stories');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story');
    } finally {
      setDeleting(false);
    }
  };

  const formatDuration = (duration: string) => {
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

  if (!story) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-foreground mb-2">Story not found</h3>
        <p className="text-muted-foreground mb-4">The story you&apos;re looking for doesn&apos;t exist.</p>
        <button
          onClick={() => router.push('/admin/stories')}
          className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          Back to Stories
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{story.title}</h1>
            <p className="text-muted-foreground mt-2">
              Narrated story details
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <a
            href={`/admin/stories/${story.id}/edit`}
            className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </a>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center space-x-2 bg-uganda-red text-white px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-uganda-green/20 text-uganda-green text-sm rounded-full">
                {story.destination.type}
              </span>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(story.duration)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{story.destinationName}</span>
              </div>
            </div>

            {/* Audio Player */}
            {story.audioUrl && (
              <div className="mb-6 p-4 bg-uganda-gold/10 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Volume2 className="h-5 w-5 text-uganda-gold" />
                  <span className="font-medium text-foreground">Audio Story</span>
                </div>
                <audio controls className="w-full">
                  <source src={story.audioUrl} type="audio/mpeg" />
                  <source src={story.audioUrl} type="audio/wav" />
                  <source src={story.audioUrl} type="audio/mp4" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <h3 className="text-lg font-semibold text-foreground mb-3">Transcript</h3>
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {story.transcript}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Destination Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-background rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Destination</h2>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-uganda-gold/10 rounded-lg">
                <MapPin className="h-5 w-5 text-uganda-gold" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{story.destination.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-uganda-green/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-uganda-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium text-foreground">{story.destination.type}</p>
                </div>
              </div>

              <div className="p-3 bg-uganda-red/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Region</p>
                <p className="font-medium text-foreground">{story.destination.region}</p>
              </div>
            </div>

            {story.destination.description && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm text-foreground">{story.destination.description}</p>
              </div>
            )}

            {story.destination.highlights && story.destination.highlights.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Highlights</p>
                <div className="space-y-1">
                  {story.destination.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-uganda-gold rounded-full"></div>
                      <span className="text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Story Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-background rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Story Information</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="text-foreground">{new Date(story.createdAt).toLocaleDateString()}</span>
              </div>
              {story.updatedAt !== story.createdAt && (
                <div className="flex items-center space-x-2">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="text-foreground">{new Date(story.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duration:</span>
                <span className="text-foreground">{formatDuration(story.duration)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Audio:</span>
                <span className={`text-sm ${story.audioUrl ? 'text-uganda-green' : 'text-muted-foreground'}`}>
                  {story.audioUrl ? 'Available' : 'Not available'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
