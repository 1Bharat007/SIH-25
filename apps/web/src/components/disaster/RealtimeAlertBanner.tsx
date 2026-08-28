'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';

import { useAlertProximity } from '../../hooks/useAlertProximity';
import SafeRouteNavigationModal from './SafeRouteNavigationModal';

export default function RealtimeAlertBanner() {
  const {
    isInDangerZone,
    isInWarningZone,
    nearestAlert,
    distanceKm,
    alternateRoute,
    activePresetName,
    presets,
    selectPresetLocation,
    enableLiveGps,
    isUsingLiveGps,
  } = useAlertProximity();

  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showGpsPicker, setShowGpsPicker] = useState<boolean>(false);
  const [showDetourModal, setShowDetourModal] = useState<boolean>(false);

  // If dismissed or no alerts to warn about
  if ((!isInDangerZone && !isInWarningZone && !nearestAlert) || (isDismissed && !isInDangerZone)) {
    return null;
  }

  const isCritical = nearestAlert?.severity === 'critical' || nearestAlert?.severity === 'high';
  const bannerBg = isInDangerZone
    ? 'bg-[#FCE8E6] border-[#FAD2CF] text-[#C5221F]'
    : isCritical
      ? 'bg-[#FEF7E0] border-[#FEEFC3] text-[#B06000]'
      : 'bg-[#E8F0FE] border-[#D2E3FC] text-[#0B3D91]';

  return (
    <>
      <aside
        aria-label="Emergency Hazard Advisory"
        className={`w-full border-b text-[13px] transition-colors ${bannerBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Icon & Title */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">
                    {isInDangerZone
                      ? 'EMERGENCY ADVISORY: ACTIVE HAZARD ZONE'
                      : isCritical
                        ? 'WEATHER & ROAD ADVISORY'
                        : 'Sikkim Road Status'}
                  </span>
                  {nearestAlert && (
                    <span className="truncate text-[12px]">
                      — {nearestAlert.title}
                      {distanceKm !== null && ` (${distanceKm.toFixed(1)} km away)`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {alternateRoute && (
                <button
                  onClick={() => setShowDetourModal(true)}
                  className="px-2.5 py-1 rounded-[4px] bg-[#0B3D91] text-[#FFFFFF] hover:bg-[#082E6E] text-[12px] font-medium transition-colors"
                >
                  View Detour
                </button>
              )}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-[4px] hover:bg-[#000000]/5 text-current"
                aria-label="Toggle Alert Details"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {!isInDangerZone && (
                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-1 rounded-[4px] hover:bg-[#000000]/5 text-current"
                  aria-label="Dismiss Advisory"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Expanded Drawer Details */}
          {isExpanded && (
            <div className="mt-2 pt-2 border-t border-current/20 text-[12px] space-y-2">
              {nearestAlert?.description && (
                <p className="leading-relaxed">{nearestAlert.description}</p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <span>Simulated Location: <strong className="font-medium">{activePresetName}</strong></span>
                  <button
                    onClick={() => setShowGpsPicker(!showGpsPicker)}
                    className="underline hover:no-underline text-[11px]"
                  >
                    Change
                  </button>
                </div>

                <Link
                  href="/disaster"
                  className="inline-flex items-center gap-1 font-medium underline hover:no-underline text-[12px]"
                >
                  <span>Open Full Disaster Control Center</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {showGpsPicker && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => enableLiveGps()}
                    className={`px-2 py-0.5 rounded-[4px] text-[11px] border ${
                      isUsingLiveGps
                        ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                        : 'bg-[#FFFFFF] text-[#202124] border-[#DADCE0]'
                    }`}
                  >
                    Use Device GPS
                  </button>
                  {presets.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => selectPresetLocation(p)}
                      className={`px-2 py-0.5 rounded-[4px] text-[11px] border ${
                        activePresetName === p.name
                          ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                          : 'bg-[#FFFFFF] text-[#202124] border-[#DADCE0]'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {showDetourModal && alternateRoute && (
        <SafeRouteNavigationModal
          detour={alternateRoute}
          onClose={() => setShowDetourModal(false)}
        />
      )}
    </>
  );
}

