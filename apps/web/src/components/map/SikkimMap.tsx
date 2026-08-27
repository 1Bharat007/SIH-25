'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import { Phone, Layers, ArrowRight, ShieldAlert, Building2, Utensils, Home, AlertTriangle } from 'lucide-react';
import { MapLayersResponse, MapFeatureItem, HazardAlertSummary } from '@sikkim-yatra/shared';


// Sikkim Geographic Center & Bounds
const SIKKIM_CENTER: [number, number] = [27.45, 88.55];
const DEFAULT_ZOOM = 9;

// Component to handle dynamic map repositioning
function MapController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 13, { duration: 1.5 });
    }
  }, [center, zoom, map]);

  return null;
}

// Generate rich HTML SVG divIcon for Leaflet markers
function createCustomIcon(type: string, severity?: string) {
  let bgColor = '#0fb49a';
  let iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

  switch (type) {
    case 'monastery':
    case 'cultural':
      bgColor = '#d97706'; // Amber / Monastery Gold
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V12a6 6 0 0 1 12 0v10"/><path d="M12 2v4"/><path d="M2 22h20"/></svg>`;
      break;
    case 'food':
      bgColor = '#10b981'; // Emerald
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 11v11"/><path d="M5 2v10c0 2 1 3 3 3h1v7"/><path d="M9 2v6"/></svg>`;
      break;
    case 'stay':
      bgColor = '#06b6d4'; // Cyan
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
      break;
    case 'vendor':
      bgColor = '#8b5cf6'; // Purple
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
      break;
    case 'hospital':
      bgColor = '#ef4444'; // Red
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12"/><path d="M6 12h12"/></svg>`;
      break;
    case 'police':
      bgColor = '#3b82f6'; // Blue
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>`;
      break;
    case 'helpline':
      bgColor = '#ec4899'; // Pink
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
      break;
    case 'hazard_zone':
      bgColor = severity === 'high' ? '#dc2626' : '#f59e0b';
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`;
      break;
  }


  const html = `
    <div style="
      background: ${bgColor};
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffffff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.4);
      cursor: pointer;
    ">
      <span style="
        transform: rotate(45deg);
        font-size: 16px;
        line-height: 1;
      ">${iconSvg}</span>
    </div>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

interface SikkimMapProps {
  data?: MapLayersResponse;
  selectedCoordinates?: [number, number];
  heightClass?: string;
  onMarkerSelect?: (feature: MapFeatureItem) => void;
}

export default function SikkimMap({
  data,
  selectedCoordinates,
  heightClass = 'h-[550px]',
  onMarkerSelect,
}: SikkimMapProps) {
  // Layer toggles
  const [showMonasteries, setShowMonasteries] = useState(true);
  const [showFood, setShowFood] = useState(true);
  const [showStays, setShowStays] = useState(true);
  const [showEmergency, setShowEmergency] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [isLegendOpen, setIsLegendOpen] = useState(true);

  const features = data?.features || [];
  const hazardZones = data?.hazardZones || [];

  // Filter features based on layer toggles
  const visibleFeatures = features.filter(item => {
    if ((item.markerType === 'monastery' || item.markerType === 'cultural') && !showMonasteries)
      return false;
    if (item.markerType === 'food' && !showFood) return false;
    if ((item.markerType === 'stay' || item.markerType === 'vendor') && !showStays) return false;
    if (
      (item.markerType === 'hospital' ||
        item.markerType === 'police' ||
        item.markerType === 'helpline') &&
      !showEmergency
    )
      return false;
    return true;
  });

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden rounded-3xl border border-emerald-500/30 shadow-2xl bg-[#021f1b]`}
    >
      <MapContainer
        center={selectedCoordinates || SIKKIM_CENTER}
        zoom={selectedCoordinates ? 12 : DEFAULT_ZOOM}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
        className="rounded-3xl"
      >
        {/* OpenStreetMap Carto Topo Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={selectedCoordinates} zoom={selectedCoordinates ? 13 : undefined} />

        {/* Hazard Alert Circles */}
        {showHazards &&
          hazardZones.map((hazard: HazardAlertSummary) => (
            <Circle
              key={hazard.id}
              center={[hazard.centerLat, hazard.centerLng]}
              radius={(hazard.radiusKm || 10) * 1000}
              pathOptions={{
                color: hazard.severity === 'high' ? '#ef4444' : '#f59e0b',
                fillColor: hazard.severity === 'high' ? '#ef4444' : '#f59e0b',
                fillOpacity: 0.25,
                weight: 2,
                dashArray: '6, 6',
              }}
            >
              <Popup className="sikkim-map-popup">
                <div className="p-3 text-slate-900">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Active Hazard Zone ({hazard.severity})</span>
                  </div>
                  <h4 className="mt-1 font-bold text-sm text-slate-900">{hazard.title}</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {hazard.description}
                  </p>
                  <div className="mt-2 text-[11px] font-medium text-slate-500">
                    District: {hazard.district} • Radius: {hazard.radiusKm} km
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* Map Point Markers */}
        {visibleFeatures.map(item => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={createCustomIcon(item.markerType)}
            eventHandlers={{
              click: () => onMarkerSelect?.(item),
            }}
          >
            <Popup className="sikkim-map-popup">
              <div className="w-64 overflow-hidden rounded-xl bg-slate-900 text-white p-3 shadow-xl">
                {item.thumbnailUrl && (
                  <div className="relative h-28 w-full overflow-hidden rounded-lg mb-2.5">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    {item.altitudeMeters && (
                      <span className="absolute top-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 backdrop-blur-sm">
                        {item.altitudeMeters}m
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-start justify-between gap-1">
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{item.title}</h4>
                    {item.subtitle && (
                      <p className="text-xs text-emerald-300/80 mt-0.5">{item.subtitle}</p>
                    )}
                  </div>
                  {item.rating && (
                    <span className="flex items-center text-xs font-bold text-amber-400">
                      ★ {item.rating.toFixed(1)}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2 text-xs">
                  <span className="capitalize text-emerald-400/90 text-[11px] font-medium">
                    {item.category.replace('_', ' ')}
                  </span>

                  {item.linkUrl ? (
                    <Link
                      href={item.linkUrl}
                      className="inline-flex items-center gap-1 font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : item.phone ? (
                    <a
                      href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1 font-semibold text-teal-300 hover:text-teal-200"
                    >
                      <Phone className="h-3 w-3" />
                      <span>{item.phone}</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Interactive Layer Legend */}
      <div className="absolute top-4 right-4 z-[500] max-w-xs">
        <div className="rounded-2xl border border-emerald-500/40 bg-slate-950/85 p-3.5 shadow-2xl backdrop-blur-md text-white text-xs">
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>Map Layers</span>
            </div>
            <button
              onClick={() => setIsLegendOpen(!isLegendOpen)}
              className="text-[11px] text-emerald-400/80 hover:text-emerald-300 underline"
            >
              {isLegendOpen ? 'Collapse' : 'Expand'}
            </button>
          </div>

          {isLegendOpen && (
            <div className="space-y-2">
              {/* Monasteries */}
              <label className="flex items-center justify-between gap-2 cursor-pointer hover:opacity-90">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs">
                    <Building2 className="w-3 h-3" />
                  </span>
                  <span>Monasteries & Heritage</span>
                </div>
                <input
                  type="checkbox"
                  checked={showMonasteries}
                  onChange={e => setShowMonasteries(e.target.checked)}
                  className="rounded border-emerald-500/40 text-amber-500 focus:ring-amber-400"
                />
              </label>

              {/* Food */}
              <label className="flex items-center justify-between gap-2 cursor-pointer hover:opacity-90">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                    <Utensils className="w-3 h-3" />
                  </span>
                  <span>Restaurants & Cafes</span>
                </div>
                <input
                  type="checkbox"
                  checked={showFood}
                  onChange={e => setShowFood(e.target.checked)}
                  className="rounded border-emerald-500/40 text-emerald-500 focus:ring-emerald-400"
                />
              </label>

              {/* Stays */}
              <label className="flex items-center justify-between gap-2 cursor-pointer hover:opacity-90">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-xs">
                    <Home className="w-3 h-3" />
                  </span>
                  <span>Homestays & Vendors</span>
                </div>
                <input
                  type="checkbox"
                  checked={showStays}
                  onChange={e => setShowStays(e.target.checked)}
                  className="rounded border-emerald-500/40 text-cyan-500 focus:ring-cyan-400"
                />
              </label>

              {/* Emergency */}
              <label className="flex items-center justify-between gap-2 cursor-pointer hover:opacity-90">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-xs">
                    <ShieldAlert className="w-3 h-3" />
                  </span>
                  <span>Hospitals & Police (24x7)</span>
                </div>
                <input
                  type="checkbox"
                  checked={showEmergency}
                  onChange={e => setShowEmergency(e.target.checked)}
                  className="rounded border-emerald-500/40 text-rose-500 focus:ring-rose-400"
                />
              </label>

              {/* Hazards */}
              <label className="flex items-center justify-between gap-2 cursor-pointer hover:opacity-90">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-red-400 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                  </span>
                  <span>Active Hazard Advisories</span>
                </div>
                <input
                  type="checkbox"
                  checked={showHazards}
                  onChange={e => setShowHazards(e.target.checked)}
                  className="rounded border-emerald-500/40 text-rose-500 focus:ring-rose-400"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

