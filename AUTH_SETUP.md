# Authentication Setup Guide

## Overview
This application uses NextAuth.js for authentication with support for both Google OAuth and credentials-based login.

## Features Implemented

### 1. Authentication Providers
- **Google OAuth**: For social login
- **Credentials**: For admin login with email/password

### 2. Admin Authorization
- Only users with email `kezia.cindy@gmail.com` can access admin areas
- Automatic redirection for unauthorized users
- Role-based access control

### 3. Security Features
- Middleware protection for admin routes
- Session management with JWT strategy
- Error boundaries for better error handling
- Browser compatibility improvements

## Environment Variables Required

Create a `.env.local` file with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (Optional - for Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=your-database-url
```

## Admin Credentials
- **Email**: kezia.cindy@gmail.com
- **Password**: geniusmind

## Files Modified/Created

### Core Authentication
- `lib/auth.ts` - NextAuth configuration with providers and callbacks
- `middleware.ts` - Route protection middleware
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API route

### Components
- `app/admin/login/page.tsx` - Enhanced login page with Google OAuth
- `app/admin/layout.tsx` - Admin layout with authorization checks
- `hooks/useAdminAuth.ts` - Custom hook for admin authentication
- `components/ErrorBoundary.tsx` - Error handling component
- `components/AuthStatus.tsx` - Authentication status display

### Layout
- `app/layout.tsx` - Root layout with error boundary and session provider

## How It Works

1. **Login Process**:
   - Users can sign in with Google OAuth or credentials
   - Admin credentials are hardcoded for `kezia.cindy@gmail.com`
   - Regular users can sign in with Google OAuth

2. **Authorization**:
   - Middleware checks authentication status on admin routes
   - Admin layout verifies admin privileges
   - Non-admin users are redirected away from admin areas

3. **Session Management**:
   - Uses JWT strategy for better performance
   - Sessions include admin role information
   - Automatic token refresh and validation

## Browser Compatibility

The authentication system includes:
- Hydration safety checks
- Loading states for better UX
- Error boundaries for graceful error handling
- Responsive design for all screen sizes

## Troubleshooting

### Blank Page Issues
- Ensure environment variables are properly set
- Check that NextAuth secret is configured
- Verify database connection for user storage

### Authentication Failures
- Check Google OAuth credentials if using Google sign-in
- Verify admin email matches exactly: `kezia.cindy@gmail.com`
- Ensure middleware is properly configured

### Permission Issues
- Only `kezia.cindy@gmail.com` has admin access
- Other users will be redirected to home page
- Check browser console for authentication errors

## Security Notes

- Admin credentials are hardcoded for simplicity
- In production, consider using proper password hashing
- Google OAuth provides additional security layer
- Middleware provides route-level protection
- Error boundaries prevent sensitive information leakage
