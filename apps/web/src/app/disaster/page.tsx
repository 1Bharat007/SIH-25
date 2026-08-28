'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  AlertTriangle,
  Compass,
  Building2,
  Phone,
  Radio,
  MapPin,
  CheckCircle2,
  Activity,
  ArrowLeft,
  ArrowRight,
  Shield,
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
    activeAlerts,
    connectionStatus,
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
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] pb-16">
      {/* Top Header Card */}
      <div className="bg-[#FFFFFF] border-b border-[#DADCE0]">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[12px] text-[#5F6368]">
              <Link href="/" className="text-[#0B3D91] hover:underline font-medium flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Portal Overview</span>
              </Link>
              <span>/</span>
              <span className="text-[#202124] font-medium">SSDMA Disaster Management</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
                <span className="w-2 h-2 rounded-full bg-[#1E8E3E] animate-pulse" />
                {connectionStatus === 'connected' ? 'WebSocket Stream Live' : 'Polling Active'}
              </span>

              <Link
                href="/safety"
                className="px-3 py-1.5 rounded-[4px] bg-[#D93025] hover:bg-[#C5221F] text-[#FFFFFF] text-[12px] font-medium transition-colors"
              >
                Emergency SOS
              </Link>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-[22px] font-medium text-[#202124] leading-tight">
              Sikkim Mountain Hazard & Disaster Response Hub
            </h1>
            <p className="text-[14px] text-[#5F6368] max-w-3xl leading-relaxed">
              Official real-time disaster management network. Monitor landslides, road blockades, Teesta GLOF flood warnings, and discover alternate safe bypass routes.
            </p>
          </div>

          {/* Navigation Tabs (Google Outlined Pill Style) */}
          <div className="flex overflow-x-auto gap-2 pt-2 border-t border-[#DADCE0] scrollbar-none text-[13px]">
            <button
              onClick={() => setActiveTab('hazards_map')}
              className={`px-3.5 py-1.5 rounded-full border transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'hazards_map'
                  ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                  : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Live Hazards & Map ({activeAlerts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('safe_detours')}
              className={`px-3.5 py-1.5 rounded-full border transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'safe_detours'
                  ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                  : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Safe Detours ({detours.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('evacuation')}
              className={`px-3.5 py-1.5 rounded-full border transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'evacuation'
                  ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                  : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Evacuation Protocols</span>
            </button>

            <button
              onClick={() => setActiveTab('shelters')}
              className={`px-3.5 py-1.5 rounded-full border transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'shelters'
                  ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                  : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Emergency Shelters ({shelters.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-1.5 rounded-full border transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                  : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Admin Broadcast Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* TAB 1: LIVE HAZARDS & MAP */}
        {activeTab === 'hazards_map' && (
          <div className="space-y-4">
            {/* GPS Simulation Toolbar */}
            <div className="p-3.5 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-[12px]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0B3D91]" />
                <span className="text-[#5F6368]">
                  Simulated Position: <strong className="text-[#202124]">{activePresetName}</strong>
                </span>
                {distanceKm !== null && (
                  <span className="text-[#B06000] font-medium ml-1">
                    ({distanceKm} km to nearest hazard)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => selectPresetLocation(preset)}
                    className={`px-2.5 py-1 rounded-[4px] text-[11px] font-medium border transition-colors ${
                      activePresetName === preset.name
                        ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                        : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    {preset.name.split(' ')[0]}
                  </button>
                ))}
                <button
                  onClick={() => enableLiveGps()}
                  className="px-2.5 py-1 rounded-[4px] bg-[#1A73E8] hover:bg-[#185ABC] text-[#FFFFFF] text-[11px] font-medium transition-colors"
                >
                  Live GPS
                </button>
              </div>
            </div>

            {/* Interactive Hazard Map */}
            <div className="rounded-[8px] overflow-hidden border border-[#DADCE0] bg-[#FFFFFF] shadow-sm relative h-[440px]">
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

                  {/* Active Hazard Circles */}
                  {activeAlerts.map((alert) => {
                    const isCrit = alert.severity === 'critical' || alert.severity === 'high';
                    return (
                      <Circle
                        key={alert.id}
                        center={[alert.centerLat, alert.centerLng]}
                        radius={(alert.radiusKm || 5) * 1000}
                        pathOptions={{
                          color: isCrit ? '#D93025' : '#E37400',
                          fillColor: isCrit ? '#D93025' : '#E37400',
                          fillOpacity: 0.3,
                          weight: 2,
                        }}
                      >
                        <Popup>
                          <div className="p-1 text-xs">
                            <strong className="text-red-700 block">{alert.title}</strong>
                            <p className="text-slate-700 mt-1">{alert.affectedCorridor}</p>
                            <p className="text-slate-600 text-[11px] mt-1">{alert.recommendedAction}</p>
                          </div>
                        </Popup>
                      </Circle>
                    );
                  })}

                  {/* User Marker */}
                  <Circle
                    center={[currentCoords.lat, currentCoords.lng]}
                    radius={500}
                    pathOptions={{ color: '#0B3D91', fillColor: '#1A73E8', fillOpacity: 0.8 }}
                  >
                    <Popup>
                      <div className="p-1 text-xs">
                        <strong>Current Position</strong>
                        <p>{activePresetName}</p>
                      </div>
                    </Popup>
                  </Circle>
                </MapContainer>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto text-[12px]">
              {['all', 'landslide', 'heavy_snowfall', 'flash_flood', 'road_closure'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedHazardFilter(type)}
                  className={`px-3 py-1 rounded-full border transition-colors font-medium capitalize shrink-0 ${
                    selectedHazardFilter === type
                      ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                      : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA]'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Active Hazard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] shadow-xs space-y-2.5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          alert.severity === 'critical' || alert.severity === 'high'
                            ? 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]'
                            : 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[11px] text-[#5F6368]">{alert.district} District</span>
                    </div>
                    <span className="text-[11px] text-[#5F6368]">Radius: {alert.radiusKm} km</span>
                  </div>

                  <h3 className="text-[14px] font-medium text-[#202124] leading-snug">{alert.title}</h3>
                  <p className="text-[12px] font-medium text-[#0B3D91]">{alert.affectedCorridor}</p>
                  <p className="text-[12px] text-[#5F6368] leading-relaxed">{alert.description}</p>

                  <div className="pt-2 border-t border-[#DADCE0] text-[11px] text-[#5F6368]">
                    <span className="font-medium text-[#202124]">Advisory: </span>
                    {alert.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SAFE DETOURS */}
        {activeTab === 'safe_detours' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detours.map((detour) => (
                <div
                  key={detour.id}
                  className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
                        Verified Safe Bypass
                      </span>
                      <span className="text-[11px] text-[#5F6368]">
                        +{detour.detourDistanceKm} km detour
                      </span>
                    </div>

                    <h3 className="text-[15px] font-medium text-[#202124]">{detour.title}</h3>
                    <p className="text-[12px] text-[#C5221F] font-medium">
                      Bypassing: {detour.blockedCorridor}
                    </p>
                    <p className="text-[12px] text-[#5F6368] leading-relaxed">{detour.overview}</p>
                  </div>

                  <div className="pt-2 border-t border-[#DADCE0] flex items-center justify-between">
                    <span className="text-[11px] text-[#5F6368]">
                      Est. ~{detour.estimatedTravelTimeMinutes} mins
                    </span>
                    <button
                      onClick={() => setSelectedDetourForModal(detour)}
                      className="px-3 py-1.5 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[12px] font-medium transition-colors flex items-center gap-1"
                    >
                      <span>Navigate Detour</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EVACUATION GUIDELINES */}
        {activeTab === 'evacuation' && (
          <div className="space-y-4">
            <div className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] shadow-xs space-y-4">
              <div className="flex flex-wrap gap-2 text-[12px]">
                {['landslide', 'flash_flood', 'heavy_snowfall', 'earthquake'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveGuidelineType(type as DisasterType)}
                    className={`px-3 py-1.5 rounded-full border transition-colors font-medium capitalize ${
                      activeGuidelineType === type
                        ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                        : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    {type.replace('_', ' ')} Guidelines
                  </button>
                ))}
              </div>

              {activeGuideline && (
                <div className="space-y-3 pt-2 border-t border-[#DADCE0]">
                  <h3 className="text-[16px] font-medium text-[#202124]">
                    {activeGuideline.title}
                  </h3>
                  <p className="text-[13px] text-[#5F6368] leading-relaxed">
                    {activeGuideline.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-[4px] bg-[#F8F9FA] border border-[#DADCE0] space-y-2">
                      <h4 className="text-[13px] font-medium text-[#137333]">
                        Immediate Action Steps
                      </h4>
                      <ul className="list-disc list-inside text-[12px] text-[#5F6368] space-y-1">
                        {activeGuideline.immediateActions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-[4px] bg-[#F8F9FA] border border-[#DADCE0] space-y-2">
                      <h4 className="text-[13px] font-medium text-[#0B3D91]">
                        Himalayan High Altitude Protocols
                      </h4>
                      <p className="text-[12px] text-[#5F6368] leading-relaxed">
                        {activeGuideline.himalayanTerrainNotes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: EMERGENCY SHELTERS */}
        {activeTab === 'shelters' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {shelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] shadow-xs space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E8F0FE] text-[#0B3D91] border border-[#D2E3FC]">
                        Capacity: {shelter.capacityPersons} persons
                      </span>
                      <span className="text-[11px] text-[#5F6368]">
                        {shelter.district}
                      </span>
                    </div>

                    <h3 className="text-[14px] font-medium text-[#202124]">{shelter.name}</h3>
                    <p className="text-[11px] text-[#5F6368]">{shelter.address}</p>

                    <div className="pt-1 text-[11px] text-[#5F6368]">
                      <span className="font-medium text-[#202124]">Facilities: </span>
                      <span>Medical: {shelter.hasMedicalPost ? 'Yes' : 'First-Aid'} • Satellite Comms: {shelter.hasSatelliteComms ? 'Active' : 'Radio'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DADCE0]">
                    <a
                      href={`tel:${shelter.contactPhone}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] py-1.5 text-[12px] font-medium text-[#0B3D91] hover:bg-[#F8F9FA] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact ({shelter.contactPhone})</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN BROADCAST CONSOLE */}
        {activeTab === 'admin' && (
          <div>
            <AdminAlertManager />
          </div>
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
