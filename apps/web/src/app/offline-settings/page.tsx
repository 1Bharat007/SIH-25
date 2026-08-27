'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  HardDrive,
  Download,
  WifiOff,
  Wifi,
  RefreshCw,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Database,
  Info,
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
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950 pb-20">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-extrabold text-white flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-teal-400" />
                <span>Offline Data & Pre-Download Center</span>
              </h1>
              <p className="text-xs text-white/60">
                Manage local IndexedDB storage, regional map packages, and sync queues
              </p>
            </div>
          </div>

          {/* Network Indicator Badge */}
          <div
            className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Online Connection Active' : 'Offline Mode Active'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {purgeNotice && (
          <div className="p-4 rounded-2xl bg-teal-950/80 border border-teal-500/40 text-teal-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>{purgeNotice}</span>
          </div>
        )}

        {/* Overview Storage & Sync Panel */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Storage Meter */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                IndexedDB Storage Meter
              </span>
              <Database className="w-4 h-4 text-white/40" />
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-black text-white">
                {storageEstimate.usageMb > 0 ? `${storageEstimate.usageMb} MB` : '< 1 MB'}
              </div>
              <p className="text-xs text-white/50">
                of {storageEstimate.quotaMb > 0 ? `${(storageEstimate.quotaMb / 1024).toFixed(1)} GB` : 'unlimited'} browser quota allocated
              </p>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/10">
              <div
                className="h-full bg-teal-400"
                style={{ width: `${Math.max(3, Math.min(100, storageEstimate.percentUsed))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
              <span>{downloadedRegions.length} Regional Bundles Stored</span>
              <button
                onClick={handlePurgeAll}
                disabled={isPurging || downloadedRegions.length === 0}
                className="text-rose-400 hover:text-rose-300 font-bold disabled:opacity-30 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Cache</span>
              </button>
            </div>
          </div>

          {/* Sync Queue Status */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Background Sync Queue
              </span>
              <RefreshCw className={`w-4 h-4 text-white/40 ${isSyncing ? 'animate-spin' : ''}`} />
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-black text-white">
                {pendingCount} Queued Actions
              </div>
              <p className="text-xs text-white/50">
                {pendingCount === 0
                  ? 'All offline SOS and chatbot actions are synchronized'
                  : 'Pending automated upload upon connection'}
              </p>
            </div>

            <button
              onClick={syncNow}
              disabled={isSyncing || pendingCount === 0 || !isOnline}
              className="w-full py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing Queue...' : 'Force Sync Now'}</span>
            </button>
          </div>

          {/* Offline Engine Architecture Checklist */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 space-y-3 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
              Core Offline Capabilities
            </span>

            <ul className="space-y-2 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Raster Map Tile Pyramid Caching</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>IndexedDB Heritage & Monasteries Catalog</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Offline Multilingual Chatbot Q&A Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>24x7 Offline Police & Hospital Geo Directory</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Remote Region Pre-Download Bundles */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-teal-400" />
                <span>Himalayan Remote Region Data Bundles</span>
              </h2>
              <p className="text-xs text-white/60">
                Pre-download full data packages and bounding-box map tiles before traveling to remote valleys
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/50">
              <Info className="w-4 h-4 text-teal-400" />
              <span>Recommended before heading to North/West Sikkim</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REGIONAL_BUNDLES.map((bundle) => {
              const meta = downloadedRegions.find((r) => r.regionId === bundle.id);
              return (
                <RegionDownloadCard
                  key={bundle.id}
                  bundle={bundle}
                  downloadedMeta={meta}
                  onRefresh={loadData}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
