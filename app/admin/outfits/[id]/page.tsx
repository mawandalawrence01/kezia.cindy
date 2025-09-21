"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Calendar, 
  MapPin, 
  Heart,
  Tag,
  User,
  Loader2
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
  createdAt: string;
  updatedAt: string;
  votes: { id: string; userId: string; outfitId: string }[];
  comments: { id: string; content: string; userId: string; outfitId: string }[];
}

export default function OutfitDetailPage() {
  const router = useRouter();
  const params = useParams();
  const outfitId = params.id as string;
  
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        const response = await fetch(`/api/outfits/${outfitId}`);
        if (response.ok) {
          const outfitData = await response.json();
          setOutfit(outfitData);
        } else {
          router.push('/admin/outfits');
        }
      } catch (error) {
        console.error('Error fetching outfit:', error);
        router.push('/admin/outfits');
      } finally {
        setLoading(false);
      }
    };

    if (outfitId) {
      fetchOutfit();
    }
  }, [outfitId, router]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this outfit? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/outfits/${outfitId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          router.push('/admin/outfits');
        } else {
          alert('Failed to delete outfit');
        }
      } catch (error) {
        console.error('Error deleting outfit:', error);
        alert('Failed to delete outfit');
      }
    }
  };

  if (loading) {
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
            <h1 className="text-3xl font-bold text-foreground">{outfit.title}</h1>
            <p className="text-muted-foreground mt-2">
              Fashion outfit details and management
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push(`/admin/outfits/${outfitId}/edit`)}
            className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 bg-uganda-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-uganda-red/80 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-background rounded-xl shadow-lg overflow-hidden"
        >
          {outfit.publicId ? (
            <CldImage
              src={outfit.publicId}
              alt={outfit.title}
              width={600}
              height={400}
              className="w-full h-96 object-cover"
              crop="fill"
              gravity="auto"
            />
          ) : (
            <div className="h-96 bg-gradient-to-br from-uganda-green to-deep-green flex items-center justify-center">
              <span className="text-background text-lg">No Image</span>
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Basic Info */}
          <div className="bg-background rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-foreground mb-4">Outfit Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    outfit.category === 'TRADITIONAL' ? 'bg-uganda-green/20 text-uganda-green' :
                    outfit.category === 'MODERN' ? 'bg-uganda-gold/20 text-uganda-gold' :
                    outfit.category === 'FORMAL' ? 'bg-uganda-red/20 text-uganda-red' :
                    outfit.category === 'CASUAL' ? 'bg-earth-brown/20 text-earth-brown' :
                    'bg-warm-gold/20 text-warm-gold'
                  }`}>
                    {outfit.category}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Designer</label>
                <div className="mt-1 flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{outfit.designer}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Occasion</label>
                <div className="mt-1 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{outfit.occasion}</span>
                </div>
              </div>

              {outfit.location && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <div className="mt-1 flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{outfit.location}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Date Added</label>
                <div className="mt-1 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {new Date(outfit.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-background rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{outfit.description}</p>
          </div>

          {/* Cultural Significance */}
          <div className="bg-background rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-foreground mb-4">Cultural Significance</h2>
            <p className="text-muted-foreground leading-relaxed">{outfit.culturalSignificance}</p>
          </div>

          {/* Tags */}
          {outfit.tags.length > 0 && (
            <div className="bg-background rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-foreground mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {outfit.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-background rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-foreground mb-4">Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-uganda-red">
                  <Heart className="h-5 w-5" />
                  <span className="text-2xl font-bold">{outfit.votes.length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Votes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-uganda-gold">
                  <span className="text-2xl font-bold">{outfit.comments.length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Comments</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
