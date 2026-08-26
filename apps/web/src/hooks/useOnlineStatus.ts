'use client';

import { useState, useEffect } from 'react';

export function useOnlineStatus(): {
  isOnline: boolean;
  isServiceWorkerReady: boolean;
} {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState<boolean>(false);

  useEffect(() => {
    // Initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(() => setIsServiceWorkerReady(true))
        .catch(() => setIsServiceWorkerReady(false));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isServiceWorkerReady };
}
