"use client";

import { useState } from "react";
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
  ChevronRight,
  Play
} from "lucide-react";

interface Update {
  id: number;
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

export default function QueensCorner() {
  const [activeTab, setActiveTab] = useState<'updates' | 'travel' | 'experiences'>('updates');

  const updates: Update[] = [
    {
      id: 1,
      title: "Exploring the Source of the Nile",
      content: "Today I had the incredible opportunity to visit the Source of the Nile in Jinja. The power and beauty of this legendary river left me speechless. Standing where explorers once stood, I felt connected to Uganda's rich history and natural wonders.",
      date: "2024-01-15",
      location: "Jinja, Uganda",
      likes: 1247,
      comments: 89,
      type: 'travel'
    },
    {
      id: 2,
      title: "Cultural Exchange with Local Communities",
      content: "Spent the day learning traditional dances and crafts from the Baganda community. Their warmth and hospitality remind me why Uganda is truly the Pearl of Africa. Every interaction teaches me something new about our beautiful culture.",
      date: "2024-01-12",
      location: "Kampala, Uganda",
      likes: 892,
      comments: 67,
      type: 'experience'
    },
    {
      id: 3,
      title: "Upcoming Tourism Week Events",
      content: "Excited to announce that I'll be participating in the National Tourism Week celebrations! Join me for cultural performances, tourism exhibitions, and community outreach programs across different regions of Uganda.",
      date: "2024-01-10",
      likes: 1567,
      comments: 134,
      type: 'update'
    }
  ];

  const travelDiaries: TravelDiary[] = [
    {
      id: 1,
      title: "Murchison Falls Adventure",
      location: "Murchison Falls National Park",
      date: "2024-01-08",
      content: "An unforgettable safari experience where I witnessed the raw power of nature. The falls were absolutely breathtaking, and the wildlife encounters were beyond my wildest dreams.",
      images: ["/api/placeholder/400/300", "/api/placeholder/400/300", "/api/placeholder/400/300"],
      highlights: ["Boat cruise to the falls", "Elephant encounters", "Traditional dance performance"],
      rating: 5
    },
    {
      id: 2,
      title: "Bwindi Impenetrable Forest",
      location: "Bwindi, Uganda",
      date: "2024-01-05",
      content: "Meeting the mountain gorillas was a life-changing experience. These gentle giants reminded me of the importance of conservation and our responsibility to protect Uganda's natural heritage.",
      images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      highlights: ["Gorilla trekking", "Community visit", "Cultural storytelling"],
      rating: 5
    }
  ];

  const experiences = [
    {
      id: 1,
      title: "Learning Traditional Cooking",
      description: "Mastered the art of preparing matooke and groundnut sauce with local chefs",
      category: "Culinary",
      duration: "3 hours",
      participants: 12
    },
    {
      id: 2,
      title: "Basket Weaving Workshop",
      description: "Created beautiful traditional baskets while learning about their cultural significance",
      category: "Crafts",
      duration: "2 hours",
      participants: 8
    },
    {
      id: 3,
      title: "Drumming Circle",
      description: "Learned traditional Ugandan rhythms and their meanings in cultural ceremonies",
      category: "Music",
      duration: "1.5 hours",
      participants: 15
    }
  ];

  const tabs = [
    { id: 'updates', label: 'Updates Hub', icon: MessageCircle },
    { id: 'travel', label: 'Travel Diaries', icon: BookOpen },
    { id: 'experiences', label: 'Experiences', icon: Star }
  ];

  return (
    <section id="queens-corner" className="py-20 bg-gradient-to-br from-cream/30 to-warm-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-uganda-green mb-4">
            Queen's Corner
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
                onClick={() => setActiveTab(tab.id as any)}
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
                        <span>{update.date}</span>
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-muted-foreground hover:text-uganda-red transition-colors">
                          <Heart className="h-5 w-5" />
                          <span>{update.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-muted-foreground hover:text-uganda-green transition-colors">
                          <MessageCircle className="h-5 w-5" />
                          <span>{update.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-muted-foreground hover:text-uganda-gold transition-colors">
                          <Share2 className="h-5 w-5" />
                          <span>Share</span>
                        </button>
                      </div>
                      <button className="text-uganda-gold hover:text-warm-gold transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </button>
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
                      <span className="text-sm text-muted-foreground">{diary.date}</span>
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

                    <button className="w-full bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black py-2 px-4 rounded-lg font-semibold hover:shadow-md transition-all">
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
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
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

                  <button className="w-full border border-uganda-green text-uganda-green py-2 px-4 rounded-lg font-semibold hover:bg-uganda-green hover:text-background transition-all">
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
