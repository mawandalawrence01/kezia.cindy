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
  MessageCircle,
  Heart,
  Search,
  Filter
} from "lucide-react";

interface Update {
  id: string;
  title: string;
  content: string;
  type: string;
  location?: string;
  image?: string;
  publicId?: string;
  publishedAt: string;
  likes: { id: string; userId: string; updateId: string }[];
  comments: { id: string; content: string; userId: string; updateId: string }[];
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch('/api/updates');
        const data = await response.json();
        setUpdates(data);
      } catch (error) {
        console.error('Error fetching updates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || update.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this update?')) {
      try {
        const response = await fetch(`/api/admin/updates/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setUpdates(updates.filter(update => update.id !== id));
        }
      } catch (error) {
        console.error('Error deleting update:', error);
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
          <h1 className="text-3xl font-bold text-foreground">Updates</h1>
          <p className="text-muted-foreground mt-2">
            Manage Queen&apos;s updates, travel diaries, and experiences
          </p>
        </div>
        <Link
          href="/admin/updates/new"
          className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>New Update</span>
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
                placeholder="Search updates..."
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
              <option value="update">Updates</option>
              <option value="travel">Travel</option>
              <option value="experience">Experience</option>
            </select>
          </div>
        </div>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {filteredUpdates.map((update, index) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-bold text-foreground">{update.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    update.type === 'UPDATE' ? 'bg-uganda-gold/20 text-uganda-gold' :
                    update.type === 'TRAVEL' ? 'bg-uganda-green/20 text-uganda-green' :
                    'bg-uganda-red/20 text-uganda-red'
                  }`}>
                    {update.type}
                  </span>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">{update.content}</p>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(update.publishedAt).toLocaleDateString()}</span>
                  </div>
                  {update.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{update.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>{update.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>{update.comments?.length || 0}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href={`/admin/updates/${update.id}`}
                  className="p-2 text-muted-foreground hover:text-uganda-green transition-colors"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/updates/${update.id}/edit`}
                  className="p-2 text-muted-foreground hover:text-uganda-gold transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(update.id)}
                  className="p-2 text-muted-foreground hover:text-uganda-red transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredUpdates.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No updates found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterType !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first update."
            }
          </p>
        </div>
      )}
    </div>
  );
}
