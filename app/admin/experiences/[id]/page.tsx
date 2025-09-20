"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Clock, 
  Users, 
  Star,
  Loader2,
  BookOpen
} from "lucide-react";

interface Experience {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  participants: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export default function ExperienceViewPage() {
  const router = useRouter();
  const params = useParams();
  const experienceId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [experience, setExperience] = useState<Experience | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(`/api/experiences/${experienceId}`);
        if (response.ok) {
          const experienceData = await response.json();
          setExperience(experienceData);
        } else {
          router.push('/admin/experiences');
        }
      } catch (error) {
        console.error('Error fetching experience:', error);
        router.push('/admin/experiences');
      } finally {
        setLoading(false);
      }
    };

    if (experienceId) {
      fetchExperience();
    }
  }, [experienceId, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this experience? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/experiences/${experienceId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/admin/experiences');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-foreground mb-2">Experience not found</h3>
        <p className="text-muted-foreground mb-4">The experience you&apos;re looking for doesn&apos;t exist.</p>
        <button
          onClick={() => router.push('/admin/experiences')}
          className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          Back to Experiences
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
            <h1 className="text-3xl font-bold text-foreground">{experience.title}</h1>
            <p className="text-muted-foreground mt-2">
              Cultural experience details
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <a
            href={`/admin/experiences/${experience.id}/edit`}
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
          {/* Experience Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                experience.category === 'cultural' ? 'bg-uganda-gold/20 text-uganda-gold' :
                experience.category === 'traditional' ? 'bg-uganda-green/20 text-uganda-green' :
                experience.category === 'modern' ? 'bg-uganda-red/20 text-uganda-red' :
                experience.category === 'educational' ? 'bg-earth-brown/20 text-earth-brown' :
                'bg-deep-green/20 text-deep-green'
              }`}>
                {experience.category}
              </span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= experience.rating 
                        ? 'text-uganda-gold fill-current' 
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {experience.description}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Experience Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-background rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Experience Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-uganda-gold/10 rounded-lg">
                <Clock className="h-5 w-5 text-uganda-gold" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{experience.duration}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-uganda-green/10 rounded-lg">
                <Users className="h-5 w-5 text-uganda-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Max Participants</p>
                  <p className="font-medium text-foreground">{experience.participants} people</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-uganda-red/10 rounded-lg">
                <Star className="h-5 w-5 text-uganda-red" />
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="font-medium text-foreground">{experience.rating}/5 stars</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Experience Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-background rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Experience Information</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="text-foreground">{new Date(experience.createdAt).toLocaleDateString()}</span>
              </div>
              {experience.updatedAt !== experience.createdAt && (
                <div className="flex items-center space-x-2">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="text-foreground">{new Date(experience.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Category:</span>
                <span className="text-foreground capitalize">{experience.category}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
