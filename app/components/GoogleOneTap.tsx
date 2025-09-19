"use client";

import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const initializeGoogleOneTap = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '331038062369-4s6hj0ihn0ihovieh06hndhurg2idhva.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          auto_select: autoSelect,
          cancel_on_tap_outside: cancelOnTapOutside,
          context: 'signin',
          ux_mode: 'popup',
          itp_support: true,
        });

        // Render the One Tap prompt
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // One Tap was not displayed or was skipped
            console.log('Google One Tap was not displayed or was skipped');
          }
        });
      }
    };

    const handleCredentialResponse = async (response: { credential: string }) => {
      try {
        // Send the credential to your backend for verification
        const result = await signIn('google', {
          credential: response.credential,
          redirect: false,
        });

        if (result?.ok) {
          onSuccess?.(response.credential);
          // Reload the page to update the session
          window.location.reload();
        } else {
          onError?.(result?.error || 'Authentication failed');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        onError?.('Authentication failed');
      }
    };

    // Load Google One Tap script
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleOneTap();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleOneTap;
      document.head.appendChild(script);
    };

    loadGoogleScript();

    return () => {
      // Cleanup
      if (window.google && window.google.accounts) {
        window.google.accounts.id.cancel();
      }
    };
  }, [autoSelect, cancelOnTapOutside, onSuccess, onError]);

  return (
    <div className="google-one-tap-container">
      {/* The Google One Tap prompt will be rendered here automatically */}
      <div ref={googleButtonRef} id="g_id_onload"></div>
    </div>
  );
}
