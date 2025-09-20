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
  Calendar, 
  MapPin, 
  Star,
  Search,
  Filter
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

export default function TravelDiariesPage() {
  const [diaries, setDiaries] = useState<TravelDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await fetch('/api/travel-diaries');
        const data = await response.json();
        setDiaries(data);
      } catch (error) {
        console.error('Error fetching travel diaries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  const filteredDiaries = diaries.filter(diary => {
    const matchesSearch = diary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diary.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diary.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRating === "all" || diary.rating.toString() === filterRating;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this travel diary?')) {
      try {
        const response = await fetch(`/api/admin/travel-diaries/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setDiaries(diaries.filter(diary => diary.id !== id));
        }
      } catch (error) {
        console.error('Error deleting travel diary:', error);
      }
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
          <h1 className="text-3xl font-bold text-foreground">Travel Diaries</h1>
          <p className="text-muted-foreground mt-2">
            Manage travel experiences and adventures
          </p>
        </div>
        <Link
          href="/admin/travel-diaries/new"
          className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>New Diary</span>
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
                placeholder="Search travel diaries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Travel Diaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiaries.map((diary, index) => (
          <motion.div
            key={diary.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            {/* Image */}
            <div className="h-48 relative overflow-hidden">
              {diary.images && diary.images.length > 0 ? (
                diary.publicIds && diary.publicIds.length > 0 && diary.publicIds[0] ? (
                  <CldImage
                    src={diary.publicIds[0]}
                    alt={diary.title}
                    width={300}
                    height={192}
                    className="w-full h-full object-cover"
                    crop="fill"
                    gravity="auto"
                  />
                ) : (
                  <img
                    src={diary.images[0]}
                    alt={diary.title}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="h-full bg-gradient-to-br from-uganda-green to-deep-green flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-background" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-foreground line-clamp-1">{diary.title}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-uganda-gold fill-current" />
                  <span className="text-sm font-medium text-uganda-gold">{diary.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{diary.location}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{diary.content}</p>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(diary.date).toLocaleDateString()}</span>
                </div>
                {diary.images && diary.images.length > 1 && (
                  <span className="text-uganda-gold">+{diary.images.length - 1} more</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {diary.highlights.slice(0, 2).map((highlight, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-uganda-green/20 text-uganda-green text-xs rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                  {diary.highlights.length > 2 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      +{diary.highlights.length - 2}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Link
                    href={`/admin/travel-diaries/${diary.id}`}
                    className="p-1 text-muted-foreground hover:text-uganda-green transition-colors"
                    title="View"
                  >
                    <Eye className="h-3 w-3" />
                  </Link>
                  <Link
                    href={`/admin/travel-diaries/${diary.id}/edit`}
                    className="p-1 text-muted-foreground hover:text-uganda-gold transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-3 w-3" />
                  </Link>
                  <button
                    onClick={() => handleDelete(diary.id)}
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

      {filteredDiaries.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No travel diaries found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterRating !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first travel diary."
            }
          </p>
        </div>
      )}
    </div>
  );
}
