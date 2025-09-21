"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { 
  Heart, 
  Share2, 
  Trophy,
  Grid,
  List,
  Download,
  X,
  Camera
} from "lucide-react";
import CommentSection from "./CommentSection";

interface Photo {
  id: string;
  title: string;
  description: string;
  image: string;
  publicId?: string;
  category: 'NATURE' | 'CULTURE' | 'FASHION' | 'EVENTS';
  votes: { id: string; userId: string; photoId: string }[];
  date: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface TopPick {
  id: string;
  title: string;
  image: string;
  publicId?: string;
  votes: { id: string; userId: string; photoId: string }[];
  period: 'weekly' | 'monthly';
  category: string;
}

export default function Gallery() {
  const { data: session } = useSession();
  const [activeCategory, setActiveCategory] = useState<'all' | 'nature' | 'culture' | 'fashion' | 'events'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [topPicks, setTopPicks] = useState<{ weekly: TopPick[]; monthly: TopPick[] }>({ weekly: [], monthly: [] });
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch photos and top picks in parallel
        const [photosResponse, topPicksResponse] = await Promise.all([
          fetch('/api/photos'),
          fetch('/api/photos/top-picks')
        ]);
        
        const photosData = await photosResponse.json();
        const topPicksData = await topPicksResponse.json();
        
        setPhotos(photosData);
        setTopPicks({
          weekly: topPicksData.weekly || [],
          monthly: topPicksData.monthly || []
        });

        // Track user votes if logged in
        if (session?.user?.id) {
          const userVoteIds = new Set<string>(
            photosData
              .flatMap((photo: Photo) => photo.votes)
              .filter((vote: { userId: string; photoId: string }) => vote.userId === session.user.id)
              .map((vote: { userId: string; photoId: string }) => vote.photoId)
          );
          setUserVotes(userVoteIds);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id]);

  const categories = [
    { id: 'all', label: 'All Photos', count: photos.length },
    { id: 'nature', label: 'Nature & Wildlife', count: photos.filter(p => p.category === 'NATURE').length },
    { id: 'culture', label: 'Cultural Heritage', count: photos.filter(p => p.category === 'CULTURE').length },
    { id: 'fashion', label: 'Fashion & Style', count: photos.filter(p => p.category === 'FASHION').length },
    { id: 'events', label: 'Events & Appearances', count: photos.filter(p => p.category === 'EVENTS').length }
  ];

  if (loading) {
    return (
      <section id="gallery" className="py-20 bg-gradient-to-br from-uganda-green/5 to-uganda-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading Gallery...</p>
          </div>
        </div>
      </section>
    );
  }


  // Combine weekly and monthly top picks for display
  const displayTopPicks = [
    ...topPicks.weekly.slice(0, 1).map(pick => ({ ...pick, period: 'weekly' as const })),
    ...topPicks.monthly.slice(0, 1).map(pick => ({ ...pick, period: 'monthly' as const }))
  ];

