"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { LogOut, Crown } from "lucide-react";
import Image from "next/image";

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
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
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
          className="flex items-center space-x-2 bg-uganda-red text-background px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
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