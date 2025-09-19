"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Trophy,
  Bell,
  BellOff,
  Play,
  Award
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'pageant' | 'tourism' | 'cultural' | 'competition';
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  attendees: number;
  isRegistered: boolean;
  isNotified: boolean;
  image: string;
  highlights: string[];
}

interface Competition {
  id: number;
  title: string;
  description: string;
  category: 'photo' | 'art' | 'poetry' | 'video';
  endDate: string;
  participants: number;
  prize: string;
  isParticipating: boolean;
  submissions: number;
}

export default function Events() {
  const [activeTab, setActiveTab] = useState<'events' | 'competitions'>('events');
  const [, ] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, competitionsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/competitions')
        ]);

        const [eventsData, competitionsData] = await Promise.all([
          eventsRes.json(),
          competitionsRes.json()
        ]);

        setEvents(eventsData);
        setCompetitions(competitionsData);
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
      <section id="events" className="py-20 bg-gradient-to-br from-uganda-red/5 to-uganda-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading Events & Competitions...</p>
          </div>
        </div>
      </section>
    );
  }



  const tabs = [
    { id: 'events', label: 'Events & Appearances', icon: Calendar },
    { id: 'competitions', label: 'Fan Competitions', icon: Trophy }
  ];


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'text-uganda-gold';
      case 'LIVE': return 'text-uganda-red';
      case 'COMPLETED': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const handleRegister = (eventId: number) => {
    // In a real app, this would make an API call
    console.log(`Registered for event ${eventId}`);
  };

  const handleNotify = (eventId: number) => {
    // In a real app, this would toggle notifications
    console.log(`Toggled notifications for event ${eventId}`);
  };

  const handleParticipate = (competitionId: number) => {
    // In a real app, this would make an API call
    console.log(`Participating in competition ${competitionId}`);
  };

  return (
    <section id="events" className="py-20 bg-gradient-to-br from-uganda-red/5 to-uganda-gold/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-uganda-green mb-4">
            Events & Competitions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with upcoming events, participate in fan competitions, and join the Queen&apos;s journey
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-background rounded-full p-2 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'events' | 'competitions')}
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
          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 bg-gradient-to-br from-uganda-gold to-warm-gold flex items-center justify-center">
                      <Calendar className="h-16 w-16 text-uganda-black" />
                    </div>
                    
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status === 'LIVE' ? '🔴 Live' : event.status.toLowerCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleNotify(event.id)}
                            className={`p-2 rounded-lg transition-all ${
                              event.isNotified 
                                ? 'bg-uganda-gold text-uganda-black' 
                                : 'bg-muted text-muted-foreground hover:bg-uganda-gold hover:text-uganda-black'
                            }`}
                          >
                            {event.isNotified ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{event.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-uganda-green" />
                          <div>
                            <p className="text-xs text-muted-foreground">Date</p>
                            <p className="text-sm font-medium">{event.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-uganda-gold" />
                          <div>
                            <p className="text-xs text-muted-foreground">Time</p>
                            <p className="text-sm font-medium">{event.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-uganda-red" />
                          <div>
                            <p className="text-xs text-muted-foreground">Location</p>
                            <p className="text-sm font-medium">{event.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-earth-brown" />
                          <div>
                            <p className="text-xs text-muted-foreground">Attendees</p>
                            <p className="text-sm font-medium">{event.attendees}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {event.highlights.slice(0, 2).map((highlight: string) => (
                            <span key={highlight} className="bg-uganda-gold/20 text-uganda-gold px-2 py-1 rounded text-xs">
                              {highlight}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {event.status === 'LIVE' && (
                            <button className="flex items-center space-x-2 bg-uganda-red text-background px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all">
                              <Play className="h-4 w-4" />
                              <span>Join Live</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleRegister(event.id)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              event.isRegistered
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black hover:shadow-md'
                            }`}
                          >
                            {event.isRegistered ? 'Registered' : 'Register'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'competitions' && (
            <motion.div
              key="competitions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {competitions.map((competition, index) => (
                <motion.div
                  key={competition.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-lg flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-uganda-black" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{competition.title}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{competition.category}</p>
                      </div>
                    </div>
                    {competition.isParticipating && (
                      <span className="bg-uganda-green/20 text-uganda-green px-2 py-1 rounded text-xs font-medium">
                        Participating
                      </span>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4 text-sm">{competition.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">End Date:</span>
                      <span className="font-medium">{competition.endDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Participants:</span>
                      <span className="font-medium">{competition.participants}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Submissions:</span>
                      <span className="font-medium">{competition.submissions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prize:</span>
                      <span className="font-medium text-uganda-gold">{competition.prize}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleParticipate(competition.id)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      competition.isParticipating
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black hover:shadow-md'
                    }`}
                  >
                    {competition.isParticipating ? 'View Submission' : 'Participate Now'}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spotlight Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-r from-uganda-gold/10 to-warm-gold/10 rounded-xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Competition Winners</h3>
            <p className="text-muted-foreground">Celebrating our amazing community members</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sarah M.", competition: "Best Tourism Photo", prize: "Professional Camera", image: "/api/placeholder/80/80" },
              { name: "David K.", competition: "Cultural Art Challenge", prize: "Art Exhibition", image: "/api/placeholder/80/80" },
              { name: "Grace L.", competition: "Tourism Poetry", prize: "Publishing Deal", image: "/api/placeholder/80/80" }
            ].map((winner, index) => (
              <motion.div
                key={winner.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-lg p-4 text-center shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-uganda-black" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{winner.name}</h4>
                <p className="text-sm text-uganda-green mb-2">{winner.competition}</p>
                <p className="text-xs text-muted-foreground">{winner.prize}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
