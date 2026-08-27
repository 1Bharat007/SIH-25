'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ShieldAlert,
  AlertTriangle,
  Compass,
  Building2,
  Phone,
  Radio,
  MapPin,
  CheckCircle2,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  SafeRouteDetour,
  SafeShelter,
  EvacuationGuideline,
  DisasterType,
  SikkimDistrict,
} from '@sikkim-yatra/shared';
import { useRealtimeAlerts } from '../../hooks/useRealtimeAlerts';
import { useAlertProximity } from '../../hooks/useAlertProximity';
import {
  fetchSafeRouteDetours,
  fetchSafeShelters,
  fetchEvacuationGuidelines,
} from '../../services/disaster.service';
import SafeRouteNavigationModal from '../../components/disaster/SafeRouteNavigationModal';
import AdminAlertManager from '../../components/disaster/AdminAlertManager';

// Dynamic import Leaflet components for SSR safety
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
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

type ActiveTab = 'hazards_map' | 'safe_detours' | 'evacuation' | 'shelters' | 'admin';

export default function DisasterCenterPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('hazards_map');
  const [selectedHazardFilter, setSelectedHazardFilter] = useState<string>('all');
  const [selectedShelterDistrict, setSelectedShelterDistrict] = useState<SikkimDistrict | 'all'>('all');
  const [detours, setDetours] = useState<SafeRouteDetour[]>([]);
  const [shelters, setShelters] = useState<(SafeShelter & { distanceKm?: number })[]>([]);
  const [guidelines, setGuidelines] = useState<EvacuationGuideline[]>([]);
  const [activeGuidelineType, setActiveGuidelineType] = useState<DisasterType>('landslide');
  const [selectedDetourForModal, setSelectedDetourForModal] = useState<SafeRouteDetour | null>(null);


  const {
    alerts,
    activeAlerts,
    connectionStatus,
    refreshAlerts,
  } = useRealtimeAlerts();

  const {
    currentCoords,
    activePresetName,
    presets,
    selectPresetLocation,
    enableLiveGps,
    distanceKm,
  } = useAlertProximity();

  useEffect(() => {
    fetchSafeRouteDetours()
      .then((data) => setDetours(data))
      .catch((err) => console.warn('Failed to load detours:', err));

    fetchSafeShelters(currentCoords.lat, currentCoords.lng)
      .then((data) => setShelters(data))
      .catch((err) => console.warn('Failed to load shelters:', err));

    fetchEvacuationGuidelines()
      .then((data) => setGuidelines(data))
      .catch((err) => console.warn('Failed to load guidelines:', err));
  }, [currentCoords]);

  const filteredAlerts = activeAlerts.filter((alert) => {
    if (selectedHazardFilter === 'all') return true;
    return alert.type === selectedHazardFilter;
  });

  const activeGuideline =
    guidelines.find((g) => g.hazardType === activeGuidelineType) || guidelines[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100 pb-20">
      {/* Top Banner Header */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-red-950/60 via-slate-900/90 to-slate-950 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  SSDMA Real-Time Disaster Center
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {connectionStatus === 'connected'
                    ? 'WebSocket Stream Live'
                    : 'Real-time Polling Stream'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Sikkim Mountain Hazard & Disaster Response Hub
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Official real-time disaster management network. Monitor landslides, road blockades, Teesta GLOF flood warnings, and discover alternate safe bypass routes.
              </p>
            </div>

            {/* Quick Action Box */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/safety"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 border border-red-400/40"
              >
                <ShieldAlert className="w-4 h-4 animate-pulse" />
                <span>Emergency SOS Module</span>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto gap-2 mt-8 pt-4 border-t border-white/10 scrollbar-none">
            <button
              onClick={() => setActiveTab('hazards_map')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'hazards_map'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Live Hazards & Map ({activeAlerts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('safe_detours')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'safe_detours'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Safe-Route Detours ({detours.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('evacuation')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'evacuation'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Evacuation Protocols</span>
            </button>

            <button
              onClick={() => setActiveTab('shelters')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'shelters'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Emergency Shelters ({shelters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'admin'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Admin Broadcast Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* TAB 1: LIVE HAZARDS & MAP */}
        {activeTab === 'hazards_map' && (
          <div className="space-y-6">
            {/* GPS Simulation Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-white/80 font-medium">
                  Traveler Simulated Location: <strong className="text-white">{activePresetName}</strong>
                </span>
                {distanceKm !== null && (
                  <span className="text-xs text-amber-300 font-bold ml-2">
                    ({distanceKm} km from nearest hazard)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => selectPresetLocation(preset)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex-shrink-0 ${
                      activePresetName === preset.name
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    {preset.name.split(' ')[0]}
                  </button>
                ))}
                <button
                  onClick={() => enableLiveGps()}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-semibold flex-shrink-0"
                >
                  Live GPS
                </button>
              </div>
            </div>

            {/* Interactive Hazard Map */}
            <div className="rounded-2xl overflow-hidden border border-white/15 bg-slate-900 shadow-2xl relative h-[480px]">
              {typeof window !== 'undefined' && (
                <MapContainer
                  center={[27.45, 88.55]}
                  zoom={9}
                  className="w-full h-full"
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Active Hazard Danger Circles */}
                  {activeAlerts.map((alert) => {
                    const isCrit = alert.severity === 'critical' || alert.severity === 'high';
                    return (
                      <Circle
                        key={alert.id}
                        center={[alert.centerLat, alert.centerLng]}
                        radius={(alert.radiusKm || 5) * 1000}
                        pathOptions={{
                          color: isCrit ? '#ef4444' : '#f59e0b',
                          fillColor: isCrit ? '#dc2626' : '#d97706',
                          fillOpacity: 0.35,
                          weight: 3,
                        }}
                      >
                        <Popup>
                          <div className="p-2 text-xs">
                            <span className="font-bold text-red-600 uppercase block">
                              {alert.type.toUpperCase()}: {alert.severity.toUpperCase()}
                            </span>
                            <strong className="block mt-1">{alert.title}</strong>
                            <p className="text-slate-700 mt-1">{alert.affectedCorridor}</p>
                            <p className="text-slate-600 text-[11px] mt-1 italic">
                              {alert.recommendedAction}
                            </p>
                          </div>
                        </Popup>
                      </Circle>
                    );
                  })}

                  {/* User Location Marker */}
                  <Circle
                    center={[currentCoords.lat, currentCoords.lng]}
                    radius={500}
                    pathOptions={{ color: '#3b82f6', fillColor: '#60a5fa', fillOpacity: 0.9 }}
                  >
                    <Popup>
                      <div className="p-2 text-xs">
                        <strong>Traveler Position</strong>
                        <p className="text-slate-600">{activePresetName}</p>
                      </div>
                    </Popup>
                  </Circle>

                </MapContainer>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['all', 'landslide', 'heavy_snowfall', 'flash_flood', 'road_closure'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedHazardFilter(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize flex-shrink-0 ${
                    selectedHazardFilter === type
                      ? 'bg-white text-slate-950 font-bold'
                      : 'bg-slate-900 border border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Active Hazard Cards Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-white/10 shadow-xl space-y-3 hover:border-red-500/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40">
                        {alert.severity}
                      </span>
                      <span className="text-xs text-white/50">{alert.district} District</span>
                    </div>
                    <span className="text-[11px] text-white/40">Radius: {alert.radiusKm} km</span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-tight">{alert.title}</h3>
                  <p className="text-xs text-amber-200 font-medium">{alert.affectedCorridor}</p>
                  <p className="text-xs text-white/70 leading-relaxed">{alert.description}</p>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white/90">
                    <strong className="text-emerald-300 block mb-0.5">Advisory Action:</strong>
                    {alert.recommendedAction}
                  </div>

                  {alert.alternateRouteId && (
                    <button
                      onClick={() => {
                        const d = detours.find((item) => item.id === alert.alternateRouteId);
                        if (d) setSelectedDetourForModal(d);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>View Safe Detour Route</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SAFE-ROUTE DETOUR NAVIGATOR */}
        {activeTab === 'safe_detours' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                Himalayan Safe Detour Navigation Engine
              </h3>
              <p className="text-xs text-white/70 mt-1 max-w-2xl">
                When major arteries like NH10 or high passes are blocked by rockfall or snow, our data-driven engine provides verified alternate bypass routes with checkpoint waypoints.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {detours.map((detour) => (
                <div
                  key={detour.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-4 hover:border-emerald-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {detour.roadStatus.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-amber-400 font-bold">
                        ★ {detour.safetyRating.toFixed(1)}/5.0
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white leading-tight">{detour.title}</h4>

                    <div className="text-xs text-red-300 bg-red-950/40 p-2.5 rounded-xl border border-red-500/20">
                      <strong className="text-red-400 block text-[10px] uppercase">
                        Avoids Blocked Corridor:
                      </strong>
                      {detour.blockedCorridor}
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
                      {detour.overview}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center text-xs">
                      <div className="p-2 rounded-lg bg-black/30">
                        <span className="text-[10px] text-white/40 block">Distance</span>
                        <strong className="text-white">{detour.detourDistanceKm} km</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-black/30">
                        <span className="text-[10px] text-white/40 block">Est. Time</span>
                        <strong className="text-white">{detour.estimatedTravelTimeMinutes} min</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDetourForModal(detour)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <span>Inspect Waypoints & Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EVACUATION PROTOCOLS */}
        {activeTab === 'evacuation' && (
          <div className="space-y-6">
            {/* Hazard Selector Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { type: 'landslide' as DisasterType, label: 'Landslide & Rockfall' },
                { type: 'flash_flood' as DisasterType, label: 'Teesta GLOF & Flash Flood' },
                { type: 'earthquake' as DisasterType, label: 'Seismic Earthquake' },
                { type: 'heavy_snowfall' as DisasterType, label: 'Blizzard & Snow Stranding' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setActiveGuidelineType(item.type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                    activeGuidelineType === item.type
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-900 border border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {activeGuideline && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Steps & Guidance */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 shadow-xl space-y-4">
                    <h3 className="text-xl font-bold text-white">{activeGuideline.title}</h3>
                    <p className="text-xs text-white/70 leading-relaxed">{activeGuideline.summary}</p>

                    <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-300">
                        Immediate Action Directives
                      </h4>
                      <ul className="space-y-1.5 text-xs text-red-100 list-disc list-inside">
                        {activeGuideline.immediateActions.map((action, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sequential Steps */}
                  <div className="space-y-4">
                    {activeGuideline.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-5 rounded-2xl bg-slate-900 border border-white/10 shadow-xl space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                            {step.stepNumber}
                          </span>
                          <h4 className="font-bold text-sm text-white">{step.actionTitle}</h4>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed pl-8">{step.details}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8 pt-2">
                          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
                            <strong className="text-emerald-300 block mb-1">Recommended Action:</strong>
                            <ul className="space-y-1 text-emerald-100/80 list-disc list-inside text-[11px]">
                              {step.doList.map((d, i) => (
                                <li key={i}>{d}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs">
                            <strong className="text-rose-300 block mb-1">Hazard Warning (Avoid):</strong>
                            <ul className="space-y-1 text-rose-100/80 list-disc list-inside text-[11px]">
                              {step.dontList.map((d, i) => (
                                <li key={i}>{d}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kit & Helplines Sidebar */}
                <div className="space-y-5">
                  {/* Emergency Kit Checklist */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 shadow-xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <span>72-Hour Mountain Survival Kit</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-white/80">
                      {activeGuideline.emergencyKitList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 24x7 Helplines */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 shadow-xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                      <span>24x7 Emergency Helplines</span>
                    </h4>
                    <div className="space-y-2.5">
                      {activeGuideline.helplines.map((line) => (
                        <div
                          key={line.name}
                          className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between"
                        >
                          <div>
                            <strong className="text-xs text-white block">{line.name}</strong>
                            <span className="text-[10px] text-white/50">{line.hours}</span>
                          </div>
                          <a
                            href={`tel:${line.phone}`}
                            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Safe Shelters & Evacuation Centers */}
        {activeTab === 'shelters' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Safe Relief Camps & Evacuation Centers</h3>
                <p className="text-xs text-white/60">
                  Designated high-ground relief centers equipped with power backups, food supplies, and trauma care
                </p>
              </div>

              {/* District Filter */}
              <select
                value={selectedShelterDistrict}
                onChange={(e) => setSelectedShelterDistrict(e.target.value as SikkimDistrict | 'all')}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none cursor-pointer"
              >
                <option value="all">All Sikkim Districts</option>
                <option value="Gangtok">Gangtok District</option>
                <option value="Mangan">Mangan (North Sikkim)</option>
                <option value="Gyalshing">Gyalshing (West Sikkim)</option>
                <option value="Namchi">Namchi (South Sikkim)</option>
                <option value="Pakyong">Pakyong District</option>
                <option value="Soreng">Soreng District</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {shelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-white/10 shadow-xl space-y-4 hover:border-purple-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {shelter.district} District
                      </span>
                      {shelter.distanceKm !== undefined && (
                        <span className="text-xs font-bold text-emerald-400">
                          {shelter.distanceKm} km away
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white leading-tight">{shelter.name}</h4>
                    {shelter.localName && (
                      <p className="text-xs text-white/50">{shelter.localName}</p>
                    )}

                    <div className="space-y-1 text-xs text-white/70">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        <span>{shelter.address}</span>
                      </p>
                      <p className="text-[11px] text-white/50 pl-5">Altitude: {shelter.altitudeMeters} m</p>
                    </div>

                    {/* Capacity & Readiness Badges */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-white/60">Capacity:</span>
                        <strong className="text-white">
                          {shelter.currentOccupancy} / {shelter.capacityPersons} Persons
                        </strong>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {shelter.hasMedicalPost && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold">
                            Trauma Ward
                          </span>
                        )}
                        {shelter.hasEmergencyPower && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-semibold">
                            Backup Power
                          </span>
                        )}
                        {shelter.hasSatelliteComms && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-semibold">
                            Sat-Comms
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <a
                    href={`tel:${shelter.contactPhone}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Shelter ({shelter.contactPhone})</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN BROADCAST CONSOLE */}
        {activeTab === 'admin' && (
          <AdminAlertManager alerts={alerts} onAlertsChanged={refreshAlerts} />
        )}
      </main>

      {/* Detour Navigation Modal */}
      {selectedDetourForModal && (
        <SafeRouteNavigationModal
          detour={selectedDetourForModal}
          onClose={() => setSelectedDetourForModal(null)}
        />
      )}
    </div>
  );
}
