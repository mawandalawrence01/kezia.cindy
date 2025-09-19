"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Star,
  Trophy,
  Camera,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye
} from "lucide-react";

interface Photo {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'nature' | 'culture' | 'fashion' | 'events';
  votes: number;
  isVoted: boolean;
  date: string;
  location: string;
  tags: string[];
}

interface TopPick {
  id: number;
  title: string;
  image: string;
  votes: number;
  period: 'weekly' | 'monthly';
  winner: string;
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'nature' | 'culture' | 'fashion' | 'events'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos', count: 156 },
    { id: 'nature', label: 'Nature & Wildlife', count: 45 },
    { id: 'culture', label: 'Cultural Heritage', count: 38 },
    { id: 'fashion', label: 'Fashion & Style', count: 32 },
    { id: 'events', label: 'Events & Appearances', count: 41 }
  ];

  const photos: Photo[] = [
    {
      id: 1,
      title: "Sunset at Murchison Falls",
      description: "The golden hour at one of Uganda's most spectacular natural wonders",
      image: "/api/placeholder/400/600",
      category: 'nature',
      votes: 1247,
      isVoted: false,
      date: "2024-01-15",
      location: "Murchison Falls National Park",
      tags: ["sunset", "waterfalls", "nature", "golden hour"]
    },
    {
      id: 2,
      title: "Traditional Dance Performance",
      description: "Capturing the vibrant energy of Ugandan cultural dances",
      image: "/api/placeholder/400/600",
      category: 'culture',
      votes: 892,
      isVoted: true,
      date: "2024-01-12",
      location: "Kampala Cultural Center",
      tags: ["dance", "culture", "traditional", "performance"]
    },
    {
      id: 3,
      title: "Elegant Evening Gown",
      description: "Showcasing modern African fashion with traditional influences",
      image: "/api/placeholder/400/600",
      category: 'fashion',
      votes: 1567,
      isVoted: false,
      date: "2024-01-10",
      location: "Kampala Fashion Week",
      tags: ["fashion", "gown", "elegant", "african design"]
    },
    {
      id: 4,
      title: "Tourism Week Opening",
      description: "Celebrating Uganda's tourism potential with local communities",
      image: "/api/placeholder/400/600",
      category: 'events',
      votes: 743,
      isVoted: false,
      date: "2024-01-08",
      location: "National Theatre, Kampala",
      tags: ["tourism", "event", "community", "celebration"]
    },
    {
      id: 5,
      title: "Gorilla Encounter",
      description: "A magical moment with Uganda's gentle giants",
      image: "/api/placeholder/400/600",
      category: 'nature',
      votes: 2134,
      isVoted: true,
      date: "2024-01-05",
      location: "Bwindi Impenetrable Forest",
      tags: ["gorillas", "wildlife", "conservation", "bwindi"]
    },
    {
      id: 6,
      title: "Market Day Colors",
      description: "The vibrant colors and energy of local markets",
      image: "/api/placeholder/400/600",
      category: 'culture',
      votes: 567,
      isVoted: false,
      date: "2024-01-03",
      location: "Owino Market, Kampala",
      tags: ["market", "colors", "local life", "vibrant"]
    }
  ];

  const topPicks: TopPick[] = [
    {
      id: 1,
      title: "Gorilla Encounter",
      image: "/api/placeholder/300/400",
      votes: 2134,
      period: 'weekly',
      winner: "Nature & Wildlife"
    },
    {
      id: 2,
      title: "Elegant Evening Gown",
      image: "/api/placeholder/300/400",
      votes: 1567,
      period: 'monthly',
      winner: "Fashion & Style"
    }
  ];

  const filteredPhotos = activeCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === activeCategory);

  const handleVote = (photoId: number) => {
    // In a real app, this would make an API call
    console.log(`Voted for photo ${photoId}`);
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
            Vote for your favorite photos and help us showcase the best of Uganda's beauty and culture
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
            {topPicks.map((pick, index) => (
              <motion.div
                key={pick.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative">
                  <div className="h-64 bg-gradient-to-br from-uganda-gold to-warm-gold flex items-center justify-center">
                    <Camera className="h-16 w-16 text-uganda-black" />
                  </div>
                  <div className="absolute top-4 right-4 bg-background/90 rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-uganda-gold">
                      {pick.period === 'weekly' ? 'Weekly' : 'Monthly'} Winner
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-xl font-bold text-foreground mb-2">{pick.title}</h4>
                  <p className="text-muted-foreground mb-4">{pick.winner}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-uganda-red" />
                      <span className="font-semibold text-foreground">{pick.votes} votes</span>
                    </div>
                    <button className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all">
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
                onClick={() => setActiveCategory(category.id as any)}
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
                <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'h-64'} bg-gradient-to-br from-uganda-green to-deep-green flex items-center justify-center relative`}>
                  <Camera className="h-12 w-12 text-background" />
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
                    <span>{photo.date}</span>
                    <span>•</span>
                    <span>{photo.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {photo.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="bg-uganda-gold/20 text-uganda-gold px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(photo.id);
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                        photo.isVoted
                          ? 'bg-uganda-red text-background'
                          : 'bg-muted text-muted-foreground hover:bg-uganda-red hover:text-background'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${photo.isVoted ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{photo.votes}</span>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-muted-foreground hover:text-uganda-green transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-uganda-gold transition-colors">
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
          <button className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
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
              <div className="h-96 bg-gradient-to-br from-uganda-green to-deep-green flex items-center justify-center">
                <Camera className="h-24 w-24 text-background" />
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
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 bg-uganda-red text-background px-4 py-2 rounded-lg">
                      <Heart className="h-4 w-4 fill-current" />
                      <span>{selectedPhoto.votes} votes</span>
                    </button>
                    <button className="flex items-center space-x-2 text-muted-foreground hover:text-uganda-green">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{selectedPhoto.date}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-uganda-green">{selectedPhoto.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
