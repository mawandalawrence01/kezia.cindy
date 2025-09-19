"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shirt, 
  Heart, 
  Crown,
  Users,
  Share2,
  Grid,
  List,
  Download,
  X,
  CheckCircle
} from "lucide-react";
import CommentSection from "./CommentSection";

interface Outfit {
  id: string;
  title: string;
  description: string;
  category: 'traditional' | 'modern' | 'formal' | 'casual' | 'cultural';
  image: string;
  votes: number;
  isVoted: boolean;
  designer: string;
  occasion: string;
  culturalSignificance: string;
  tags: string[];
  date: string;
  location: string;
}

interface OutfitPoll {
  id: number;
  question: string;
  description: string;
  options: {
    id: number;
    outfit: Outfit;
    votes: number;
    percentage: number;
  }[];
  totalVotes: number;
  endDate: string;
  isVoted: boolean;
}

interface VirtualCloset {
  id: number;
  name: string;
  category: string;
  items: Outfit[];
}

export default function FashionLifestyle() {
  const [activeTab, setActiveTab] = useState<'closet' | 'polls' | 'showcase'>('closet');
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState<'all' | 'traditional' | 'modern' | 'formal' | 'casual' | 'cultural'>('all');
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const response = await fetch('/api/outfits');
        const data = await response.json();
        setOutfits(data);
      } catch (error) {
        console.error('Error fetching outfits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutfits();
  }, []);

  if (loading) {
    return (
      <section id="fashion" className="py-20 bg-gradient-to-br from-uganda-gold/5 to-uganda-red/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading Fashion & Lifestyle...</p>
          </div>
        </div>
      </section>
    );
  }


  const outfitPolls: OutfitPoll[] = [
    {
      id: 1,
      question: "What should the Queen wear for the next cultural event?",
      description: "Help choose the perfect outfit for the upcoming National Cultural Festival",
      options: [
        {
          id: 1,
          outfit: outfits[0], // Elegant Gomesi
          votes: 234,
          percentage: 45
        },
        {
          id: 2,
          outfit: outfits[1], // Modern African Print
          votes: 189,
          percentage: 36
        },
        {
          id: 3,
          outfit: outfits[2], // Royal Evening Gown
          votes: 98,
          percentage: 19
        }
      ],
      totalVotes: 521,
      endDate: "2024-01-25",
      isVoted: false
    },
    {
      id: 2,
      question: "Best outfit for tourism promotion?",
      description: "Which look best represents Uganda's tourism appeal?",
      options: [
        {
          id: 1,
          outfit: outfits[3], // Casual Safari Chic
          votes: 156,
          percentage: 38
        },
        {
          id: 2,
          outfit: outfits[1], // Modern African Print
          votes: 134,
          percentage: 33
        },
        {
          id: 3,
          outfit: outfits[4], // Cultural Dance Attire
          votes: 120,
          percentage: 29
        }
      ],
      totalVotes: 410,
      endDate: "2024-01-30",
      isVoted: true
    }
  ];

  const virtualCloset: VirtualCloset[] = [
    {
      id: 1,
      name: "Traditional Collection",
      category: "Cultural Heritage",
      items: outfits.filter(outfit => outfit.category === 'traditional' || outfit.category === 'cultural')
    },
    {
      id: 2,
      name: "Modern Collection",
      category: "Contemporary Style",
      items: outfits.filter(outfit => outfit.category === 'modern' || outfit.category === 'casual')
    },
    {
      id: 3,
      name: "Formal Collection",
      category: "Special Occasions",
      items: outfits.filter(outfit => outfit.category === 'formal')
    }
  ];

  const categories = [
    { id: 'all', label: 'All Outfits', count: outfits.length },
    { id: 'traditional', label: 'Traditional', count: outfits.filter(o => o.category === 'traditional').length },
    { id: 'modern', label: 'Modern', count: outfits.filter(o => o.category === 'modern').length },
    { id: 'formal', label: 'Formal', count: outfits.filter(o => o.category === 'formal').length },
    { id: 'casual', label: 'Casual', count: outfits.filter(o => o.category === 'casual').length },
    { id: 'cultural', label: 'Cultural', count: outfits.filter(o => o.category === 'cultural').length }
  ];

  const filteredOutfits = activeCategory === 'all' 
    ? outfits 
    : outfits.filter(outfit => outfit.category.toLowerCase() === activeCategory);

  const tabs = [
    { id: 'closet', label: 'Virtual Closet', icon: Shirt },
    { id: 'polls', label: 'Outfit Polls', icon: Users },
    { id: 'showcase', label: 'Fashion Showcase', icon: Crown }
  ];

  const handleVote = (outfitId: string) => {
    // In a real app, this would make an API call
    console.log(`Voted for outfit ${outfitId}`);
  };

  const handleLike = (outfit: Outfit) => {
    // In a real app, this would make an API call to like/unlike
    console.log(`Liked outfit: ${outfit.title}`);
    
    // Update local state to show immediate feedback
    setOutfits(prevOutfits => 
      prevOutfits.map(o => 
        o.id === outfit.id 
          ? { ...o, votes: (o.votes || 0) + 1, isVoted: true }
          : o
      )
    );
    
    // Show user feedback
    alert(`You liked "${outfit.title}"! ❤️`);
  };

  const handleViewCollection = (collectionId: number) => {
    // Filter outfits by collection and show them
    const collection = virtualCloset.find(c => c.id === collectionId);
    if (collection) {
      setActiveTab('closet');
      setActiveCategory('all');
      // You could also set a specific filter for this collection
      console.log(`Viewing collection: ${collection.name}`);
    }
  };

  const handleCommentCountChange = (outfitId: string, count: number) => {
    setCommentCounts(prev => ({
      ...prev,
      [outfitId]: count
    }));
  };

  const handleShare = (outfit: Outfit) => {
    const shareData = {
      title: `Check out this outfit: ${outfit.title}`,
      text: outfit.description,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => {
          console.log('Successfully shared outfit');
        })
        .catch((error) => {
          console.error('Error sharing:', error);
          // Fallback to clipboard
          fallbackShare(outfit);
        });
    } else {
      // Fallback: copy to clipboard
      fallbackShare(outfit);
    }
  };

  const fallbackShare = (outfit: Outfit) => {
    const shareText = `Check out this outfit: ${outfit.title}\n${outfit.description}\n${window.location.href}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          alert(`"${outfit.title}" link copied to clipboard! 📋`);
        })
        .catch(() => {
          // Final fallback - show the text for manual copying
          prompt('Copy this link to share:', shareText);
        });
    } else {
      // Final fallback - show the text for manual copying
      prompt('Copy this link to share:', shareText);
    }
  };

  const handleDownload = (outfit: Outfit) => {
    try {
      // Create a download link for the outfit image
      const link = document.createElement('a');
      link.href = outfit.image || '/api/placeholder/400/600';
      link.download = `${outfit.title.replace(/\s+/g, '_')}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show user feedback
      alert(`"${outfit.title}" download started! 📥`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'traditional': return 'from-uganda-green to-deep-green';
      case 'modern': return 'from-uganda-gold to-warm-gold';
      case 'formal': return 'from-uganda-red to-rich-red';
      case 'casual': return 'from-earth-brown to-uganda-gold';
      case 'cultural': return 'from-uganda-green to-uganda-gold';
      default: return 'from-muted to-muted-foreground';
    }
  };

  return (
    <section id="fashion" className="py-20 bg-gradient-to-br from-uganda-gold/5 to-uganda-red/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-uganda-green mb-4">
            Fashion & Lifestyle
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the Queen&apos;s style journey, vote on outfits, and discover the cultural significance behind each look
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-background rounded-full p-2 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'closet' | 'polls' | 'showcase')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black shadow-md'
                    : 'text-muted-foreground hover:text-uganda-green'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'closet' && (
            <motion.div
              key="closet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id as 'all' | 'traditional' | 'modern' | 'formal' | 'casual' | 'cultural')}
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
              <div className="flex justify-center mb-8">
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

              {/* Outfit Grid */}
              <motion.div
                layout
                className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
                }
              >
                <AnimatePresence>
                  {filteredOutfits.map((outfit, index) => (
                    <motion.div
                      key={outfit.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                      onClick={() => setSelectedOutfit(outfit)}
                    >
                      <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'h-64'} bg-gradient-to-br ${getCategoryColor(outfit.category)} flex items-center justify-center relative`}>
                        <Shirt className="h-12 w-12 text-background" />
                        <div className="absolute top-2 right-2 bg-background/90 rounded-full px-2 py-1">
                          <span className="text-xs font-medium text-uganda-green">
                            {outfit.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <h4 className="font-bold text-foreground mb-2 line-clamp-1">{outfit.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{outfit.description}</p>
                        
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                        <span>{new Date(outfit.date).toLocaleDateString()}</span>
                        {outfit.location && (
                          <>
                            <span>•</span>
                            <span>{outfit.location}</span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {outfit.tags?.slice(0, 2).map((tag) => (
                          <span key={tag} className="bg-uganda-gold/20 text-uganda-gold px-2 py-1 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(outfit);
                          }}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                            outfit.isVoted 
                              ? 'bg-uganda-red text-background' 
                              : 'bg-muted text-muted-foreground hover:bg-uganda-red hover:text-background'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${outfit.isVoted ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">{outfit.votes || 0}</span>
                        </button>
                          
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(outfit);
                              }}
                              className="p-2 text-muted-foreground hover:text-uganda-green transition-colors"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(outfit);
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
            </motion.div>
          )}

          {activeTab === 'polls' && (
            <motion.div
              key="polls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {outfitPolls.map((poll, index) => (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-xl p-6 shadow-lg"
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{poll.question}</h3>
                    <p className="text-muted-foreground">{poll.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {poll.options.map((option) => (
                      <div key={option.id} className="relative">
                        <button
                          onClick={() => handleVote(option.outfit.id)}
                          disabled={poll.isVoted}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            poll.isVoted
                              ? 'border-uganda-gold bg-uganda-gold/10'
                              : 'border-muted hover:border-uganda-green hover:bg-uganda-green/5'
                          }`}
                        >
                          <div className="h-32 bg-gradient-to-br from-uganda-gold to-warm-gold rounded-lg mb-3 flex items-center justify-center">
                            <Shirt className="h-8 w-8 text-uganda-black" />
                          </div>
                          
                          <h4 className="font-semibold text-foreground mb-2">{option.outfit.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{option.outfit.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-uganda-gold">
                              {option.votes} votes ({option.percentage}%)
                            </span>
                            {poll.isVoted && (
                              <div className="w-4 h-4 bg-uganda-green rounded-full flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-background" />
                              </div>
                            )}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Total votes: {poll.totalVotes}</span>
                    <span>Ends: {poll.endDate}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'showcase' && (
            <motion.div
              key="showcase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {virtualCloset.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-lg flex items-center justify-center">
                        <Crown className="h-6 w-6 text-uganda-black" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{collection.name}</h3>
                        <p className="text-sm text-muted-foreground">{collection.category}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {collection.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-uganda-green to-deep-green rounded-lg flex items-center justify-center">
                            <Shirt className="h-6 w-6 text-background" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.occasion}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3 text-uganda-red" />
                            <span className="text-xs text-muted-foreground">{item.votes}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => handleViewCollection(collection.id)}
                      className="w-full bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black py-2 px-4 rounded-lg font-semibold hover:shadow-md transition-all"
                    >
                      View Collection
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Outfit Detail Modal */}
      <AnimatePresence>
        {selectedOutfit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOutfit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-96 bg-gradient-to-br from-uganda-gold to-warm-gold flex items-center justify-center">
                <Shirt className="h-24 w-24 text-uganda-black" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-foreground">{selectedOutfit.title}</h3>
                  <button
                    onClick={() => setSelectedOutfit(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <p className="text-muted-foreground mb-6">{selectedOutfit.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Designer:</span>
                        <span className="font-medium">{selectedOutfit.designer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Occasion:</span>
                        <span className="font-medium">{selectedOutfit.occasion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{selectedOutfit.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{selectedOutfit.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Cultural Significance</h4>
                    <p className="text-sm text-muted-foreground">{selectedOutfit.culturalSignificance}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleLike(selectedOutfit)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                          selectedOutfit.isVoted 
                            ? 'bg-uganda-red text-background' 
                            : 'bg-muted text-muted-foreground hover:bg-uganda-red hover:text-background'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${selectedOutfit.isVoted ? 'fill-current' : ''}`} />
                        <span>{selectedOutfit.votes} votes</span>
                      </button>
                      <button 
                        onClick={() => handleShare(selectedOutfit)}
                        className="flex items-center space-x-2 text-muted-foreground hover:text-uganda-green transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                      <button 
                        onClick={() => handleDownload(selectedOutfit)}
                        className="flex items-center space-x-2 text-muted-foreground hover:text-uganda-gold transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {selectedOutfit.tags.map((tag) => (
                        <span key={tag} className="bg-uganda-gold/20 text-uganda-gold px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Comment Section */}
                  <CommentSection 
                    outfitId={selectedOutfit.id}
                    onCommentCountChange={(count) => handleCommentCountChange(selectedOutfit.id, count)}
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
