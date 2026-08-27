'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, HardDrive, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNetworkSync } from '../../hooks/useNetworkSync';

export default function OfflineStatusBanner() {
  const { isOnline, pendingCount, isSyncing, syncNow } = useNetworkSync();

  // If online and nothing to sync, do not render banner
  if (isOnline && pendingCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <aside
      aria-label="Network Connectivity and Offline Sync Status"
      className={`w-full px-4 py-2.5 text-xs font-semibold border-b transition-all animate-fadeIn ${
        !isOnline
          ? 'bg-amber-950/90 text-amber-200 border-amber-500/40 shadow-lg'
          : isSyncing
          ? 'bg-teal-950/90 text-teal-200 border-teal-500/40 shadow-lg'
          : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Status Message */}
        <div className="flex items-center gap-2.5">
          {!isOnline && (
            <div className="p-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <WifiOff className="w-4 h-4" />
            </div>
          )}

          {isOnline && isSyncing && (
            <div className="p-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
          )}

          {isOnline && !isSyncing && pendingCount > 0 && (
            <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}

          <div>
            {!isOnline && (
              <span>
                <strong>Offline Mode Active:</strong> Serving places, monasteries, and emergency data from local IndexedDB cache.
                {pendingCount > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-100 text-[10px] font-bold">
                    {pendingCount} action{pendingCount > 1 ? 's' : ''} queued
                  </span>
                )}
              </span>
            )}

            {isOnline && isSyncing && (
              <span>
                <strong>Synchronizing Offline Queue:</strong> Sending {pendingCount} queued action{pendingCount > 1 ? 's' : ''} to server...
              </span>
            )}

            {isOnline && !isSyncing && pendingCount > 0 && (
              <span>
                <strong>Connection Restored:</strong> {pendingCount} offline action{pendingCount > 1 ? 's' : ''} pending synchronization.
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isOnline && pendingCount > 0 && (
            <button
              onClick={syncNow}
              disabled={isSyncing}
              className="px-3 py-1 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          )}

          <Link
            href="/offline-settings"
            className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
          >
            <HardDrive className="w-3 h-3 text-teal-300" />
            <span>Manage Regional Cache</span>
            <ArrowRight className="w-3 h-3 text-white/60" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
