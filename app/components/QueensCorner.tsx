"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Share2, 
  BookOpen,
  Camera,
  Star,
  Clock,
  Users,
  ChevronRight
} from "lucide-react";
import CommentSection from "./CommentSection";

interface Update {
  id: string;
  title: string;
  content: string;
  date: string;
  location?: string;
  likes: number;
  comments: number;
  image?: string;
  type: 'update' | 'travel' | 'experience';
}

interface TravelDiary {
  id: number;
  title: string;
  location: string;
  date: string;
  content: string;
  images: string[];
  highlights: string[];
  rating: number;
}

interface Experience {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  type: 'cultural' | 'adventure' | 'culinary' | 'wildlife';
  category: string;
  rating: number;
  highlights: string[];
  image?: string;
  duration: string;
  participants: number;
}

export default function QueensCorner() {
  const [activeTab, setActiveTab] = useState<'updates' | 'travel' | 'experiences'>('updates');
  const [updates, setUpdates] = useState<Update[]>([]);
  const [travelDiaries, setTravelDiaries] = useState<TravelDiary[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [updatesRes, travelRes, experiencesRes] = await Promise.all([
          fetch('/api/updates'),
          fetch('/api/travel-diaries'),
          fetch('/api/experiences')
        ]);

        const [updatesData, travelData, experiencesData] = await Promise.all([
          updatesRes.json(),
          travelRes.json(),
          experiencesRes.json()
        ]);

        setUpdates(updatesData);
        setTravelDiaries(travelData);
        setExperiences(experiencesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="queens-corner" className="py-20 bg-gradient-to-br from-cream/30 to-warm-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading Queen&apos;s Corner...</p>
          </div>
        </div>
      </section>
    );
  }

  const tabs = [
    { id: 'updates', label: 'Updates Hub', icon: MessageCircle },
    { id: 'travel', label: 'Travel Diaries', icon: BookOpen },
    { id: 'experiences', label: 'Experiences', icon: Star }
  ];

  const handleLike = (updateId: string) => {
    // In a real app, this would make an API call
    console.log(`Liked update ${updateId}`);
    // You could also update the local state to show immediate feedback
  };

  const handleCommentCountChange = (updateId: string, count: number) => {
    setCommentCounts(prev => ({
      ...prev,
      [updateId]: count
    }));
    
    // Update the updates array with new comment count
    setUpdates(prev => 
      prev.map(update => 
        update.id === updateId 
          ? { ...update, comments: count }
          : update
      )
    );
  };

  const handleShare = (update: Update) => {
    if (navigator.share) {
      navigator.share({
        title: update.title,
        text: update.content,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${update.title} - ${window.location.href}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleReadDiary = (diaryId: number) => {
    // In a real app, this would navigate to the full diary page
    console.log(`Reading diary ${diaryId}`);
    alert('Full diary would open here!');
  };

  const handleLearnMore = (experienceId: number) => {
    // In a real app, this would navigate to the experience details page
    console.log(`Learning more about experience ${experienceId}`);
    alert('Experience details would open here!');
  };

  return (
    <section id="queens-corner" className="py-20 bg-gradient-to-br from-cream/30 to-warm-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-uganda-green mb-4">
            Queen&apos;s Corner
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Follow my journey as Miss Tourism Uganda - from travel adventures to cultural experiences and behind-the-scenes moments
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-background rounded-full p-2 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'updates' | 'travel' | 'experiences')}
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
          {activeTab === 'updates' && (
            <motion.div
              key="updates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {updates.map((update, index) => (
                <motion.article
                  key={update.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          update.type === 'update' ? 'bg-uganda-gold' :
                          update.type === 'travel' ? 'bg-uganda-green' : 'bg-uganda-red'
                        }`}></div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {update.type === 'update' ? 'Update' : 
                           update.type === 'travel' ? 'Travel Diary' : 'Experience'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(update.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-foreground mb-3">{update.title}</h3>
                    
                    {update.location && (
                      <div className="flex items-center space-x-2 text-uganda-green mb-4">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">{update.location}</span>
                      </div>
                    )}

                    <p className="text-muted-foreground leading-relaxed mb-6">{update.content}</p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <button 
                            onClick={() => handleLike(update.id)}
                            className="flex items-center space-x-2 text-muted-foreground hover:text-uganda-red transition-colors"
                          >
                            <Heart className="h-5 w-5" />
                            <span>{update.likes || 0}</span>
                          </button>
                          <button 
                            onClick={() => handleShare(update)}
                            className="flex items-center space-x-2 text-muted-foreground hover:text-uganda-gold transition-colors"
                          >
                            <Share2 className="h-5 w-5" />
                            <span>Share</span>
                          </button>
                        </div>
                        <button className="text-uganda-gold hover:text-warm-gold transition-colors">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {/* Comment Section */}
                      <CommentSection 
                        updateId={update.id}
                        onCommentCountChange={(count) => handleCommentCountChange(update.id, count)}
                      />
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}

          {activeTab === 'travel' && (
            <motion.div
              key="travel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {travelDiaries.map((diary, index) => (
                <motion.article
                  key={diary.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-r from-uganda-green to-deep-green flex items-center justify-center">
                      <Camera className="h-12 w-12 text-background" />
                    </div>
                    <div className="absolute top-4 right-4 bg-background/90 rounded-full px-3 py-1">
                      <div className="flex items-center space-x-1">
                        {[...Array(diary.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-uganda-gold text-uganda-gold" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-foreground">{diary.title}</h3>
                      <span className="text-sm text-muted-foreground">{new Date(diary.date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-uganda-green mb-4">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">{diary.location}</span>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-3">{diary.content}</p>

                    <div className="space-y-2 mb-4">
                      <h4 className="font-semibold text-foreground">Highlights:</h4>
                      <ul className="space-y-1">
                        {diary.highlights.map((highlight, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-uganda-gold rounded-full"></div>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={() => handleReadDiary(diary.id)}
                      className="w-full bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black py-2 px-4 rounded-lg font-semibold hover:shadow-md transition-all"
                    >
                      Read Full Diary
                    </button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}

          {activeTab === 'experiences' && (
            <motion.div
              key="experiences"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gradient-to-r from-uganda-green to-deep-green text-background px-3 py-1 rounded-full text-sm font-medium">
                      {experience.category}
                    </span>
                    <div className="flex items-center space-x-1 text-uganda-gold">
                      {[...Array(experience.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-3">{experience.title}</h3>
                  <p className="text-muted-foreground mb-4">{experience.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{experience.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{experience.participants} participants</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleLearnMore(experience.id)}
                    className="w-full border border-uganda-green text-uganda-green py-2 px-4 rounded-lg font-semibold hover:bg-uganda-green hover:text-background transition-all"
                  >
                    Learn More
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
