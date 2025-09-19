"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Crown } from "lucide-react";
import GoogleOneTap from "./GoogleOneTap";
import GoogleSignIn from "./GoogleSignIn";
import SimpleGoogleAuth from "./SimpleGoogleAuth";

export default function UserAuth() {
  const { data: session, status } = useSession();
  const [showOneTap, setShowOneTap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOneTapSuccess = () => {
    console.log('Google One Tap login successful');
    setIsLoading(false);
    setShowOneTap(false);
  };

  const handleOneTapError = (error: string) => {
    console.error('Google One Tap error:', error);
    setIsLoading(false);
    setShowOneTap(false);
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
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-8 h-8 rounded-full border-2 border-uganda-gold"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-uganda-black" />
            </div>
          )}
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">
              {session.user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground">
              Welcome to The Queen&apos;s Community
            </p>
          </div>
        </div>
        
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-1 px-3 py-1 rounded-lg text-sm text-muted-foreground hover:text-uganda-red hover:bg-uganda-red/10 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <SimpleGoogleAuth />

      <AnimatePresence>
        {showOneTap && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowOneTap(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-xl p-6 shadow-xl max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <Crown className="h-12 w-12 text-uganda-gold mx-auto mb-2" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Welcome to The Queen&apos;s Community
                </h3>
                <p className="text-muted-foreground">
                  Sign in with Google to join our vibrant community of tourism enthusiasts
                </p>
              </div>
              
              {isLoading && (
                <div className="text-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-uganda-gold mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Initializing Google One Tap...</p>
                </div>
              )}
              
              <div className="space-y-4">
                <GoogleSignIn />
                
                <div className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or try One Tap</span>
                    </div>
                  </div>
                </div>
                
                <GoogleOneTap
                  onSuccess={handleOneTapSuccess}
                  onError={handleOneTapError}
                  autoSelect={false}
                  cancelOnTapOutside={true}
                />
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowOneTap(false);
                    setIsLoading(false);
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
