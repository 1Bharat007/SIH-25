'use client';

import React, { useState } from 'react';
import {
  Download,
  Trash2,
  CheckCircle2,
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
  onRefresh?: () => void;
  onStatusChange?: () => void;
}

export default function RegionDownloadCard({
  bundle,
  downloadedMeta,
  onRefresh,
  onStatusChange,
}: RegionDownloadCardProps) {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const notifyChange = () => {
    if (onStatusChange) onStatusChange();
    if (onRefresh) onRefresh();
  };

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
      notifyChange();
    } catch (err) {
      console.warn('[RegionDownloadCard] Download error:', err);
      setProgressStatus('Download failed. Check connection.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRegionalBundle(bundle.id);
      notifyChange();
    } catch (err) {
      console.warn('[RegionDownloadCard] Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] shadow-xs space-y-3 flex flex-col justify-between hover:shadow-sm transition-shadow">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E8F0FE] text-[#0B3D91] border border-[#D2E3FC]">
            {bundle.district} District
          </span>

          {isDownloaded ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#CEEAD6]">
              <CheckCircle2 className="w-3 h-3" />
              <span>Offline Ready</span>
            </span>
          ) : (
            <span className="text-[11px] text-[#5F6368]">
              ~{bundle.estimatedMb} MB package
            </span>
          )}
        </div>

        <div>
          <h3 className="text-[15px] font-medium text-[#202124]">{bundle.name}</h3>
          <p className="text-[12px] text-[#5F6368] leading-relaxed mt-0.5">
            {bundle.description}
          </p>
        </div>

        <div className="p-2.5 rounded-[4px] bg-[#F8F9FA] border border-[#DADCE0] text-[11px] text-[#5F6368] space-y-0.5">
          <div className="flex justify-between">
            <span>Zoom Range:</span>
            <span className="font-mono text-[#202124]">Levels {bundle.zoomRange[0]}–{bundle.zoomRange[1]}</span>
          </div>
          <div className="flex justify-between">
            <span>Places & Monasteries:</span>
            <span className="font-mono text-[#202124]">Included</span>
          </div>
        </div>

        {/* Progress Bar during active download */}
        {isDownloading && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-[#5F6368]">
              <span>{progressStatus}</span>
              <span className="font-mono font-medium text-[#0B3D91]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#F8F9FA] overflow-hidden border border-[#DADCE0]">
              <div
                className="h-full bg-[#0B3D91] transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="pt-2 border-t border-[#DADCE0] flex items-center justify-between gap-2">
        {isDownloaded ? (
          <>
            <span className="text-[11px] text-[#5F6368]">
              Downloaded: {downloadedMeta ? new Date(downloadedMeta.downloadedAt).toLocaleDateString() : 'Active'}
            </span>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-2.5 py-1 rounded-[4px] border border-[#FAD2CF] bg-[#FFFFFF] hover:bg-[#FCE8E6] text-[#D93025] text-[11px] font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
              <span>{isDeleting ? 'Removing...' : 'Delete Cache'}</span>
            </button>
          </>
        ) : (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-1.5 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[12px] font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Downloading Package...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Regional Data ({bundle.estimatedMb} MB)</span>
              </>
            )}
          </button>
        )}
      </div>

    </div>
  );
}
