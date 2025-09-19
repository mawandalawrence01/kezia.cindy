"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, 
  MapPin, 
  Camera, 
  Users, 
  ChevronDown,
  Menu,
  X,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from "lucide-react";
import QueensCorner from "./components/QueensCorner";
import Gallery from "./components/Gallery";
import FanCommunity from "./components/FanCommunity";
import TourismExplorer from "./components/TourismExplorer";
import FashionLifestyle from "./components/FashionLifestyle";
import Events from "./components/Events";
import AIChatbot from "./components/AIChatbot";
import UserAuth from "./components/UserAuth";
import { GoogleOneTapClean } from "./components/GoogleOneTapClean";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [quotes, setQuotes] = useState([
    "The Pearl of Africa awaits your discovery",
    "Beauty is found in the heart of Uganda",
    "Every journey begins with a single step",
    "Culture is the soul of a nation"
  ]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/quotes');
        const data = await response.json();
        if (data && data.text) {
          setQuotes(prevQuotes => [data.text, ...prevQuotes.slice(1)]);
        }
      } catch (error) {
        console.error('Error fetching daily quote:', error);
      }
    };

    fetchQuotes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes]);

  const navigation = [
    { name: "Queen's Corner", href: "#queens-corner" },
    { name: "Gallery", href: "#gallery" },
    { name: "Fan Community", href: "#community" },
    { name: "Tourism Explorer", href: "#tourism" },
    { name: "Fashion", href: "#fashion" },
    { name: "Events", href: "#events" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-warm-gold">
      {/* Google One Tap Authentication */}
      <GoogleOneTapClean 
        onSuccess={() => {
          console.log('User signed in successfully')
        }}
        onError={(error) => {
          console.error('Google One Tap error:', error)
        }}
      />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-uganda-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-uganda-gold" />
              <span className="text-xl font-bold text-uganda-green">Miss Tourism Uganda</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:text-uganda-gold transition-colors font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="flex-shrink-0">
                <UserAuth />
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-foreground hover:text-uganda-gold"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t border-uganda-gold/20"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-foreground hover:text-uganda-gold transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="px-3 py-2 border-t border-uganda-gold/20">
                  <UserAuth />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-uganda-gold/10 via-transparent to-uganda-green/10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block"
              >
                <Crown className="h-16 w-16 text-uganda-gold mx-auto" />
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                <span className="text-uganda-green">Miss Tourism</span>
                <br />
                <span className="text-uganda-gold">Uganda</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Experience the beauty of Uganda through the eyes of The Queen
              </p>
            </div>

            {/* Daily Quote */}
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-uganda-gold/20 to-uganda-green/20 rounded-lg p-6 max-w-2xl mx-auto"
            >
              <p className="text-lg font-medium italic text-foreground">
                &quot;{quotes[currentQuote]}&quot;
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Explore Uganda
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-uganda-green text-uganda-green px-8 py-4 rounded-full font-semibold text-lg hover:bg-uganda-green hover:text-background transition-all"
              >
                Join Community
              </motion.button>
            </div>

            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <ChevronDown className="h-8 w-8 text-uganda-gold" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-20 bg-gradient-to-r from-uganda-green/5 to-uganda-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Crown, title: "Queen's Corner", description: "Latest updates and travel diaries", color: "from-uganda-gold to-warm-gold" },
              { icon: Camera, title: "Gallery", description: "Vote for your favorite photos", color: "from-uganda-green to-deep-green" },
              { icon: Users, title: "Fan Community", description: "Join polls and quizzes", color: "from-uganda-red to-rich-red" },
              { icon: MapPin, title: "Tourism Explorer", description: "Discover Uganda's hidden gems", color: "from-earth-brown to-uganda-gold" },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="h-6 w-6 text-background" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-muted-foreground">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Queen's Corner */}
      <QueensCorner />

      {/* Gallery */}
      <Gallery />

      {/* Fan Community */}
      <FanCommunity />

      {/* Tourism Explorer */}
      <TourismExplorer />

      {/* Fashion & Lifestyle */}
      <FashionLifestyle />

      {/* Events & Competitions */}
      <Events />

      {/* Footer */}
      <footer className="bg-uganda-black text-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-8 w-8 text-uganda-gold" />
                <span className="text-xl font-bold">Miss Tourism Uganda</span>
              </div>
              <p className="text-cream/80">
                Celebrating the beauty and culture of Uganda through tourism and community.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-cream/80 hover:text-uganda-gold transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow The Queen</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-cream/80 hover:text-uganda-gold transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-cream/80 hover:text-uganda-gold transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-cream/80 hover:text-uganda-gold transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-cream/80 hover:text-uganda-gold transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-cream/80">
                Email: queen@misstourismuganda.com<br />
                Phone: +256 XXX XXX XXX
              </p>
            </div>
          </div>
          
          <div className="border-t border-cream/20 mt-8 pt-8 text-center">
            <p className="text-cream/60">
              © 2024 Miss Tourism Uganda. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
