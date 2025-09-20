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
  Image as ImageIcon
} from "lucide-react";

interface Photo {
  id: string;
  title: string;
  description: string;
  image: string;
  publicId?: string;
  category: string;
  location?: string;
  date: string;
  votes: { id: string; userId: string; photoId: string }[];
  comments: { id: string; content: string; userId: string; photoId: string }[];
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === "all" || photo.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        const response = await fetch(`/api/admin/photos/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setPhotos(photos.filter(photo => photo.id !== id));
        }
      } catch (error) {
        console.error('Error deleting photo:', error);
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
          <h1 className="text-3xl font-bold text-foreground">Photos</h1>
          <p className="text-muted-foreground mt-2">
            Manage gallery photos and visual content
          </p>
        </div>
        <Link
          href="/admin/photos/new"
          className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>Upload Photo</span>
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
                placeholder="Search photos..."
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
              <option value="nature">Nature</option>
              <option value="culture">Culture</option>
              <option value="fashion">Fashion</option>
              <option value="events">Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="h-48 relative overflow-hidden">
              {photo.publicId ? (
                <CldImage
                  src={photo.publicId}
                  alt={photo.title}
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
                <h3 className="font-bold text-foreground line-clamp-1">{photo.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  photo.category === 'NATURE' ? 'bg-uganda-green/20 text-uganda-green' :
                  photo.category === 'CULTURE' ? 'bg-uganda-gold/20 text-uganda-gold' :
                  photo.category === 'FASHION' ? 'bg-uganda-red/20 text-uganda-red' :
                  'bg-earth-brown/20 text-earth-brown'
                }`}>
                  {photo.category}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{photo.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(photo.date).toLocaleDateString()}</span>
                </div>
                {photo.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{photo.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{photo.votes?.length || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <a
                    href={`/admin/photos/${photo.id}`}
                    className="p-1 text-muted-foreground hover:text-uganda-green transition-colors"
                    title="View"
                  >
                    <Eye className="h-3 w-3" />
                  </a>
                  <a
                    href={`/admin/photos/${photo.id}/edit`}
                    className="p-1 text-muted-foreground hover:text-uganda-gold transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-3 w-3" />
                  </a>
                  <button
                    onClick={() => handleDelete(photo.id)}
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

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No photos found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterCategory !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by uploading your first photo."
            }
          </p>
        </div>
      )}
    </div>
  );
}
