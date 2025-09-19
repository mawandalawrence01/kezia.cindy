"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  MapPin, 
  Users,
  Search,
  Filter,
  Clock
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: string;
  attendees: number;
  highlights: string[];
  image?: string;
  registrations: { id: string; userId: string; eventId: string; registeredAt: string }[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || event.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/admin/events/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setEvents(events.filter(event => event.id !== id));
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-uganda-gold/20 text-uganda-gold';
      case 'LIVE':
        return 'bg-uganda-red/20 text-uganda-red';
      case 'COMPLETED':
        return 'bg-uganda-green/20 text-uganda-green';
      default:
        return 'bg-muted text-muted-foreground';
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
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground mt-2">
            Manage events, appearances, and competitions
          </p>
        </div>
        <a
          href="/admin/events/new"
          className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>New Event</span>
        </a>
      </div>

      {/* Filters */}
      <div className="bg-background rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-uganda-gold/20 text-uganda-gold">
                    {event.type}
                  </span>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>

                {event.highlights && event.highlights.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {event.highlights.slice(0, 3).map((highlight, i) => (
                        <span key={i} className="bg-uganda-gold/20 text-uganda-gold px-2 py-1 rounded text-xs">
                          {highlight}
                        </span>
                      ))}
                      {event.highlights.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{event.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <a
                  href={`/admin/events/${event.id}`}
                  className="p-2 text-muted-foreground hover:text-uganda-green transition-colors"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </a>
                <a
                  href={`/admin/events/${event.id}/edit`}
                  className="p-2 text-muted-foreground hover:text-uganda-gold transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </a>
                <button
                  onClick={() => handleDelete(event.id)}
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

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterStatus !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first event."
            }
          </p>
        </div>
      )}
    </div>
  );
}
