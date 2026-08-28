'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Mountain,
  Compass,
  ArrowRight,
  ArrowLeft,
  FileCheck,
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
  { key: 'all', label: 'All Destinations', icon: Compass },
  { key: 'culture', label: 'Monasteries & Heritage', icon: Building2 },
  { key: 'food', label: 'Food & Cuisine', icon: Utensils },
  { key: 'stay', label: 'Certified Homestays', icon: Home },
  { key: 'safety', label: 'Police & Hospitals', icon: Shield },
  { key: 'hazard', label: 'Road Advisories', icon: AlertTriangle },
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
    <main className="min-h-screen bg-[#F8F9FA] text-[#202124] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#5F6368]">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[#0B3D91] hover:underline font-medium flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portal Overview</span>
            </Link>
            <span>/</span>
            <span className="text-[#202124] font-medium">Interactive Places & Permits Explorer</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                isOnline
                  ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]'
                  : 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]'
              }`}
            >
              {isOnline ? 'Online Sync' : 'Offline Cache Active'}
            </span>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] p-0.5">
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded-[3px] text-[11px] font-medium transition-colors ${
                  viewMode === 'split'
                    ? 'bg-[#0B3D91] text-[#FFFFFF]'
                    : 'text-[#5F6368] hover:text-[#202124]'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-2.5 py-1 rounded-[3px] text-[11px] font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-[#0B3D91] text-[#FFFFFF]'
                    : 'text-[#5F6368] hover:text-[#202124]'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-[3px] text-[11px] font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#0B3D91] text-[#FFFFFF]'
                    : 'text-[#5F6368] hover:text-[#202124]'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar Panel */}
        <section className="rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-4 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)] space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <label htmlFor="explore-search" className="sr-only">Search Places</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F6368]" />
              <input
                id="explore-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search monasteries, lakes, Nathula Pass, altitude, permits..."
                className="w-full h-10 pl-9 pr-4 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#0B3D91]"
              />
            </div>

            {/* District Dropdown + Permit Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Filter by district"
                value={district}
                onChange={(e) => setDistrict(e.target.value as SikkimDistrict | 'all')}
                className="h-10 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[12px] text-[#202124] focus:outline-none focus:border-[#0B3D91]"
              >
                <option value="all">All Districts (6)</option>
                {DISTRICTS.filter((d) => d !== 'all').map((d) => (
                  <option key={d} value={d}>
                    {d} District
                  </option>
                ))}
              </select>

              <button
                onClick={() => setPermitOnly(!permitOnly)}
                className={`h-10 px-3 rounded-[4px] border text-[12px] font-medium transition-colors flex items-center gap-1.5 ${
                  permitOnly
                    ? 'border-[#0B3D91] bg-[#E8F0FE] text-[#0B3D91]'
                    : 'border-[#DADCE0] bg-[#FFFFFF] text-[#5F6368] hover:bg-[#F8F9FA]'
                }`}
              >
                <FileCheck className="h-3.5 w-3.5" />
                <span>{permitOnly ? 'Protected Area Permits Only' : 'All Permit Types'}</span>
              </button>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex gap-1.5 overflow-x-auto pt-1 border-t border-[#DADCE0] text-[12px]">
            {CATEGORIES.map((cat) => {
              const active = category === cat.key;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`flex shrink-0 items-center gap-1.5 px-3 py-1 rounded-full border transition-colors font-medium ${
                    active
                      ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                      : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA]'
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
        <section>
          {viewMode === 'map' ? (
            /* Full Map View */
            <div className="rounded-[8px] overflow-hidden border border-[#DADCE0] bg-[#FFFFFF] shadow-xs">
              <MapWrapper
                data={mapLayers}
                selectedCoordinates={selectedCoords}
                heightClass="h-[680px]"
                onMarkerSelect={handleMapMarkerSelect}
              />
            </div>
          ) : viewMode === 'grid' ? (
            /* Full Grid View */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[12px] text-[#5F6368]">
                <span>Showing {places.length} Sikkim destinations</span>
              </div>

              {isPlacesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 animate-pulse rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0]" />
                  ))}
                </div>
              ) : places.length === 0 ? (
                <div className="rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-12 text-center space-y-1">
                  <Mountain className="mx-auto h-10 w-10 text-[#5F6368]" />
                  <h3 className="text-[15px] font-medium text-[#202124]">No destinations matched</h3>
                  <p className="text-[12px] text-[#5F6368]">Try clearing your search query or selecting "All Districts".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {places.map((place) => (
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
            /* Split View */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-7 rounded-[8px] overflow-hidden border border-[#DADCE0] bg-[#FFFFFF] shadow-xs">
                <MapWrapper
                  data={mapLayers}
                  selectedCoordinates={selectedCoords}
                  heightClass="h-[560px]"
                  onMarkerSelect={handleMapMarkerSelect}
                />
              </div>

              <div className="lg:col-span-5 space-y-3 max-h-[560px] overflow-y-auto pr-1">
                <div className="flex items-center justify-between sticky top-0 bg-[#F8F9FA] py-1 z-10 text-[12px]">
                  <span className="font-medium text-[#202124]">Destinations ({places.length})</span>
                  <span className="text-[#5F6368]">Click to focus map</span>
                </div>

                {isPlacesLoading ? (
                  <div className="space-y-2.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 animate-pulse rounded-[4px] bg-[#FFFFFF] border border-[#DADCE0]" />
                    ))}
                  </div>
                ) : places.length === 0 ? (
                  <div className="rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] p-6 text-center text-[12px] text-[#5F6368]">
                    No destinations match your query.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {places.map((place) => (
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
    <div
      onClick={onSelect}
      className="group overflow-hidden rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="relative h-40 w-full overflow-hidden bg-[#F8F9FA] border-b border-[#DADCE0]">
          <img
            src={place.thumbnailUrl}
            alt={place.name}
            className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            <span className="rounded-full bg-[#FFFFFF]/90 px-2 py-0.2 text-[10px] font-medium text-[#202124] border border-[#DADCE0]">
              {place.district}
            </span>
          </div>
        </div>

        <div className="p-3.5 space-y-1.5">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-[14px] font-medium text-[#202124] leading-snug">
              {place.name}
            </h3>
            {place.altitudeMeters && (
              <span className="text-[11px] font-mono text-[#5F6368] shrink-0">
                {place.altitudeMeters}m
              </span>
            )}
          </div>

          <p className="text-[12px] text-[#5F6368] line-clamp-2 leading-relaxed">
            {place.description}
          </p>
        </div>
      </div>

      <div className="p-3.5 pt-0 flex items-center justify-between border-t border-[#DADCE0] mt-2 pt-2">
        <span
          className={`px-2 py-0.2 rounded-full text-[10px] font-medium border ${
            place.permitRequired
              ? 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]'
              : 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]'
          }`}
        >
          {place.permitRequired ? 'Permit Required' : 'Open Entry'}
        </span>

        <Link
          href={`/places/${place.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0B3D91] hover:underline"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

// Compact Place Card for Split List View
function PlaceCompactCard({ place, onSelect }: { place: PlaceSummary; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="p-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] shadow-2xs hover:border-[#0B3D91] transition-all cursor-pointer flex items-center justify-between gap-3 text-[12px]"
    >
      <div className="space-y-0.5 min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-[#202124] truncate">{place.name}</span>
          <span className="text-[10px] text-[#5F6368]">({place.district})</span>
        </div>
        <div className="text-[11px] text-[#5F6368] truncate">
          {place.altitudeMeters ? `${place.altitudeMeters}m • ` : ''}{place.description}
        </div>
      </div>


      <div className="shrink-0 flex items-center gap-2">
        <span
          className={`px-2 py-0.2 rounded-full text-[10px] font-medium border ${
            place.permitRequired
              ? 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]'
              : 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]'
          }`}
        >
          {place.permitRequired ? 'Permit' : 'Open'}
        </span>

        <Link
          href={`/places/${place.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded-[4px] text-[#0B3D91] hover:bg-[#E8F0FE]"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
