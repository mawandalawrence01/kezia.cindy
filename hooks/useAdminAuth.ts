"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAdminAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    if (status === "authenticated" && session?.user) {
      const isAdmin = (session.user as any).isAdmin === true || 
                     session.user.email === "kezia.cindy@gmail.com";
      
      if (!isAdmin) {
        // Redirect non-admin users away from admin area
        router.push("/");
        return;
      }
    }
  }, [status, session, router]);

  const isAdmin = status === "authenticated" && session?.user && 
    ((session.user as any).isAdmin === true || session.user.email === "kezia.cindy@gmail.com");

  return {
    session,
    status,
    isAdmin,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
