"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  Users, 
  Star,
  Search,
  Filter
} from "lucide-react";

interface Experience {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  participants: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experiences');
        const data = await response.json();
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const filteredExperiences = experiences.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === "all" || experience.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        const response = await fetch(`/api/admin/experiences/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setExperiences(experiences.filter(experience => experience.id !== id));
        }
      } catch (error) {
        console.error('Error deleting experience:', error);
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
          <h1 className="text-3xl font-bold text-foreground">Cultural Experiences</h1>
          <p className="text-muted-foreground mt-2">
            Manage cultural experiences and activities
          </p>
        </div>
        <Link
          href="/admin/experiences/new"
          className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>New Experience</span>
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
                placeholder="Search experiences..."
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
              <option value="cultural">Cultural</option>
              <option value="traditional">Traditional</option>
              <option value="modern">Modern</option>
              <option value="educational">Educational</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Experiences List */}
      <div className="space-y-4">
        {filteredExperiences.map((experience, index) => (
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-bold text-foreground">{experience.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    experience.category === 'cultural' ? 'bg-uganda-gold/20 text-uganda-gold' :
                    experience.category === 'traditional' ? 'bg-uganda-green/20 text-uganda-green' :
                    experience.category === 'modern' ? 'bg-uganda-red/20 text-uganda-red' :
                    experience.category === 'educational' ? 'bg-earth-brown/20 text-earth-brown' :
                    'bg-deep-green/20 text-deep-green'
                  }`}>
                    {experience.category}
                  </span>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">{experience.description}</p>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{experience.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{experience.participants} participants</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-uganda-gold" />
                    <span>{experience.rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href={`/admin/experiences/${experience.id}`}
                  className="p-2 text-muted-foreground hover:text-uganda-green transition-colors"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/experiences/${experience.id}/edit`}
                  className="p-2 text-muted-foreground hover:text-uganda-gold transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(experience.id)}
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

      {filteredExperiences.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No experiences found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterCategory !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first cultural experience."
            }
          </p>
        </div>
      )}
    </div>
  );
}
