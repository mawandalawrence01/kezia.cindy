"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Users, 
  Image, 
  Calendar, 
  Trophy, 
  MessageCircle, 
  MapPin, 
  Shirt, 
  BookOpen, 
  Target,
  Star
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalPhotos: number;
  totalEvents: number;
  totalCompetitions: number;
  totalUpdates: number;
  totalDestinations: number;
  totalOutfits: number;
  totalFanMessages: number;
  totalPolls: number;
  totalQuizzes: number;
  totalQuotes: number;
  totalTravelDiaries: number;
  totalExperiences: number;
  totalStories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data in parallel
        const [
          usersRes, photosRes, eventsRes, competitionsRes, updatesRes,
          destinationsRes, outfitsRes, fanMessagesRes, pollsRes, quizzesRes,
          quotesRes, travelDiariesRes, experiencesRes
        ] = await Promise.all([
          fetch('/api/admin/stats/users'),
          fetch('/api/admin/stats/photos'),
          fetch('/api/admin/stats/events'),
          fetch('/api/admin/stats/competitions'),
          fetch('/api/admin/stats/updates'),
          fetch('/api/admin/stats/destinations'),
          fetch('/api/admin/stats/outfits'),
          fetch('/api/admin/stats/fan-messages'),
          fetch('/api/admin/stats/polls'),
          fetch('/api/admin/stats/quizzes'),
          fetch('/api/admin/stats/quotes'),
          fetch('/api/admin/stats/travel-diaries'),
          fetch('/api/admin/stats/experiences')
        ]);

        const [
          totalUsers, totalPhotos, totalEvents, totalCompetitions, totalUpdates,
          totalDestinations, totalOutfits, totalFanMessages, totalPolls, totalQuizzes,
          totalQuotes, totalTravelDiaries, totalExperiences
        ] = await Promise.all([
          usersRes.json(),
          photosRes.json(),
          eventsRes.json(),
          competitionsRes.json(),
          updatesRes.json(),
          destinationsRes.json(),
          outfitsRes.json(),
          fanMessagesRes.json(),
          pollsRes.json(),
          quizzesRes.json(),
          quotesRes.json(),
          travelDiariesRes.json(),
          experiencesRes.json()
        ]);

        setStats({
          totalUsers: totalUsers.count,
          totalPhotos: totalPhotos.count,
          totalEvents: totalEvents.count,
          totalCompetitions: totalCompetitions.count,
          totalUpdates: totalUpdates.count,
          totalDestinations: totalDestinations.count,
          totalOutfits: totalOutfits.count,
          totalFanMessages: totalFanMessages.count,
          totalPolls: totalPolls.count,
          totalQuizzes: totalQuizzes.count,
          totalQuotes: totalQuotes.count,
          totalTravelDiaries: totalTravelDiaries.count,
          totalExperiences: totalExperiences.count,
          totalStories: 0 // Will be calculated from destinations
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default stats for demo
        setStats({
          totalUsers: 3,
          totalPhotos: 6,
          totalEvents: 4,
          totalCompetitions: 4,
          totalUpdates: 3,
          totalDestinations: 5,
          totalOutfits: 5,
          totalFanMessages: 3,
          totalPolls: 1,
          totalQuizzes: 3,
          totalQuotes: 4,
          totalTravelDiaries: 2,
          totalExperiences: 3,
          totalStories: 3
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-uganda-green to-deep-green",
      href: "/admin/users"
    },
    {
      title: "Photos",
      value: stats?.totalPhotos || 0,
      icon: Image,
      color: "from-uganda-gold to-warm-gold",
      href: "/admin/photos"
    },
    {
      title: "Events",
      value: stats?.totalEvents || 0,
      icon: Calendar,
      color: "from-uganda-red to-rich-red",
      href: "/admin/events"
    },
    {
      title: "Competitions",
      value: stats?.totalCompetitions || 0,
      icon: Trophy,
      color: "from-uganda-gold to-warm-gold",
      href: "/admin/competitions"
    },
    {
      title: "Updates",
      value: stats?.totalUpdates || 0,
      icon: MessageCircle,
      color: "from-uganda-green to-deep-green",
      href: "/admin/updates"
    },
    {
      title: "Destinations",
      value: stats?.totalDestinations || 0,
      icon: MapPin,
      color: "from-earth-brown to-uganda-gold",
      href: "/admin/destinations"
    },
    {
      title: "Outfits",
      value: stats?.totalOutfits || 0,
      icon: Shirt,
      color: "from-uganda-red to-rich-red",
      href: "/admin/outfits"
    },
    {
      title: "Fan Messages",
      value: stats?.totalFanMessages || 0,
      icon: Users,
      color: "from-uganda-gold to-warm-gold",
      href: "/admin/fan-messages"
    },
    {
      title: "Polls",
      value: stats?.totalPolls || 0,
      icon: Target,
      color: "from-uganda-green to-deep-green",
      href: "/admin/polls"
    },
    {
      title: "Quizzes",
      value: stats?.totalQuizzes || 0,
      icon: BookOpen,
      color: "from-uganda-gold to-warm-gold",
      href: "/admin/quizzes"
    },
    {
      title: "Travel Diaries",
      value: stats?.totalTravelDiaries || 0,
      icon: BookOpen,
      color: "from-uganda-green to-deep-green",
      href: "/admin/travel-diaries"
    },
    {
      title: "Experiences",
      value: stats?.totalExperiences || 0,
      icon: Star,
      color: "from-uganda-gold to-warm-gold",
      href: "/admin/experiences"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the Miss Tourism Uganda admin panel. Manage your content and monitor engagement.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.a
            key={stat.title}
            href={stat.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6 text-background" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-background rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/updates/new"
            className="flex items-center space-x-3 p-4 rounded-lg border border-muted hover:border-uganda-gold hover:bg-uganda-gold/5 transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-uganda-gold" />
            <span className="font-medium">Create New Update</span>
          </Link>
          <a
            href="/admin/events/new"
            className="flex items-center space-x-3 p-4 rounded-lg border border-muted hover:border-uganda-gold hover:bg-uganda-gold/5 transition-colors"
          >
            <Calendar className="h-5 w-5 text-uganda-gold" />
            <span className="font-medium">Add New Event</span>
          </a>
          <Link
            href="/admin/photos/new"
            className="flex items-center space-x-3 p-4 rounded-lg border border-muted hover:border-uganda-gold hover:bg-uganda-gold/5 transition-colors"
          >
            <Image className="h-5 w-5 text-uganda-gold" />
            <span className="font-medium">Upload Photo</span>
          </Link>
          <a
            href="/admin/competitions/new"
            className="flex items-center space-x-3 p-4 rounded-lg border border-muted hover:border-uganda-gold hover:bg-uganda-gold/5 transition-colors"
          >
            <Trophy className="h-5 w-5 text-uganda-gold" />
            <span className="font-medium">Create Competition</span>
          </a>
          <a
            href="/admin/destinations/new"
            className="flex items-center space-x-3 p-4 rounded-lg border border-muted hover:border-uganda-gold hover:bg-uganda-gold/5 transition-colors"
          >
            <MapPin className="h-5 w-5 text-uganda-gold" />
            <span className="font-medium">Add Destination</span>
          </a>
          <a
            href="/admin/quotes/new"
            className="flex items-center space-x-3 p-4 rounded-lg border border-muted hover:border-uganda-gold hover:bg-uganda-gold/5 transition-colors"
          >
            <BookOpen className="h-5 w-5 text-uganda-gold" />
            <span className="font-medium">Add Daily Quote</span>
          </a>
          <Link
            href="/admin/travel-diaries/new"
            className="flex items-center space-x-3 p-4 rounded-lg border border-muted hover:border-uganda-gold hover:bg-uganda-gold/5 transition-colors"
          >
            <MapPin className="h-5 w-5 text-uganda-gold" />
            <span className="font-medium">New Travel Diary</span>
          </Link>
          <Link
            href="/admin/experiences/new"
            className="flex items-center space-x-3 p-4 rounded-lg border border-muted hover:border-uganda-gold hover:bg-uganda-gold/5 transition-colors"
          >
            <Users className="h-5 w-5 text-uganda-gold" />
            <span className="font-medium">New Experience</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-background rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-2 h-2 bg-uganda-green rounded-full"></div>
            <span className="text-sm text-muted-foreground">New fan message received</span>
            <span className="text-xs text-muted-foreground ml-auto">2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-2 h-2 bg-uganda-gold rounded-full"></div>
            <span className="text-sm text-muted-foreground">Photo uploaded to gallery</span>
            <span className="text-xs text-muted-foreground ml-auto">1 hour ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-2 h-2 bg-uganda-red rounded-full"></div>
            <span className="text-sm text-muted-foreground">New event created</span>
            <span className="text-xs text-muted-foreground ml-auto">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
