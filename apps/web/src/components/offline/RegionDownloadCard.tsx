'use client';

import React, { useState } from 'react';
import {
  Download,
  Trash2,
  CheckCircle2,
  HardDrive,
  Loader2,
} from 'lucide-react';

import {
  RegionalBundleConfig,
  downloadRegionalBundle,
  deleteRegionalBundle,
} from '../../services/region-download.service';
import { DownloadedRegionMeta } from '../../lib/indexed-db';

interface RegionDownloadCardProps {
  bundle: RegionalBundleConfig;
  downloadedMeta?: DownloadedRegionMeta;
  onRefresh: () => void;
}

export default function RegionDownloadCard({
  bundle,
  downloadedMeta,
  onRefresh,
}: RegionDownloadCardProps) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const isDownloaded = Boolean(downloadedMeta);

  const handleDownload = async () => {
    setIsDownloading(true);
    setProgressPercent(0);
    setProgressStatus('Initializing regional download...');

    try {
      await downloadRegionalBundle(bundle, (percent, status) => {
        setProgressPercent(percent);
        setProgressStatus(status);
      });
      onRefresh();
    } catch (err) {
      console.warn('[RegionDownloadCard] Download error:', err);
      setProgressStatus('Download failed. Check your internet connection.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRegionalBundle(bundle.id);
      onRefresh();
    } catch (err) {
      console.warn('[RegionDownloadCard] Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`rounded-3xl border p-6 transition-all space-y-5 flex flex-col justify-between ${
        isDownloaded
          ? 'bg-gradient-to-b from-teal-950/40 to-slate-900/80 border-teal-500/40 shadow-xl shadow-teal-950/30'
          : 'bg-slate-900/60 hover:bg-slate-900 border-white/10'
      }`}
    >
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold uppercase tracking-wider">
                {bundle.district} District
              </span>
              <span className="text-xs text-white/50 flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-teal-400" />
                <span>~{bundle.estimatedMb} MB</span>
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-white">{bundle.name}</h3>
          </div>

          {isDownloaded && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Offline Ready</span>
            </div>
          )}
        </div>

        <p className="text-xs text-white/70 leading-relaxed">
          {bundle.description}
        </p>

        {/* Highlights List */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block">
            Included in this Regional Bundle:
          </span>
          <ul className="space-y-1.5 text-xs text-white/80">
            {bundle.highlights.map((hl, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="space-y-3 pt-3 border-t border-white/10">
        {/* Live Progress Bar when downloading */}
        {isDownloading && (
          <div className="space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-white/80">
              <span className="flex items-center gap-1.5 text-teal-300 font-semibold truncate max-w-[70%]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{progressStatus}</span>
              </span>
              <span className="font-bold text-teal-300">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Downloaded Metadata Notice */}
        {isDownloaded && downloadedMeta && !isDownloading && (
          <div className="text-[11px] text-white/50 flex items-center justify-between">
            <span>
              Downloaded on{' '}
              {new Date(downloadedMeta.downloadedAt).toLocaleDateString()}
            </span>
            <span className="font-semibold text-teal-300">
              {(downloadedMeta.approxSizeBytes / (1024 * 1024)).toFixed(1)} MB
              stored
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isDownloaded ? (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-950/60"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Downloading Regional Bundle...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Regional Bundle</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-white/10"
              >
                <Download className="w-3.5 h-3.5 text-teal-300" />
                <span>Re-sync Bundle</span>
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3.5 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                title="Remove regional bundle from device"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
