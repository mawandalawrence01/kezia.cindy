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
  Heart,
  Search,
  Filter,
  Image as ImageIcon,
  Tag,
  User
} from "lucide-react";

interface Outfit {
  id: string;
  title: string;
  description: string;
  image: string;
  publicId?: string;
  category: string;
  designer: string;
  occasion: string;
  culturalSignificance: string;
  tags: string[];
  location?: string;
  date: string;
  votes: { id: string; userId: string; outfitId: string }[];
  comments: { id: string; content: string; userId: string; outfitId: string }[];
}

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

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

  const filteredOutfits = outfits.filter(outfit => {
    const matchesSearch = outfit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outfit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outfit.designer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outfit.occasion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === "all" || outfit.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this outfit?')) {
      try {
        const response = await fetch(`/api/admin/outfits/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setOutfits(outfits.filter(outfit => outfit.id !== id));
        }
      } catch (error) {
        console.error('Error deleting outfit:', error);
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
          <h1 className="text-3xl font-bold text-foreground">Fashion Outfits</h1>
          <p className="text-muted-foreground mt-2">
            Manage fashion outfits and style content
          </p>
        </div>
        <Link
          href="/admin/outfits/new"
          className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>Add Outfit</span>
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
                placeholder="Search outfits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="traditional">Traditional</option>
              <option value="modern">Modern</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>
        </div>
      </div>

      {/* Outfits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOutfits.map((outfit, index) => (
          <motion.div
            key={outfit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="h-48 relative overflow-hidden">
              {outfit.publicId ? (
                <CldImage
                  src={outfit.publicId}
                  alt={outfit.title}
                  width={300}
                  height={192}
                  className="w-full h-full object-cover"
                  crop="fill"
                  gravity="auto"
                />
              ) : (
                <div className="h-full bg-gradient-to-br from-uganda-green to-deep-green flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-background" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-foreground line-clamp-1">{outfit.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  outfit.category === 'TRADITIONAL' ? 'bg-uganda-green/20 text-uganda-green' :
                  outfit.category === 'MODERN' ? 'bg-uganda-gold/20 text-uganda-gold' :
                  outfit.category === 'FORMAL' ? 'bg-uganda-red/20 text-uganda-red' :
                  outfit.category === 'CASUAL' ? 'bg-earth-brown/20 text-earth-brown' :
                  'bg-warm-gold/20 text-warm-gold'
                }`}>
                  {outfit.category}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{outfit.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="truncate">{outfit.designer}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{outfit.occasion}</span>
                </div>
                {outfit.location && (
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{outfit.location}</span>
                  </div>
                )}
              </div>

              {outfit.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {outfit.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground"
                    >
                      <Tag className="h-2 w-2 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {outfit.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{outfit.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{outfit.votes?.length || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <a
                    href={`/admin/outfits/${outfit.id}`}
                    className="p-1 text-muted-foreground hover:text-uganda-green transition-colors"
                    title="View"
                  >
                    <Eye className="h-3 w-3" />
                  </a>
                  <a
                    href={`/admin/outfits/${outfit.id}/edit`}
                    className="p-1 text-muted-foreground hover:text-uganda-gold transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-3 w-3" />
                  </a>
                  <button
                    onClick={() => handleDelete(outfit.id)}
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

      {filteredOutfits.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No outfits found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterCategory !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first outfit."
            }
          </p>
        </div>
      )}
    </div>
  );
}
