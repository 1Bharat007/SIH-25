'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
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
      className={`w-full px-4 py-2 text-[12px] border-b transition-colors ${
        !isOnline
          ? 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]'
          : isSyncing
            ? 'bg-[#E8F0FE] text-[#0B3D91] border-[#D2E3FC]'
            : 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Status Message */}
        <div className="flex items-center gap-2">
          {!isOnline && <WifiOff className="w-3.5 h-3.5" />}
          {isOnline && isSyncing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
          {isOnline && !isSyncing && pendingCount > 0 && <CheckCircle2 className="w-3.5 h-3.5" />}

          <div>
            {!isOnline && (
              <span>
                <strong className="font-medium">Offline Mode:</strong> Serving data from local device storage.
                {pendingCount > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#FFFFFF] border border-[#FEEFC3] text-[11px] font-medium">
                    {pendingCount} action{pendingCount > 1 ? 's' : ''} queued
                  </span>
                )}
              </span>
            )}

            {isOnline && isSyncing && (
              <span>
                <strong className="font-medium">Sync in progress:</strong> Transmitting queued offline actions to Sikkim servers...
              </span>
            )}

            {isOnline && !isSyncing && pendingCount > 0 && (
              <span>
                <strong className="font-medium">Connection Restored:</strong> {pendingCount} offline action{pendingCount > 1 ? 's' : ''} ready to sync.
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isOnline && pendingCount > 0 && (
            <button
              onClick={() => syncNow()}
              disabled={isSyncing}
              className="px-2.5 py-1 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[11px] font-medium transition-colors disabled:opacity-50"
            >
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          )}

          <Link
            href="/offline-settings"
            className="inline-flex items-center gap-1 font-medium hover:underline text-[11px]"
          >
            <span>Offline Settings</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
