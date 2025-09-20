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
  Star,
  Loader2,
  BookOpen
} from "lucide-react";

interface TravelDiary {
  id: string;
  title: string;
  location: string;
  content: string;
  images: string[];
  publicIds?: string[];
  highlights: string[];
  rating: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export default function TravelDiaryViewPage() {
  const router = useRouter();
  const params = useParams();
  const diaryId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [diary, setDiary] = useState<TravelDiary | null>(null);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const response = await fetch(`/api/travel-diaries/${diaryId}`);
        if (response.ok) {
          const diaryData = await response.json();
          setDiary(diaryData);
        } else {
          router.push('/admin/travel-diaries');
        }
      } catch (error) {
        console.error('Error fetching travel diary:', error);
        router.push('/admin/travel-diaries');
      } finally {
        setLoading(false);
      }
    };

    if (diaryId) {
      fetchDiary();
    }
  }, [diaryId, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this travel diary? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/travel-diaries/${diaryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/admin/travel-diaries');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting travel diary:', error);
      alert('Failed to delete travel diary');
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

  if (!diary) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-foreground mb-2">Travel diary not found</h3>
        <p className="text-muted-foreground mb-4">The travel diary you&apos;re looking for doesn&apos;t exist.</p>
        <button
          onClick={() => router.push('/admin/travel-diaries')}
          className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          Back to Travel Diaries
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
            <h1 className="text-3xl font-bold text-foreground">{diary.title}</h1>
            <p className="text-muted-foreground mt-2">
              Travel diary details and memories
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <a
            href={`/admin/travel-diaries/${diary.id}/edit`}
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
          {/* Diary Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= diary.rating 
                        ? 'text-uganda-gold fill-current' 
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(diary.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{diary.location}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {diary.content}
              </div>
            </div>
          </motion.div>

          {/* Images */}
          {diary.images && diary.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-foreground mb-4">Photos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diary.images.map((image, index) => (
                  <div key={index} className="relative">
                    {diary.publicIds && diary.publicIds[index] ? (
                      <CldImage
                        src={diary.publicIds[index]}
                        alt={`${diary.title} - Photo ${index + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover rounded-lg"
                        crop="fill"
                        gravity="auto"
                        quality="auto"
                        format="auto"
                      />
                    ) : (
                      <img
                        src={image}
                        alt={`${diary.title} - Photo ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Highlights */}
          {diary.highlights && diary.highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-background rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold text-foreground mb-4">Highlights</h2>
              <div className="space-y-2">
                {diary.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-uganda-green/10 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-uganda-green rounded-full"></div>
                    <span className="text-sm text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Diary Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-background rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Diary Information</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="text-foreground">{new Date(diary.createdAt).toLocaleDateString()}</span>
              </div>
              {diary.updatedAt !== diary.createdAt && (
                <div className="flex items-center space-x-2">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="text-foreground">{new Date(diary.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Travel Date:</span>
                <span className="text-foreground">{new Date(diary.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span className="text-foreground">{diary.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-uganda-gold" />
                <span className="text-muted-foreground">Rating:</span>
                <span className="text-foreground">{diary.rating}/5 stars</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
