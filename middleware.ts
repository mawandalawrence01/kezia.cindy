import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.email === "kezia.cindy@gmail.com" || (token as any)?.isAdmin === true

    // If accessing admin routes without admin privileges
    if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without authentication
        if (req.nextUrl.pathname === "/admin/login") {
          return true
        }
        
        // For admin routes, require authentication
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token
        }
        
        // Allow all other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
  ]
}
