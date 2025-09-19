"use client";

import { useEffect, useRef, useCallback } from 'react';
import { signIn } from 'next-auth/react';

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
            ux_mode?: string;
            itp_support?: boolean;
          }) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleOneTapProps {
  onSuccess?: (credential: string) => void;
  onError?: (error: string) => void;
  autoSelect?: boolean;
  cancelOnTapOutside?: boolean;
}

export default function GoogleOneTap({
  onSuccess,
  onError,
  autoSelect = false,
  cancelOnTapOutside = true
}: GoogleOneTapProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const isProcessing = useRef(false);

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      console.log('Processing Google One Tap credential...');
      
      // Send the credential to your backend for verification
      const result = await signIn('google', {
        credential: response.credential,
        redirect: false,
      });

      if (result?.ok) {
        console.log('Google One Tap authentication successful');
        onSuccess?.(response.credential);
        // Reload the page to update the session
        window.location.reload();
      } else {
        console.error('Google One Tap authentication failed:', result?.error);
        onError?.(result?.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Error during Google One Tap authentication:', error);
      onError?.('Authentication failed');
    } finally {
      isProcessing.current = false;
    }
  }, [onSuccess, onError]);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) return;

    const initializeGoogleOneTap = () => {
      if (window.google && window.google.accounts && !isInitialized.current) {
        try {
          // Cancel any existing prompts first
          window.google.accounts.id.cancel();
          
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '331038062369-4s6hj0ihn0ihovieh06hndhurg2idhva.apps.googleusercontent.com',
            callback: handleCredentialResponse,
            auto_select: autoSelect,
            cancel_on_tap_outside: cancelOnTapOutside,
            context: 'signin',
            ux_mode: 'popup',
            itp_support: false, // Disable ITP support to avoid FedCM issues
          });

          // Only prompt once
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed()) {
              console.log('Google One Tap was not displayed');
            } else if (notification.isSkippedMoment()) {
              console.log('Google One Tap was skipped');
            }
          });

          isInitialized.current = true;
        } catch (error) {
          console.error('Error initializing Google One Tap:', error);
          onError?.('Failed to initialize Google One Tap');
        }
      }
    };

    // Load Google One Tap script only if not already loaded
    if (window.google && window.google.accounts) {
      initializeGoogleOneTap();
    } else {
      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleOneTap;
        script.onerror = () => {
          console.error('Failed to load Google One Tap script');
          onError?.('Failed to load Google One Tap');
        };
        document.head.appendChild(script);
      } else {
        // Script exists, wait for it to load
        existingScript.addEventListener('load', initializeGoogleOneTap);
      }
    }

    return () => {
      // Cleanup
      if (window.google && window.google.accounts && isInitialized.current) {
        try {
          window.google.accounts.id.cancel();
          window.google.accounts.id.disableAutoSelect();
        } catch (error) {
          console.error('Error during Google One Tap cleanup:', error);
        }
        isInitialized.current = false;
      }
    };
  }, [handleCredentialResponse, autoSelect, cancelOnTapOutside, onError]);

  return (
    <div className="google-one-tap-container">
      {/* The Google One Tap prompt will be rendered here automatically */}
      <div ref={googleButtonRef} id="g_id_onload"></div>
    </div>
  );
}
