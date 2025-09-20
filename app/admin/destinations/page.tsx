"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Star,
  Search,
  Filter,
  Clock,
  Mountain,
  ImageIcon
} from "lucide-react";

interface Destination {
  id: string;
  name: string;
  region: string;
  type: string;
  description: string;
  highlights: string[];
  bestTime: string;
  duration: string;
  difficulty: string;
  rating: number;
  hasAudio: boolean;
  has360: boolean;
  image?: string;
  publicId?: string;
  createdAt: string;
  updatedAt: string;
  stories: { id: string; title: string }[];
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations');
        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || destination.type.toLowerCase() === filterType.toLowerCase();
    const matchesDifficulty = filterDifficulty === "all" || destination.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this destination?')) {
      try {
        const response = await fetch(`/api/admin/destinations/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setDestinations(destinations.filter(destination => destination.id !== id));
        }
      } catch (error) {
        console.error('Error deleting destination:', error);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-uganda-green/20 text-uganda-green';
      case 'medium': return 'bg-uganda-gold/20 text-uganda-gold';
      case 'hard': return 'bg-uganda-red/20 text-uganda-red';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'national_park': return 'bg-uganda-green/20 text-uganda-green';
      case 'waterfall': return 'bg-uganda-gold/20 text-uganda-gold';
      case 'lake': return 'bg-uganda-red/20 text-uganda-red';
      case 'city': return 'bg-earth-brown/20 text-earth-brown';
      case 'cultural_site': return 'bg-deep-green/20 text-deep-green';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tourism Destinations</h1>
          <p className="text-muted-foreground mt-2">
            Manage tourism destinations and attractions
          </p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>New Destination</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-background rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="national_park">National Park</option>
              <option value="waterfall">Waterfall</option>
              <option value="lake">Lake</option>
              <option value="city">City</option>
              <option value="cultural_site">Cultural Site</option>
            </select>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((destination, index) => (
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            {/* Image */}
            <div className="h-48 relative overflow-hidden">
              {destination.image ? (
                destination.publicId ? (
                  <CldImage
                    src={destination.publicId}
                    alt={destination.name}
                    width={300}
                    height={192}
                    className="w-full h-full object-cover"
                    crop="fill"
                    gravity="auto"
                  />
                ) : (
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="h-full bg-gradient-to-br from-uganda-green to-deep-green flex items-center justify-center">
                  <Mountain className="h-12 w-12 text-background" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-foreground line-clamp-1">{destination.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-uganda-gold fill-current" />
                  <span className="text-sm font-medium text-uganda-gold">{destination.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{destination.region}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{destination.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{destination.duration}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(destination.difficulty)}`}>
                  {destination.difficulty}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(destination.type)}`}>
                    {destination.type.replace('_', ' ')}
                  </span>
                  {destination.stories && destination.stories.length > 0 && (
                    <span className="px-2 py-1 bg-uganda-gold/20 text-uganda-gold text-xs rounded-full">
                      {destination.stories.length} stories
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Link
                    href={`/admin/destinations/${destination.id}`}
                    className="p-1 text-muted-foreground hover:text-uganda-green transition-colors"
                    title="View"
                  >
                    <Eye className="h-3 w-3" />
                  </Link>
                  <Link
                    href={`/admin/destinations/${destination.id}/edit`}
                    className="p-1 text-muted-foreground hover:text-uganda-gold transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-3 w-3" />
                  </Link>
                  <button
                    onClick={() => handleDelete(destination.id)}
                    className="p-1 text-muted-foreground hover:text-uganda-red transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-12">
          <Mountain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No destinations found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterType !== "all" || filterDifficulty !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first tourism destination."
            }
          </p>
        </div>
      )}
    </div>
  );
}