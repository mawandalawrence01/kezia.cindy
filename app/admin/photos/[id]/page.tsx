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
  MessageCircle,
  Eye,
  Loader2
} from "lucide-react";

interface Photo {
  id: string;
  title: string;
  description: string;
  image: string;
  publicId?: string;
  category: string;
  location?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  votes: { id: string; userId: string; photoId: string }[];
  comments: { 
    id: string; 
    content: string; 
    userId: string; 
    photoId: string;
    user: {
      name: string;
      image?: string;
    };
    createdAt: string;
  }[];
}

export default function PhotoViewPage() {
  const router = useRouter();
  const params = useParams();
  const photoId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [photo, setPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(`/api/photos/${photoId}`);
        if (response.ok) {
          const photoData = await response.json();
          setPhoto(photoData);
        } else {
          router.push('/admin/photos');
        }
      } catch (error) {
        console.error('Error fetching photo:', error);
        router.push('/admin/photos');
      } finally {
        setLoading(false);
      }
    };

    if (photoId) {
      fetchPhoto();
    }
  }, [photoId, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/photos/${photoId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/admin/photos');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo');
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

  if (!photo) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-foreground mb-2">Photo not found</h3>
        <p className="text-muted-foreground mb-4">The photo you&apos;re looking for doesn&apos;t exist.</p>
        <button
          onClick={() => router.push('/admin/photos')}
          className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          Back to Photos
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
            <h1 className="text-3xl font-bold text-foreground">{photo.title}</h1>
            <p className="text-muted-foreground mt-2">
              Photo details and engagement
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <a
            href={`/admin/photos/${photo.id}/edit`}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-background rounded-xl shadow-lg overflow-hidden"
        >
          <div className="aspect-square">
            {photo.publicId ? (
              <CldImage
                src={photo.publicId}
                alt={photo.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                crop="fill"
                gravity="auto"
                quality="auto"
                format="auto"
              />
            ) : (
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Basic Info */}
          <div className="bg-background rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-foreground mb-4">Photo Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Description</h3>
                <p className="text-muted-foreground">{photo.description}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    photo.category === 'NATURE' ? 'bg-uganda-green/20 text-uganda-green' :
                    photo.category === 'CULTURE' ? 'bg-uganda-gold/20 text-uganda-gold' :
                    photo.category === 'FASHION' ? 'bg-uganda-red/20 text-uganda-red' :
                    'bg-earth-brown/20 text-earth-brown'
                  }`}>
                    {photo.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(photo.date).toLocaleDateString()}</span>
                </div>
                {photo.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{photo.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>Created: {new Date(photo.createdAt).toLocaleDateString()}</span>
                </div>
                {photo.updatedAt !== photo.createdAt && (
                  <div className="flex items-center space-x-1">
                    <Edit className="h-4 w-4" />
                    <span>Updated: {new Date(photo.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="bg-background rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-foreground mb-4">Engagement</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-uganda-green/10 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Heart className="h-5 w-5 text-uganda-green" />
                  <span className="text-2xl font-bold text-uganda-green">
                    {photo.votes?.length || 0}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Votes</p>
              </div>

              <div className="text-center p-4 bg-uganda-gold/10 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-uganda-gold" />
                  <span className="text-2xl font-bold text-uganda-gold">
                    {photo.comments?.length || 0}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Comments</p>
              </div>
            </div>
          </div>

          {/* Recent Comments */}
          {photo.comments && photo.comments.length > 0 && (
            <div className="bg-background rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Comments</h2>
              
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {photo.comments.slice(0, 5).map((comment) => (
                  <div key={comment.id} className="border-l-2 border-uganda-gold pl-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-foreground text-sm">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
