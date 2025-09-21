"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";

interface AuthStatusProps {
  showDetails?: boolean;
  className?: string;
}

export default function AuthStatus({ showDetails = false, className = "" }: AuthStatusProps) {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-uganda-gold" />;
      case "authenticated":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "unauthenticated":
        return <XCircle className="h-4 w-4 text-uganda-red" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "loading":
        return "Authenticating...";
      case "authenticated":
        return "Authenticated";
      case "unauthenticated":
        return "Not authenticated";
      default:
        return "Unknown status";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "text-uganda-gold";
      case "authenticated":
        return "text-green-500";
      case "unauthenticated":
        return "text-uganda-red";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center space-x-2 ${className}`}
    >
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      
      {showDetails && session?.user && (
        <div className="ml-4 text-xs text-muted-foreground">
          <div>Email: {session.user.email}</div>
          <div>Name: {session.user.name || "N/A"}</div>
          {(session.user as any).isAdmin && (
            <div className="text-uganda-gold font-medium">Admin User</div>
          )}
        </div>
      )}
    </motion.div>
  );
}
