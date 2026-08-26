'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  X,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Truck,
  MapPin,
  Phone,
} from 'lucide-react';
import { SafeRouteDetour, DisasterAlert } from '@sikkim-yatra/shared';

// Dynamic import Leaflet components for SSR safety
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface SafeRouteNavigationModalProps {
  detour: SafeRouteDetour;
  hazardAlert?: DisasterAlert;
  onClose: () => void;
}

export default function SafeRouteNavigationModal({
  detour,
  hazardAlert,
  onClose,
}: SafeRouteNavigationModalProps) {
  const [activeWaypointIndex, setActiveWaypointIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'turn_by_turn' | 'map'>('turn_by_turn');

  const waypoints = detour.waypoints || [];
  const firstWaypoint = waypoints[0];
  const mapCenter: [number, number] = firstWaypoint
    ? [firstWaypoint.latitude, firstWaypoint.longitude]
    : [27.33, 88.55];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Alternate Safe Corridor
                </span>
                <span className="text-xs text-white/60">
                  Safety Rating: <strong className="text-amber-400">★ {detour.safetyRating.toFixed(1)}/5.0</strong>
                </span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight mt-0.5">{detour.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hazard Warning Block */}
        <div className="px-6 py-3 bg-red-950/60 border-b border-red-500/30 flex items-start gap-3 text-xs text-red-200">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold uppercase tracking-wider text-red-400 mr-2">
              BLOCKED / HAZARD CORRIDOR:
            </span>
            <strong className="text-white">{detour.blockedCorridor}</strong>
            {hazardAlert && (
              <p className="text-red-300/80 text-[11px] mt-0.5">
                Cause: {hazardAlert.title} — {hazardAlert.recommendedAction}
              </p>
            )}
          </div>
        </div>

        {/* Quick Detour Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3.5 bg-slate-950/60 border-b border-white/10 text-center">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-white/50 uppercase font-semibold">Detour Distance</span>
            <p className="text-base font-bold text-emerald-400 mt-0.5">{detour.detourDistanceKm} km</p>
            <span className="text-[10px] text-white/40">(+{detour.detourDistanceKm - detour.normalDistanceKm} km detour)</span>
          </div>

          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-white/50 uppercase font-semibold">Estimated Time</span>
            <p className="text-base font-bold text-cyan-400 mt-0.5 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {detour.estimatedTravelTimeMinutes} min
            </p>
            <span className="text-[10px] text-white/40">mountain speed</span>
          </div>

          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-white/50 uppercase font-semibold">Road Status</span>
            <p className="text-xs font-bold text-emerald-300 mt-1 capitalize flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {detour.roadStatus.replace('_', ' ')}
            </p>
            <span className="text-[10px] text-emerald-400/80">BRO Verified</span>
          </div>

          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-white/50 uppercase font-semibold">Vehicle Advice</span>
            <p className="text-xs font-bold text-amber-300 mt-1 capitalize flex items-center justify-center gap-1">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              {detour.recommendedVehicleType.replace(/_/g, ' ')}
            </p>
            <span className="text-[10px] text-amber-400/80">Paved Ridge Road</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-white/10 bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => setViewMode('turn_by_turn')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
              viewMode === 'turn_by_turn'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            🧭 Turn-by-Turn Waypoints ({waypoints.length})
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
              viewMode === 'map'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            🗺️ Interactive Detour Map
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {viewMode === 'turn_by_turn' ? (
            <>
              {/* Route Overview */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
                  Corridor Strategy & Terrain
                </h4>
                <p className="text-sm text-white/80 leading-relaxed">{detour.overview}</p>
              </div>

              {/* Waypoint Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Sequential Navigation Checkpoints
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500/30">
                  {waypoints.map((wp, idx) => (
                    <div
                      key={wp.name}
                      onClick={() => setActiveWaypointIndex(idx)}
                      className={`relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                        activeWaypointIndex === idx
                          ? 'bg-emerald-950/40 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400/40'
                          : 'bg-black/20 hover:bg-black/40 border-white/10 text-white/80'
                      }`}
                    >
                      {/* Step Indicator Dot */}
                      <span
                        className={`absolute -left-6 top-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          activeWaypointIndex === idx
                            ? 'bg-emerald-500 text-black ring-4 ring-emerald-500/20'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        {idx + 1}
                      </span>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <h5 className="font-bold text-sm text-white">{wp.name}</h5>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-white/60">
                          <span>⛰️ {wp.elevationMeters} m</span>
                          <span>•</span>
                          <span className="text-emerald-300">Max {wp.safeSpeedKmph} km/h</span>
                        </div>
                      </div>

                      <p className="text-xs text-white/90 leading-relaxed mb-2 font-medium">
                        👉 {wp.instruction}
                      </p>

                      {wp.nearestAssistancePost && (
                        <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/20 w-fit">
                          <Phone className="w-3 h-3 text-cyan-400" />
                          <span>{wp.nearestAssistancePost}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Caution Notes */}
              {detour.cautionNotes && detour.cautionNotes.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-400" />
                    Mountain Pilot Advisory & Caution Notes
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-100/90 list-disc list-inside">
                    {detour.cautionNotes.map((note, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="h-[420px] rounded-xl overflow-hidden border border-white/20 relative">
              {typeof window !== 'undefined' && (
                <MapContainer
                  center={mapCenter}
                  zoom={11}
                  className="w-full h-full"
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Safe Detour Polyline (Green) */}
                  {detour.pathCoordinates && detour.pathCoordinates.length > 0 && (
                    <Polyline
                      positions={detour.pathCoordinates}
                      pathOptions={{ color: '#10b981', weight: 5, opacity: 0.9, dashArray: '8, 8' }}
                    />
                  )}

                  {/* Hazard Zone Circle (Red) */}
                  {hazardAlert && (
                    <Circle
                      center={[hazardAlert.centerLat, hazardAlert.centerLng]}
                      radius={(hazardAlert.radiusKm || 5) * 1000}
                      pathOptions={{
                        color: '#ef4444',
                        fillColor: '#ef4444',
                        fillOpacity: 0.3,
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <div className="p-2 text-xs">
                          <strong className="text-red-600 block">{hazardAlert.title}</strong>
                          <span>Blocked Hazard Zone</span>
                        </div>
                      </Popup>
                    </Circle>
                  )}

                  {/* Waypoint Markers */}
                  {waypoints.map((wp, idx) => (
                    <Circle
                      key={wp.name}
                      center={[wp.latitude, wp.longitude]}
                      radius={400}
                      pathOptions={{ color: '#059669', fillColor: '#34d399', fillOpacity: 0.8 }}
                    >
                      <Popup>
                        <div className="p-2 text-xs">
                          <strong>
                            Waypoint {idx + 1}: {wp.name}
                          </strong>
                          <p className="mt-1">{wp.instruction}</p>
                        </div>
                      </Popup>
                    </Circle>
                  ))}
                </MapContainer>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/50">
            Sikkim SDMA & BRO Certified Emergency Detour Route
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
