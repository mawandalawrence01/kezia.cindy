"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Image, 
  Calendar, 
  Trophy, 
  MessageCircle, 
  MapPin, 
  Shirt, 
  BookOpen, 
  Target,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Volume2,
  Quote,
  Star
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Updates", href: "/admin/updates", icon: MessageCircle },
  { name: "Travel Diaries", href: "/admin/travel-diaries", icon: BookOpen },
  { name: "Experiences", href: "/admin/experiences", icon: Star },
  { name: "Photos", href: "/admin/photos", icon: Image },
  { name: "Destinations", href: "/admin/destinations", icon: MapPin },
  { name: "Stories", href: "/admin/stories", icon: Volume2 },
  { name: "Outfits", href: "/admin/outfits", icon: Shirt },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Competitions", href: "/admin/competitions", icon: Trophy },
  { name: "Fan Messages", href: "/admin/fan-messages", icon: Users },
  { name: "Polls", href: "/admin/polls", icon: Target },
  { name: "Quizzes", href: "/admin/quizzes", icon: BookOpen },
  { name: "Daily Quotes", href: "/admin/quotes", icon: Quote },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("adminAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/admin/login";
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream/30 to-warm-gold/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream/30 to-warm-gold/20">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-muted">
          <div className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-uganda-gold" />
            <span className="text-xl font-bold text-foreground">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-uganda-gold/10 transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-muted">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-uganda-red/10 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-muted">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Welcome back, Admin
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-full flex items-center justify-center">
                <Crown className="h-4 w-4 text-uganda-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