  const filteredPhotos = activeCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category.toLowerCase() === activeCategory);

  const handleVote = async (photoId: string) => {
    if (!session?.user?.id) {
      alert('Please log in to vote for photos');
      return;
    }

    const isVoted = userVotes.has(photoId);
    
    try {
      const response = await fetch(`/api/photos/${photoId}/vote`, {
        method: isVoted ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update local state
        setPhotos(prevPhotos => 
          prevPhotos.map(photo => 
            photo.id === photoId 
              ? { ...photo, votes: result.voted ? [...photo.votes, { id: '', userId: session.user.id, photoId }] : photo.votes.filter(v => v.userId !== session.user.id) }
              : photo
          )
        );

        // Update user votes
        if (result.voted) {
          setUserVotes(prev => new Set([...prev, photoId]));
        } else {
          setUserVotes(prev => {
            const newSet = new Set(prev);
            newSet.delete(photoId);
            return newSet;
          });
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote for photo');
    }
  };

  const handleShare = (photo: Photo) => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${photo.title} - ${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = (photo: Photo) => {
    // Create a download link for the photo
    const link = document.createElement('a');
    link.href = photo.image || '/api/placeholder/400/600';
    link.download = `${photo.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadMore = () => {
    // TODO: Implement pagination for loading more photos
    console.log('Loading more photos...');
  };

  const handleCommentCountChange = (photoId: string, count: number) => {
    setCommentCounts(prev => ({
      ...prev,
      [photoId]: count
    }));
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-uganda-green/5 to-uganda-gold/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-uganda-green mb-4">
            Gallery & Fan Voting
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vote for your favorite photos and help us showcase the best of Uganda&apos;s beauty and culture
          </p>
        </motion.div>

        {/* Top Picks Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-foreground">Top Picks</h3>
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-uganda-gold" />
              <span className="text-uganda-gold font-semibold">Winners</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayTopPicks.map((pick, index) => (
              <motion.div
                key={pick.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative">
                  {pick.publicId ? (
                    <CldImage
                      src={pick.publicId}
                      alt={pick.title}
                      width={400}
                      height={256}
                      className="w-full h-64 object-cover"
                      crop="fill"
                      gravity="auto"
                    />
                  ) : (
                  <div className="h-64 bg-gradient-to-br from-uganda-gold to-warm-gold flex items-center justify-center">
                    <Camera className="h-16 w-16 text-uganda-black" />
                  </div>
                  )}
                  <div className="absolute top-4 right-4 bg-background/90 rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-uganda-gold">
                      {pick.period === 'weekly' ? 'Weekly' : 'Monthly'} Winner
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-xl font-bold text-foreground mb-2">{pick.title}</h4>
                  <p className="text-muted-foreground mb-4">{pick.category}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-uganda-red" />
                      <span className="font-semibold text-foreground">{pick.votes.length} votes</span>
                    </div>
                    <button 
                      onClick={() => {
                        // Find the full photo data from the photos array
                        const fullPhoto = photos.find(photo => photo.id === pick.id);
                        if (fullPhoto) {
                          setSelectedPhoto(fullPhoto);
                        }
                      }}
                      className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
                    >
                      View Photo
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Gallery Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as 'all' | 'nature' | 'culture' | 'fashion' | 'events')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black shadow-md'
                    : 'bg-background text-muted-foreground hover:text-uganda-green hover:bg-uganda-green/10'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-background rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-uganda-gold text-uganda-black' : 'text-muted-foreground hover:text-uganda-green'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list' ? 'bg-uganda-gold text-uganda-black' : 'text-muted-foreground hover:text-uganda-green'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Photo Grid */}
        <motion.div
          layout
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-6"
          }
        >
          <AnimatePresence>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'h-64'} relative overflow-hidden`}>
                  {photo.publicId ? (
                    <CldImage
                      src={photo.publicId}
                      alt={photo.title}
                      width={viewMode === 'list' ? 192 : 300}
                      height={viewMode === 'list' ? 128 : 256}
                      className="w-full h-full object-cover"
                      crop="fill"
                      gravity="auto"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-uganda-green to-deep-green flex items-center justify-center">
                  <Camera className="h-12 w-12 text-background" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-background/90 rounded-full px-2 py-1">
                    <span className="text-xs font-medium text-uganda-green">
                      {photo.category}
                    </span>
                  </div>
                </div>
                
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h4 className="font-bold text-foreground mb-2 line-clamp-1">{photo.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{photo.description}</p>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                    <span>{new Date(photo.date).toLocaleDateString()}</span>
                    {photo.location && (
                      <>
                        <span>•</span>
                        <span>{photo.location}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(photo.id);
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                        userVotes.has(photo.id)
                          ? 'bg-uganda-red text-background'
                          : 'bg-muted text-muted-foreground hover:bg-uganda-red hover:text-background'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${userVotes.has(photo.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{photo.votes.length}</span>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(photo);
                        }}
                        className="p-2 text-muted-foreground hover:text-uganda-green transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(photo);
                        }}
                        className="p-2 text-muted-foreground hover:text-uganda-gold transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button 
            onClick={handleLoadMore}
            className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Load More Photos
          </button>
        </div>
      </div>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-96 relative overflow-hidden">
                {selectedPhoto.publicId ? (
                  <CldImage
                    src={selectedPhoto.publicId}
                    alt={selectedPhoto.title}
                    width={800}
                    height={384}
                    className="w-full h-full object-cover"
                    crop="fill"
                    gravity="auto"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-uganda-green to-deep-green flex items-center justify-center">
                    <Camera className="h-24 w-24 text-background" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-foreground">{selectedPhoto.title}</h3>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <p className="text-muted-foreground mb-4">{selectedPhoto.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleVote(selectedPhoto.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                          userVotes.has(selectedPhoto.id)
                            ? 'bg-uganda-red text-background'
                            : 'bg-muted text-muted-foreground hover:bg-uganda-red hover:text-background'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${userVotes.has(selectedPhoto.id) ? 'fill-current' : ''}`} />
                        <span>{selectedPhoto.votes.length} votes</span>
                      </button>
                      <button 
                        onClick={() => handleShare(selectedPhoto)}
                        className="flex items-center space-x-2 text-muted-foreground hover:text-uganda-green"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                      <button 
                        onClick={() => handleDownload(selectedPhoto)}
                        className="flex items-center space-x-2 text-muted-foreground hover:text-uganda-gold"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{new Date(selectedPhoto.date).toLocaleDateString()}</span>
                      {selectedPhoto.location && (
                        <>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-uganda-green">{selectedPhoto.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Comment Section */}
                  <CommentSection 
                    photoId={selectedPhoto.id}
                    onCommentCountChange={(count) => handleCommentCountChange(selectedPhoto.id, count)}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
