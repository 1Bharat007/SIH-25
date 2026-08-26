'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, MapPin, Phone, Compass, ArrowLeft, Sun, Moon, Clock } from 'lucide-react';
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

  const { data: safetyRoutes = [], isLoading: isRoutesLoading } = useSafetyRoutesQuery();

  const filteredRoutes = safetyRoutes.filter(route => {
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
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0c0507] via-[#042420] to-[#011412] px-4 py-6 sm:px-6 lg:px-8">
      {/* Decorative Red Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-rose-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Navigation Top Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-rose-900/40 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>

            <div className="h-4 w-[1px] bg-rose-900/60" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600/20 text-rose-400">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Sikkim Traveler Safety Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/explore"
              className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40"
            >
              Explore Map
            </Link>

            <button
              onClick={() => setIsSosOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-rose-950/80 hover:from-rose-500 hover:to-red-600 animate-pulse"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Instant SOS</span>
            </button>
          </div>
        </div>

        {/* SOS Launch Hero Banner */}
        <section className="mt-6">
          <div className="overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/60 via-[#18080c] to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-rose-300 border border-rose-500/30">
                <span>Emergency Distress Alert</span>
              </div>
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                One-Tap Emergency Assistance
              </h2>
              <p className="text-xs sm:text-sm text-rose-200/80 max-w-xl">
                Transmits real-time GPS coordinates to nearest Sikkim police stations, STNM trauma
                centers, and auto-alerts pre-set trusted contacts via WhatsApp and SMS.
              </p>
            </div>

            <button
              onClick={() => setIsSosOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 px-8 py-4 text-sm font-black text-white uppercase tracking-wider shadow-2xl shadow-rose-900/80 hover:from-rose-500 hover:to-red-600 active:scale-95 transition-all border border-rose-400/50 shrink-0"
            >
              <ShieldAlert className="h-5 w-5 animate-pulse" />
              <span>Launch Emergency SOS</span>
            </button>
          </div>
        </section>

        {/* Live GPS Nearest Police & Hospital Radar */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-400" />
                <span>Live GPS Emergency Proximity Radar</span>
              </h3>
              <p className="text-xs text-rose-300/70">
                Calculated in real-time from your current position (
                {coordinates.latitude.toFixed(4)}° N, {coordinates.longitude.toFixed(4)}° E)
              </p>
            </div>

            <button
              onClick={refreshLocation}
              className="text-xs font-semibold text-emerald-400 hover:underline"
            >
              Refresh GPS
            </button>
          </div>

          {isNearestLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-3xl border border-rose-900/30 bg-slate-900/40 p-4"
                />
              ))}
            </div>
          ) : nearestEmergency ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Nearest Police */}
              <div className="rounded-3xl border border-rose-500/30 bg-slate-900/60 p-5 backdrop-blur-md shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-300">
                      Closest Police Outpost
                    </span>
                    <span className="text-xs font-bold text-rose-400">
                      {nearestEmergency.nearestPolice.distanceKm} km away
                    </span>
                  </div>
                  <h4 className="mt-2.5 text-sm font-bold text-white">
                    {nearestEmergency.nearestPolice.name}
                  </h4>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {nearestEmergency.nearestPolice.address}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-900/30">
                  <a
                    href={`tel:${nearestEmergency.nearestPolice.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2 text-xs font-bold text-white hover:bg-rose-500 transition-all shadow-md"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Police ({nearestEmergency.nearestPolice.phone})</span>
                  </a>
                </div>
              </div>

              {/* Nearest Hospital */}
              <div className="rounded-3xl border border-teal-500/30 bg-slate-900/60 p-5 backdrop-blur-md shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-300">
                      Nearest Hospital
                    </span>
                    <span className="text-xs font-bold text-teal-400">
                      {nearestEmergency.nearestHospital.distanceKm} km away
                    </span>
                  </div>
                  <h4 className="mt-2.5 text-sm font-bold text-white">
                    {nearestEmergency.nearestHospital.name}
                  </h4>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {nearestEmergency.nearestHospital.address}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-teal-900/30">
                  <a
                    href={`tel:${nearestEmergency.nearestHospital.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal-600 py-2 text-xs font-bold text-white hover:bg-teal-500 transition-all shadow-md"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Hospital ({nearestEmergency.nearestHospital.phone})</span>
                  </a>
                </div>
              </div>

              {/* State 24x7 Tourist Helpline */}
              <div className="rounded-3xl border border-amber-500/30 bg-slate-900/60 p-5 backdrop-blur-md shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      Statewide Tourist Helpline
                    </span>
                    <span className="text-xs font-bold text-amber-400">Toll-Free 24x7</span>
                  </div>
                  <h4 className="mt-2.5 text-sm font-bold text-white">
                    Sikkim Tourist Assistance Control
                  </h4>
                  <p className="mt-1 text-xs text-slate-400">
                    Directorate of Tourism Central Control Room
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-900/30">
                  <a
                    href="tel:1364"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-600 py-2 text-xs font-bold text-white hover:bg-amber-500 transition-all shadow-md"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Helpline (1364)</span>
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {/* Safer-Travel Recommendations Panel (Data-Driven) */}
        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="h-5 w-5 text-emerald-400" />
                <span>Safer-Travel Recommendations & Route Ratings</span>
              </h3>
              <p className="text-xs text-emerald-300/70">
                Data-driven lighting indices, official curfew timings, and avoid-after-dark mountain
                advisories
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 rounded-2xl border border-emerald-500/20 bg-slate-950/60 p-1">
              <button
                onClick={() => setFilterType('all')}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                  filterType === 'all'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                All Corridors ({safetyRoutes.length})
              </button>
              <button
                onClick={() => setFilterType('safe')}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                  filterType === 'safe'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                Well-Lit (Rating ≥ 4.0)
              </button>
              <button
                onClick={() => setFilterType('avoid_dark')}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                  filterType === 'avoid_dark'
                    ? 'bg-rose-600 text-white shadow-md font-bold'
                    : 'text-rose-300 hover:text-white'
                }`}
              >
                Avoid After Dark ⚠️
              </button>
            </div>
          </div>

          {isRoutesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredRoutes.map(route => {
                const isSafe = route.safetyRating >= 4.0;
                const isDanger = route.safetyRating < 3.0;

                return (
                  <div
                    key={route.id}
                    className={`rounded-3xl border p-5 backdrop-blur-md shadow-xl transition-all ${
                      isDanger
                        ? 'border-rose-500/40 bg-rose-950/30'
                        : isSafe
                          ? 'border-emerald-500/30 bg-slate-900/60'
                          : 'border-amber-500/30 bg-amber-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                              isDanger
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : isSafe
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            {route.district} District
                          </span>

                          <span className="flex items-center gap-1 text-xs text-slate-300">
                            {route.lightingLevel === 'high' ? (
                              <>
                                <Sun className="h-3 w-3 text-amber-400" />
                                <span>High Lighting</span>
                              </>
                            ) : route.lightingLevel === 'unlit' ? (
                              <>
                                <Moon className="h-3 w-3 text-rose-400" />
                                <span>Unlit Mountain</span>
                              </>
                            ) : (
                              <>
                                <Sun className="h-3 w-3 text-emerald-400" />
                                <span>Moderate Lighting</span>
                              </>
                            )}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white mt-2 leading-tight">
                          {route.name}
                        </h4>
                      </div>

                      {/* Safety Rating Score Badge */}
                      <div
                        className={`flex flex-col items-center rounded-2xl px-3 py-1.5 border text-center ${
                          isDanger
                            ? 'border-rose-500 bg-rose-950/80 text-rose-300'
                            : isSafe
                              ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300'
                              : 'border-amber-500 bg-amber-950/80 text-amber-300'
                        }`}
                      >
                        <span className="text-sm font-black">{route.safetyRating.toFixed(1)}</span>
                        <span className="text-[9px] uppercase font-bold tracking-tighter">
                          Safety
                        </span>
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                      {route.advisory}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between border-t border-slate-800 pt-2.5 text-xs">
                      <div className="flex items-center gap-1 text-emerald-300/80 text-[11px]">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Recommended: {route.recommendedHours}</span>
                      </div>

                      {route.curfewActive && (
                        <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/40">
                          Night Entry Curfew Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Live Location Sharing & Trusted Contacts Section */}
        <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 mb-12">
          {/* Live Location Share */}
          <LiveLocationShare />

          {/* Trusted Contacts Manager */}
          <TrustedContactsManager />
        </section>

        {/* SOS Modal Container */}
        <SOSModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
      </div>
    </main>
  );
}
