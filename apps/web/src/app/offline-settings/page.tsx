'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Database,
} from 'lucide-react';


import {
  REGIONAL_BUNDLES,
  listDownloadedRegions,
} from '../../services/region-download.service';
import {
  DownloadedRegionMeta,
  estimateOfflineStorageUsage,
  idbClear,
} from '../../lib/indexed-db';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import RegionDownloadCard from '../../components/offline/RegionDownloadCard';

export default function OfflineSettingsPage() {
  const { isOnline, pendingCount, isSyncing, syncNow } = useNetworkSync();
  const [downloadedRegions, setDownloadedRegions] = useState<DownloadedRegionMeta[]>([]);
  const [storageEstimate, setStorageEstimate] = useState<{
    usageMb: number;
    quotaMb: number;
    percentUsed: number;
  }>({ usageMb: 0, quotaMb: 0, percentUsed: 0 });
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [purgeNotice, setPurgeNotice] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const regions = await listDownloadedRegions();
      setDownloadedRegions(regions);
      const est = await estimateOfflineStorageUsage();
      setStorageEstimate(est);
    } catch (err) {
      console.warn('[OfflineSettings] Data load error:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePurgeAll = async () => {
    if (!window.confirm('Are you sure you want to clear all offline cached data and map tiles?')) {
      return;
    }

    setIsPurging(true);
    try {
      await idbClear('map_tiles');
      await idbClear('downloaded_regions');
      await loadData();
      setPurgeNotice('All regional offline map caches and metadata have been cleared.');
      setTimeout(() => setPurgeNotice(null), 4000);
    } catch (err) {
      console.warn('[OfflineSettings] Purge error:', err);
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#202124] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#5F6368]">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[#0B3D91] hover:underline font-medium flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portal Overview</span>
            </Link>
            <span>/</span>
            <span className="text-[#202124] font-medium">Offline Storage & Regional Pre-Downloads</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                isOnline
                  ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]'
                  : 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]'
              }`}
            >
              {isOnline ? 'Online Telemetry' : 'Offline Mode Active'}
            </span>
          </div>
        </div>

        {/* Section Header */}
        <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-5 sm:p-6 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)] space-y-2">
          <h1 className="text-[20px] font-medium text-[#202124]">
            Offline Data & Regional Pre-Download Manager
          </h1>
          <p className="text-[13px] text-[#5F6368] max-w-3xl leading-relaxed">
            Pre-download high-resolution OpenStreetMap tile pyramids and emergency directories before traveling
            into remote Himalayan zero-connectivity corridors (North Sikkim, Gurudongmar, Dzongu).
          </p>
        </div>

        {purgeNotice && (
          <div className="p-3.5 rounded-[4px] bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333] text-[12px] font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1E8E3E]" />
            <span>{purgeNotice}</span>
          </div>
        )}

        {/* Overview Storage & Sync Panel */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Storage Meter */}
          <div className="rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#5F6368]">
                Device Storage Meter
              </span>
              <Database className="w-4 h-4 text-[#0B3D91]" />
            </div>

            <div className="space-y-0.5">
              <div className="text-[22px] font-medium text-[#202124]">
                {storageEstimate.usageMb > 0 ? `${storageEstimate.usageMb} MB` : '< 1 MB'}
              </div>
              <p className="text-[11px] text-[#5F6368]">
                of {storageEstimate.quotaMb > 0 ? `${(storageEstimate.quotaMb / 1024).toFixed(1)} GB` : 'browser'} quota
              </p>
            </div>

            <div className="w-full h-2 rounded-full bg-[#F8F9FA] overflow-hidden border border-[#DADCE0]">
              <div
                className="h-full bg-[#0B3D91]"
                style={{ width: `${Math.max(3, Math.min(100, storageEstimate.percentUsed))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#5F6368] pt-1 border-t border-[#DADCE0]">
              <span>{downloadedRegions.length} Bundles Cached</span>
              <button
                onClick={handlePurgeAll}
                disabled={isPurging || downloadedRegions.length === 0}
                className="text-[#D93025] hover:underline font-medium disabled:opacity-30 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Cache</span>
              </button>
            </div>
          </div>

          {/* Sync Queue Status */}
          <div className="rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#5F6368]">
                Sync Queue Status
              </span>
              <RefreshCw className={`w-4 h-4 text-[#0B3D91] ${isSyncing ? 'animate-spin' : ''}`} />
            </div>

            <div className="space-y-0.5">
              <div className="text-[22px] font-medium text-[#202124]">
                {pendingCount} Queued Actions
              </div>
              <p className="text-[11px] text-[#5F6368]">
                {pendingCount === 0
                  ? 'All offline requests are synchronized'
                  : 'Pending automated upload upon connection'}
              </p>
            </div>

            <button
              onClick={syncNow}
              disabled={isSyncing || pendingCount === 0 || !isOnline}
              className="w-full py-2 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[12px] font-medium transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing...' : 'Force Sync Queue'}</span>
            </button>
          </div>

          {/* Core Capabilities Checklist */}
          <div className="rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] p-5 space-y-2.5 shadow-xs">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#5F6368] block">
              Offline Cache Engine
            </span>

            <ul className="space-y-1.5 text-[12px] text-[#5F6368]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E8E3E] shrink-0" />
                <span>IndexedDB tile pyramid cache</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E8E3E] shrink-0" />
                <span>Offline SOS SMS dispatch payload</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E8E3E] shrink-0" />
                <span>Monastery & Cultural Lore Database</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E8E3E] shrink-0" />
                <span>Multilingual Chatbot FAQ Knowledge Base</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Regional Pre-Download Bundles Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#DADCE0] pb-2">
            <h2 className="text-[16px] font-medium text-[#202124]">
              Available Sikkim Regional Download Bundles ({REGIONAL_BUNDLES.length})
            </h2>
            <span className="text-[11px] text-[#5F6368]">
              Zoom levels 9–14 tile pyramids included
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REGIONAL_BUNDLES.map((bundle) => {
              const meta = downloadedRegions.find((r) => r.regionId === bundle.id);
              return (
                <RegionDownloadCard
                  key={bundle.id}
                  bundle={bundle}
                  downloadedMeta={meta}
                  onStatusChange={loadData}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
