'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, MapPin, Phone, Compass, ArrowLeft, Clock } from 'lucide-react';
import {
  useUserGeolocation,
  useNearestEmergencyQuery,
  useSafetyRoutesQuery,
} from '../../hooks/useSafety';
import TrustedContactsManager from '../../components/safety/TrustedContactsManager';
import LiveLocationShare from '../../components/safety/LiveLocationShare';
import SOSModal from '../../components/safety/SOSModal';

export default function SafetyHubPage() {
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const { coordinates, refreshLocation } = useUserGeolocation();
  const { data: nearestEmergency, isLoading: isNearestLoading } = useNearestEmergencyQuery(
    coordinates.latitude,
    coordinates.longitude
  );

  const { data: safetyRoutes = [] } = useSafetyRoutesQuery();


  const filteredRoutes = safetyRoutes.filter((route) => {
    if (filterType === 'safe') return route.safetyRating >= 4.0;
    if (filterType === 'avoid_dark')
      return (
        route.curfewActive ||
        route.routeType === 'avoid_after_dark' ||
        route.routeType === 'high_altitude_mountain_pass'
      );
    return true;
  });

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#202124] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#5F6368]">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[#0B3D91] hover:underline font-medium flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portal Overview</span>
            </Link>
            <span>/</span>
            <span className="text-[#202124] font-medium">Traveler Safety & Emergency SOS</span>
          </div>

          <button
            onClick={() => setIsSosOpen(true)}
            className="px-3 py-1.5 rounded-[4px] bg-[#D93025] hover:bg-[#C5221F] text-[#FFFFFF] text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Emergency SOS Trigger</span>
          </button>
        </div>

        {/* SOS Launch Hero Card */}
        <div className="rounded-[8px] border border-[#FAD2CF] bg-[#FFFFFF] p-5 sm:p-6 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE8E6] px-2.5 py-0.5 text-[11px] font-medium text-[#C5221F] border border-[#FAD2CF]">
              <AlertCircle className="w-3 h-3" />
              <span>Emergency Dispatch Center</span>
            </div>
            <h1 className="text-[20px] font-medium text-[#202124]">
              High-Altitude Emergency & Tourist SOS Assistance
            </h1>
            <p className="text-[13px] text-[#5F6368] leading-relaxed">
              Transmits GPS coordinates to nearest Sikkim Police outposts, STNM Trauma Hospital,
              and auto-notifies your designated emergency contacts with offline SMS fallback.
            </p>
          </div>

          <button
            onClick={() => setIsSosOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-[4px] bg-[#D93025] hover:bg-[#C5221F] text-[#FFFFFF] text-[13px] font-medium transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Dispatch SOS Now</span>
          </button>
        </div>

        {/* Live GPS Emergency Radar */}
        <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-5 space-y-4 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DADCE0] pb-3">
            <div>
              <h2 className="text-[15px] font-medium text-[#202124] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0B3D91]" />
                <span>Nearest Emergency Stations (Haversine Telemetry)</span>
              </h2>
              <p className="text-[12px] text-[#5F6368]">
                Coordinates: {coordinates.latitude.toFixed(4)}° N, {coordinates.longitude.toFixed(4)}° E
              </p>
            </div>

            <button
              onClick={refreshLocation}
              className="text-[12px] font-medium text-[#0B3D91] hover:underline"
            >
              Refresh GPS
            </button>
          </div>

          {isNearestLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-[4px] bg-[#F8F9FA] border border-[#DADCE0]" />
              ))}
            </div>
          ) : nearestEmergency ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
              {/* Nearest Police */}
              <div className="rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] p-3.5 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#FCE8E6] px-2 py-0.5 text-[10px] font-medium text-[#C5221F] border border-[#FAD2CF]">
                      Police Post
                    </span>
                    <span className="text-[11px] font-medium text-[#5F6368]">
                      {nearestEmergency.nearestPolice.distanceKm} km
                    </span>
                  </div>
                  <h3 className="font-medium text-[#202124]">{nearestEmergency.nearestPolice.name}</h3>
                  <p className="text-[11px] text-[#5F6368] line-clamp-2">
                    {nearestEmergency.nearestPolice.address}
                  </p>
                </div>

                <a
                  href={`tel:${nearestEmergency.nearestPolice.phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-[4px] bg-[#D93025] py-1.5 text-[12px] font-medium text-[#FFFFFF] hover:bg-[#C5221F] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Police</span>
                </a>
              </div>

              {/* Nearest Hospital */}
              <div className="rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] p-3.5 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#E8F0FE] px-2 py-0.5 text-[10px] font-medium text-[#1A73E8] border border-[#D2E3FC]">
                      Hospital
                    </span>
                    <span className="text-[11px] font-medium text-[#5F6368]">
                      {nearestEmergency.nearestHospital.distanceKm} km
                    </span>
                  </div>
                  <h3 className="font-medium text-[#202124]">{nearestEmergency.nearestHospital.name}</h3>
                  <p className="text-[11px] text-[#5F6368] line-clamp-2">
                    {nearestEmergency.nearestHospital.address}
                  </p>
                </div>

                <a
                  href={`tel:${nearestEmergency.nearestHospital.phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-[4px] bg-[#0B3D91] py-1.5 text-[12px] font-medium text-[#FFFFFF] hover:bg-[#082E6E] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Hospital</span>
                </a>
              </div>

              {/* State 24x7 Tourist Helpline */}
              <div className="rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] p-3.5 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#FEF7E0] px-2 py-0.5 text-[10px] font-medium text-[#B06000] border border-[#FEEFC3]">
                      Tourist Helpline
                    </span>
                    <span className="text-[11px] font-medium text-[#137333]">24x7 Active</span>
                  </div>
                  <h3 className="font-medium text-[#202124]">Sikkim Tourism Control</h3>
                  <p className="text-[11px] text-[#5F6368]">
                    Paryatan Bhawan Central Desk
                  </p>
                </div>

                <a
                  href="tel:1364"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] py-1.5 text-[12px] font-medium text-[#0B3D91] hover:bg-[#F8F9FA] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 1364</span>
                </a>
              </div>
            </div>
          ) : null}
        </div>

        {/* Safer-Travel Recommendations & Route Ratings */}
        <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-5 space-y-4 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DADCE0] pb-3">
            <div>
              <h2 className="text-[15px] font-medium text-[#202124] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#0B3D91]" />
                <span>Mountain Road Safety Ratings & Curfew Advisories</span>
              </h2>
              <p className="text-[12px] text-[#5F6368]">
                Lighting indices, dusk safety thresholds, and high-altitude permit routes
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 text-[12px]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-full border transition-colors font-medium ${
                  filterType === 'all'
                    ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                    : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA]'
                }`}
              >
                All Corridors ({safetyRoutes.length})
              </button>
              <button
                onClick={() => setFilterType('safe')}
                className={`px-2.5 py-1 rounded-full border transition-colors font-medium ${
                  filterType === 'safe'
                    ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                    : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA]'
                }`}
              >
                Well-Lit (≥ 4.0)
              </button>
              <button
                onClick={() => setFilterType('avoid_dark')}
                className={`px-2.5 py-1 rounded-full border transition-colors font-medium ${
                  filterType === 'avoid_dark'
                    ? 'bg-[#D93025] text-[#FFFFFF] border-[#D93025]'
                    : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA]'
                }`}
              >
                Avoid After Dark
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredRoutes.map((route) => {
              const isSafe = route.safetyRating >= 4.0;
              const isDanger = route.safetyRating < 3.0;

              return (
                <div
                  key={route.id}
                  className="rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] p-4 space-y-2 hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full px-2 py-0.2 text-[10px] font-medium bg-[#F8F9FA] text-[#5F6368] border border-[#DADCE0]">
                          {route.district} District
                        </span>
                        <span className="text-[11px] text-[#5F6368]">
                          {route.lightingLevel === 'high' ? 'High Lighting' : route.lightingLevel === 'unlit' ? 'Unlit Mountain' : 'Moderate Lighting'}
                        </span>
                      </div>
                      <h3 className="text-[14px] font-medium text-[#202124] mt-1">{route.name}</h3>
                    </div>

                    <div
                      className={`px-2 py-0.5 rounded-[4px] border text-center text-[12px] font-medium ${
                        isDanger
                          ? 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]'
                          : isSafe
                            ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]'
                            : 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]'
                      }`}
                    >
                      {route.safetyRating.toFixed(1)} / 5.0
                    </div>
                  </div>

                  <p className="text-[12px] text-[#5F6368] leading-relaxed">
                    {route.advisory}
                  </p>

                  <div className="flex items-center justify-between border-t border-[#DADCE0] pt-2 text-[11px] text-[#5F6368]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Recommended: {route.recommendedHours}</span>
                    </div>

                    {route.curfewActive && (
                      <span className="text-[#C5221F] font-medium bg-[#FCE8E6] px-1.5 py-0.2 rounded-full border border-[#FAD2CF]">
                        Curfew Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Location Sharing & Trusted Contacts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LiveLocationShare />
          <TrustedContactsManager />
        </div>

        {/* SOS Modal */}
        <SOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
      </div>
    </main>
  );
}
