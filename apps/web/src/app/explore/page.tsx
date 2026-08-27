'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Mountain,
  Compass,
  ArrowRight,
  Wifi,
  WifiOff,
  ChevronRight,
  Map as MapIcon,
  Grid,
  ArrowLeft,
  FileCheck,
  Sparkles,
  Building2,
  Utensils,
  Home,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { SikkimDistrict, FilterCategory, MapFeatureItem, PlaceSummary } from '@sikkim-yatra/shared';
import { usePlacesQuery, useMapLayersQuery } from '../../hooks/useTourism';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import MapWrapper from '../../components/map/MapWrapper';

const DISTRICTS: (SikkimDistrict | 'all')[] = [
  'all',
  'Gangtok',
  'Mangan',
  'Namchi',
  'Gyalshing',
  'Pakyong',
  'Soreng',
];

const CATEGORIES: { key: FilterCategory; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'All Sights', icon: Sparkles },
  { key: 'culture', label: 'Monasteries & Culture', icon: Building2 },
  { key: 'food', label: 'Food & Dining', icon: Utensils },
  { key: 'stay', label: 'Homestays & Stays', icon: Home },
  { key: 'safety', label: 'Safety & 24x7 Helplines', icon: Shield },
  { key: 'hazard', label: 'Active Hazard Advisories', icon: AlertTriangle },
];


