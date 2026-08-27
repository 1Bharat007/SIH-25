'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPendingSyncActions } from '../lib/indexed-db';
import { flushSyncQueue, SyncFlushResult } from '../services/sync-queue.service';

export function useNetworkSync() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncFlushResult | null>(null);

  // Refresh pending items count
  const refreshPendingCount = useCallback(async () => {
    try {
      const pending = await getPendingSyncActions();
      setPendingCount(pending.length);
    } catch {
      setPendingCount(0);
    }
  }, []);

  // Flush sync queue
  const syncNow = useCallback(async () => {
    if (isSyncing || typeof window === 'undefined' || !navigator.onLine) return;

    setIsSyncing(true);
    try {
      const result = await flushSyncQueue();
      setLastSyncResult(result);
      await refreshPendingCount();
    } catch (err) {
      console.warn('[useNetworkSync] Sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refreshPendingCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);
    refreshPendingCount();

    const handleOnline = () => {
      setIsOnline(true);
      // Auto-flush queue upon reconnection
      syncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
      refreshPendingCount();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check for queue changes
    const interval = setInterval(refreshPendingCount, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [syncNow, refreshPendingCount]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    lastSyncResult,
    syncNow,
    refreshPendingCount,
  };
}
