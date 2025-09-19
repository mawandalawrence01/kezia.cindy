"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { LogOut, Crown } from "lucide-react";

export default function UserAuth() {
  const { data: session, status } = useSession();

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-uganda-gold"></div>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt="User Avatar"
              className="w-8 h-8 rounded-full border-2 border-uganda-gold object-cover"
              onError={(e) => {
                // Fallback to default avatar if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-8 h-8 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-full flex items-center justify-center ${session.user?.image ? 'hidden' : ''}`}>
            <span className="text-uganda-black font-bold text-sm">
              {session.user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-foreground truncate max-w-32">
              {session.user?.name || "User"}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-1 bg-uganda-red text-background px-3 py-1.5 rounded-lg text-sm font-semibold hover:shadow-md transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleSignIn}
      className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
    >
      <Crown className="h-4 w-4" />
      <span>Join The Queen&apos;s Community</span>
    </motion.button>
  );
}