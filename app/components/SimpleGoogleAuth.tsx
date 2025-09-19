"use client";

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

export default function SimpleGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await signIn('google', {
        callbackUrl: window.location.href,
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="flex items-center space-x-3 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-6 py-3 rounded-lg font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Crown className="h-5 w-5" />
      <span>
        {isLoading ? 'Signing in...' : 'Join The Queen\'s Community'}
      </span>
    </motion.button>
  );
}
