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
  Loader2,
  FileText
} from "lucide-react";

interface Update {
  id: string;
  title: string;
  content: string;
  type: string;
  location?: string;
  image?: string;
  publicId?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  likes: { id: string; userId: string; updateId: string }[];
  comments: { 
    id: string; 
    content: string; 
    userId: string; 
    updateId: string;
    user: {
      name: string;
      image?: string;
    };
    createdAt: string;
  }[];
}

export default function UpdateViewPage() {
  const router = useRouter();
  const params = useParams();
  const updateId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [update, setUpdate] = useState<Update | null>(null);

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const response = await fetch(`/api/updates/${updateId}`);
        if (response.ok) {
          const updateData = await response.json();
          setUpdate(updateData);
        } else {
          router.push('/admin/updates');
        }
      } catch (error) {
        console.error('Error fetching update:', error);
        router.push('/admin/updates');
      } finally {
        setLoading(false);
      }
    };

    if (updateId) {
      fetchUpdate();
    }
  }, [updateId, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this update? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/updates/${updateId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/admin/updates');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting update:', error);
      alert('Failed to delete update');
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

  if (!update) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-foreground mb-2">Update not found</h3>
        <p className="text-muted-foreground mb-4">The update you&apos;re looking for doesn&apos;t exist.</p>
        <button
          onClick={() => router.push('/admin/updates')}
          className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          Back to Updates
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
            <h1 className="text-3xl font-bold text-foreground">{update.title}</h1>
            <p className="text-muted-foreground mt-2">
              Update details and engagement
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <a
            href={`/admin/updates/${update.id}/edit`}
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
          {/* Update Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                update.type === 'UPDATE' ? 'bg-uganda-gold/20 text-uganda-gold' :
                update.type === 'TRAVEL' ? 'bg-uganda-green/20 text-uganda-green' :
                'bg-uganda-red/20 text-uganda-red'
              }`}>
                {update.type}
              </span>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(update.publishedAt).toLocaleDateString()}</span>
              </div>
              {update.location && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{update.location}</span>
                </div>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {update.content}
              </div>
            </div>
          </motion.div>

          {/* Image */}
          {update.image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-xl shadow-lg overflow-hidden"
            >
              {update.publicId ? (
                <CldImage
                  src={update.publicId}
                  alt={update.title}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  crop="fill"
                  gravity="auto"
                  quality="auto"
                  format="auto"
                />
              ) : (
                <img
                  src={update.image}
                  alt={update.title}
                  className="w-full h-auto"
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Engagement Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-background rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Engagement</h2>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-uganda-green/10 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Heart className="h-5 w-5 text-uganda-green" />
                  <span className="text-2xl font-bold text-uganda-green">
                    {update.likes?.length || 0}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Likes</p>
              </div>

              <div className="text-center p-4 bg-uganda-gold/10 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-uganda-gold" />
                  <span className="text-2xl font-bold text-uganda-gold">
                    {update.comments?.length || 0}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Comments</p>
              </div>
            </div>
          </motion.div>

          {/* Update Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-background rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Update Information</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="text-foreground">{new Date(update.createdAt).toLocaleDateString()}</span>
              </div>
              {update.updatedAt !== update.createdAt && (
                <div className="flex items-center space-x-2">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="text-foreground">{new Date(update.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Published:</span>
                <span className="text-foreground">{new Date(update.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Recent Comments */}
          {update.comments && update.comments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-background rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Comments</h2>
              
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {update.comments.slice(0, 5).map((comment) => (
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
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