export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<FilterCategory>('all');
  const [district, setDistrict] = useState<SikkimDistrict | 'all'>('all');
  const [permitOnly, setPermitOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'grid'>('split');
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | undefined>(undefined);

  const { isOnline } = useOnlineStatus();

  // Centralized React Query Data Fetching
  const { data: places = [], isLoading: isPlacesLoading } = usePlacesQuery({
    search: search.trim() || undefined,
    category,
    district,
    permitRequired: permitOnly ? true : undefined,
  });

  const { data: mapLayers } = useMapLayersQuery();

  const handlePlaceCardClick = (place: PlaceSummary) => {
    setSelectedCoords([place.latitude, place.longitude]);
    if (viewMode === 'grid') {
      setViewMode('split');
    }
  };

  const handleMapMarkerSelect = (feature: MapFeatureItem) => {
    setSelectedCoords([feature.latitude, feature.longitude]);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#073b35] via-[#042420] to-[#011412] px-4 py-6 sm:px-6 lg:px-8">
      {/* Decorative Himalayan Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#0fb49a]/15 to-[#f59e0b]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Navigation Top Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-emerald-900/40 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back Home</span>
            </Link>

            <div className="h-4 w-[1px] bg-emerald-900/60" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                <Compass className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Sikkim Interactive Discovery
              </h1>
            </div>
          </div>

          {/* Network and Offline Ready Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md ${
                isOnline
                  ? 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                  : 'border border-amber-500/40 bg-amber-950/40 text-amber-300'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Online Telemetry</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-amber-400" />
                  <span>Offline Ready Mode</span>
                </>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl border border-emerald-500/30 bg-slate-950/50 p-1">
              <button
                onClick={() => setViewMode('split')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'split'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-emerald-300 hover:text-white'
                }`}
                title="Split Map & List View"
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'map'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-emerald-300 hover:text-white'
                }`}
                title="Full Map View"
              >
                <MapIcon className="h-3.5 w-3.5 inline" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-emerald-300 hover:text-white'
                }`}
                title="Grid Cards View"
              >
                <Grid className="h-3.5 w-3.5 inline" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar Panel */}
        <section className="mt-5 rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-4 shadow-xl backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400/80" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search monasteries, lakes, MG Marg, altitude, history..."
                className="w-full rounded-2xl border border-emerald-500/30 bg-slate-950/60 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-emerald-400/50 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* District Dropdown + Permit Filter */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 rounded-2xl border border-emerald-500/30 bg-slate-950/60 px-3 py-2 text-xs">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value as SikkimDistrict | 'all')}
                  className="bg-transparent text-emerald-200 outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">
                    All Districts (6)
                  </option>
                  {DISTRICTS.filter(d => d !== 'all').map(d => (
                    <option key={d} value={d} className="bg-slate-900 text-white">
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              {/* Protected Area Permit Toggle */}
              <button
                onClick={() => setPermitOnly(!permitOnly)}
                className={`flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-semibold transition-all border ${
                  permitOnly
                    ? 'border-amber-500/50 bg-amber-950/50 text-amber-300 shadow-sm'
                    : 'border-emerald-500/30 bg-slate-950/60 text-emerald-300 hover:bg-emerald-950/40'
                }`}
              >
                <FileCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>{permitOnly ? 'Permit Required' : 'All Permits'}</span>
              </button>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => {
              const active = category === cat.key;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md font-bold'
                      : 'border border-emerald-500/20 bg-slate-950/40 text-emerald-200 hover:bg-emerald-950/50 hover:border-emerald-500/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </section>

        {/* Main Content Layout (Map + Cards) */}
        <section className="mt-6">
          {viewMode === 'map' ? (
            /* Full Map View */
            <div className="space-y-4">
              <MapWrapper
                data={mapLayers}
                selectedCoordinates={selectedCoords}
                heightClass="h-[700px]"
                onMarkerSelect={handleMapMarkerSelect}
              />
            </div>
          ) : viewMode === 'grid' ? (
            /* Full Grid View */
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-emerald-300/80">
                  Showing {places.length} Sikkim destinations
                </p>
              </div>

              {isPlacesLoading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div
                      key={i}
                      className="h-72 animate-pulse rounded-3xl border border-emerald-500/20 bg-slate-900/40 p-4"
                    />
                  ))}
                </div>
              ) : places.length === 0 ? (
                <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/40 p-12 text-center">
                  <Mountain className="mx-auto h-12 w-12 text-emerald-400/50" />
                  <h3 className="mt-3 text-base font-bold text-white">No Sikkim places matched</h3>
                  <p className="mt-1 text-xs text-emerald-300/70">
                    Try adjusting your search keywords or category filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {places.map(place => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onSelect={() => handlePlaceCardClick(place)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Split View (Map on top / left, Places list) */
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left 7 Columns: Leaflet Interactive Map */}
              <div className="lg:col-span-7 space-y-4">
                <MapWrapper
                  data={mapLayers}
                  selectedCoordinates={selectedCoords}
                  heightClass="h-[520px] lg:h-[620px]"
                  onMarkerSelect={handleMapMarkerSelect}
                />
              </div>

              {/* Right 5 Columns: Place Cards List */}
              <div className="lg:col-span-5 space-y-4 max-h-[620px] overflow-y-auto pr-1">
                <div className="flex items-center justify-between sticky top-0 bg-[#042420]/90 backdrop-blur-md py-1 z-10">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Destinations</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[11px] text-emerald-300">
                      {places.length}
                    </span>
                  </h3>
                  <span className="text-[11px] text-emerald-400/70">Click card to focus map</span>
                </div>

                {isPlacesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="h-36 animate-pulse rounded-2xl border border-emerald-500/20 bg-slate-900/40"
                      />
                    ))}
                  </div>
                ) : places.length === 0 ? (
                  <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/40 p-8 text-center">
                    <p className="text-xs text-emerald-300/70">No places match your search.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {places.map(place => (
                      <PlaceCompactCard
                        key={place.id}
                        place={place}
                        onSelect={() => handlePlaceCardClick(place)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

// Full Grid Card Component
function PlaceCard({ place, onSelect }: { place: PlaceSummary; onSelect: () => void }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-900/60 shadow-xl backdrop-blur-md transition-all hover:border-emerald-500/50 hover:shadow-2xl flex flex-col justify-between">
      <div>
        {/* Card Image Banner */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-950">
          <img
            src={place.thumbnailUrl}
            alt={place.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

          {/* District & Category Pills */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 backdrop-blur-md border border-emerald-500/30">
              {place.district}
            </span>
            <span className="rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[11px] font-medium text-emerald-200 backdrop-blur-md capitalize">
              {place.category.replace('_', ' ')}
            </span>
          </div>

          {/* Altitude Badge */}
          {place.altitudeMeters && (
            <div className="absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 backdrop-blur-md border border-amber-500/40">
              {place.altitudeMeters} m
            </div>
          )}

          {/* Rating */}
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-xs font-bold text-amber-400">
            <span>★ {place.rating.toFixed(1)}</span>
            <span className="text-[11px] text-slate-400 font-normal">({place.reviewCount})</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight">
            {place.name}
          </h4>
          {place.localName && (
            <p className="mt-0.5 text-xs text-emerald-400/80 font-medium">{place.localName}</p>
          )}

          <p className="mt-2.5 text-xs text-emerald-200/75 line-clamp-2 leading-relaxed">
            {place.description}
          </p>

          {place.permitRequired && (
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-500/30">
              <FileCheck className="h-3 w-3" />
              <span>PAP Permit Required</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-5 pt-0 flex items-center justify-between border-t border-emerald-900/30 mt-2">
        <button
          onClick={onSelect}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>Focus on Map</span>
        </button>

        <Link
          href={`/places/${place.slug}`}
          className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20 transition-all"
        >
          <span>Details</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// Compact Card Component (Used in Split View list)
function PlaceCompactCard({ place, onSelect }: { place: PlaceSummary; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-3 shadow-md backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-slate-900/90 flex gap-3.5"
    >
      {/* Thumbnail */}
      <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-950">
        <img
          src={place.thumbnailUrl}
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {place.altitudeMeters && (
          <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
            {place.altitudeMeters}m
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              {place.district}
            </span>
            <span className="text-xs font-bold text-amber-400">★ {place.rating.toFixed(1)}</span>
          </div>

          <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
            {place.name}
          </h4>
          <p className="text-[11px] text-emerald-200/70 line-clamp-1 mt-0.5">{place.description}</p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-emerald-900/30 text-xs">
          <span className="text-[10px] text-emerald-300/80 capitalize">
            {place.category.replace('_', ' ')}
          </span>

          <Link
            href={`/places/${place.slug}`}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-white"
          >
            <span>Explore</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
