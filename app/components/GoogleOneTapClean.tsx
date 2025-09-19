'use client'

import { useEffect, useState, useCallback } from 'react'
import { signIn, useSession } from 'next-auth/react'

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            context?: string;
            itp_support?: boolean;
            ux_mode?: string;
            login_uri?: string;
          }) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
        };
      };
    }
  }
}

interface GoogleOneTapProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  autoPrompt?: boolean
  disabled?: boolean
}

export function GoogleOneTapClean({ 
  onSuccess, 
  onError, 
  autoPrompt = true,
  disabled = false 
}: GoogleOneTapProps) {
  const { data: session, status } = useSession()
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasPrompted, setHasPrompted] = useState(false)

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    try {
      const result = await signIn('google', {
        credential: response.credential,
        redirect: false,
      })

      if (result?.error) {
        console.error('Sign in error:', result.error)
        onError?.(result.error)
      } else if (result?.ok) {
        console.log('Successfully signed in!')
        onSuccess?.()
      }
    } catch (error) {
      console.error('Error during sign in:', error)
      onError?.('Sign in failed')
    }
  }, [onError, onSuccess])

  useEffect(() => {
    // Load Google One Tap script
    const loadGoogleScript = () => {
      if (window.google) {
        setIsLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        setIsLoaded(true)
      }
      script.onerror = () => {
        console.error('Failed to load Google One Tap script')
        onError?.('Failed to load Google authentication')
      }
      document.head.appendChild(script)
    }

    loadGoogleScript()
  }, [onError])

  useEffect(() => {
    if (!isLoaded || !autoPrompt || disabled || session || hasPrompted || status === 'loading') {
      return
    }

    // Initialize Google One Tap
    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '331038062369-4s6hj0ihn0ihovieh06hndhurg2idhva.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
        itp_support: true,
        ux_mode: 'popup',
        login_uri: window.location.origin,
      })

      // Show the One Tap prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google One Tap was not displayed or was skipped')
        }
      })

      setHasPrompted(true)
    } catch (error) {
      console.error('Error initializing Google One Tap:', error)
      onError?.('Failed to initialize Google authentication')
    }
  }, [isLoaded, autoPrompt, disabled, session, hasPrompted, status, onError, handleCredentialResponse])


  // Don't render anything if user is already signed in
  if (session) {
    return null
  }

  return (
    <div className="google-one-tap-container">
      {/* This component doesn't render any visible UI by default */}
      {/* The Google One Tap prompt appears automatically */}
    </div>
  )
}
