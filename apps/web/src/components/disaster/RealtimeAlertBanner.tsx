'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Compass,
  Building2,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Radio,
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
    ? 'bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border-red-500/80 text-red-50'
    : isCritical
    ? 'bg-gradient-to-r from-amber-950 via-amber-900 to-orange-950 border-amber-500/80 text-amber-50'
    : 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-blue-500/50 text-blue-50';

  return (
    <>
      <aside
        aria-label="Emergency Hazard Advisory"
        className={`sticky top-0 z-50 w-full border-b shadow-2xl transition-all duration-300 backdrop-blur-md ${bannerBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Pulsing Icon & Title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <span className="flex h-3.5 w-3.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isInDangerZone ? 'bg-red-400' : 'bg-amber-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                      isInDangerZone ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                  />
                </span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-300 animate-pulse" />
                <div className="truncate">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 border border-white/20 mr-2">
                    {isInDangerZone
                      ? '🚨 DANGER ZONE'
                      : isInWarningZone
                      ? '⚠️ HAZARD ADVISORY'
                      : 'MOUNTAIN ALERT'}
                  </span>
                  <strong className="text-sm font-semibold text-white truncate">
                    {nearestAlert?.title || 'Active Mountain Hazard Detected'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Middle: Distance Ticker */}
            {distanceKm !== null && (
              <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/30 text-xs text-white/90 border border-white/10 flex-shrink-0">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>
                  <strong>{distanceKm} km</strong> from {activePresetName}
                </span>
              </div>
            )}

            {/* Right: Quick Action Buttons & Toggles */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {alternateRoute && (
                <button
                  onClick={() => setShowDetourModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-emerald-500/30 transition-all flex items-center gap-1.5 border border-emerald-400/40"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Safe Detour</span>
                  <span className="sm:hidden">Detour</span>
                </button>
              )}

              <Link
                href="/disaster"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all flex items-center gap-1.5 border border-white/20"
              >
                <Building2 className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Disaster Center</span>
                <ExternalLink className="w-3 h-3 text-white/70" />
              </Link>

              {/* GPS Simulator Picker Toggle */}
              <button
                onClick={() => setShowGpsPicker(!showGpsPicker)}
                title="Test GPS locations in Sikkim"
                className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white/80 text-xs border border-white/10 flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline text-[11px]">GPS Test</span>
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 transition-colors"
                title={isExpanded ? 'Collapse advisory' : 'Expand advisory'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {!isInDangerZone && (
                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  title="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Expanded Advisory Details Drawer */}
          {isExpanded && nearestAlert && (
            <div className="mt-3 pt-3 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-white/90 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-white/60 font-semibold uppercase tracking-wider text-[10px]">
                  Affected Mountain Corridor
                </span>
                <p className="font-medium text-amber-200">{nearestAlert.affectedCorridor}</p>
                <p className="text-white/70 text-[11px] leading-relaxed">{nearestAlert.description}</p>
              </div>

              <div className="space-y-1">
                <span className="text-white/60 font-semibold uppercase tracking-wider text-[10px]">
                  Recommended Safety Action
                </span>
                <p className="text-white/90 leading-relaxed font-medium bg-black/30 p-2 rounded-lg border border-white/10">
                  {nearestAlert.recommendedAction}
                </p>
              </div>

              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-white/60 font-semibold uppercase tracking-wider text-[10px]">
                    Authority & Status
                  </span>
                  <p className="text-white/80 font-medium">{nearestAlert.sourceAuthority}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300 border border-red-500/40">
                      <Radio className="w-2.5 h-2.5 animate-pulse" />
                      Live Broadcast (WS)
                    </span>
                    <span className="text-white/50 text-[10px]">
                      Radius: {nearestAlert.radiusKm} km
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {alternateRoute && (
                    <button
                      onClick={() => setShowDetourModal(true)}
                      className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center transition-all shadow"
                    >
                      🧭 View {alternateRoute.title}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* GPS Simulation / Live Location Switcher Dropdown */}
          {showGpsPicker && (
            <div className="mt-3 p-3 rounded-xl bg-slate-900/95 border border-white/20 text-white shadow-2xl backdrop-blur-xl animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Sikkim GPS Proximity Testing Console
                  </h4>
                </div>
                <button
                  onClick={() => enableLiveGps()}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${
                    isUsingLiveGps
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white/90'
                  }`}
                >
                  📡 Use Device Live GPS
                </button>
              </div>
              <p className="text-[11px] text-white/70 mb-2">
                Test how the real-time proximity alert and detour engine responds as a traveler moves across Sikkim:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {presets.map((preset) => {
                  const isCurrent = activePresetName === preset.name;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => {
                        selectPresetLocation(preset);
                        setShowGpsPicker(false);
                      }}
                      className={`p-2 rounded-lg text-left transition-all border ${
                        isCurrent
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-md ring-1 ring-emerald-400'
                          : 'bg-black/30 hover:bg-black/50 border-white/10 text-white/80 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white truncate">{preset.name}</div>
                      <div className="text-[10px] text-white/60 truncate">{preset.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Alternate Safe Detour Modal */}
      {showDetourModal && alternateRoute && (
        <SafeRouteNavigationModal
          detour={alternateRoute}
          hazardAlert={nearestAlert || undefined}
          onClose={() => setShowDetourModal(false)}
        />
      )}
    </>
  );
}
