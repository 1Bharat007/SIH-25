'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Radio, Phone, Navigation, ArrowLeft, AlertTriangle } from 'lucide-react';
import { LiveLocationSession, MapLayersResponse } from '@sikkim-yatra/shared';
import { safetyService } from '../../../../services/safety.service';
import MapWrapper from '../../../../components/map/MapWrapper';

export default function TrackLiveLocationPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [session, setSession] = useState<LiveLocationSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastPingTime, setLastPingTime] = useState<string>('');

  const fetchSession = async () => {
    try {
      const data = await safetyService.getLiveLocation(token);
      setSession(data);
      setLastPingTime(new Date().toLocaleTimeString());
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tracking session not found or expired';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    // Poll every 10 seconds for live traveler movement updates
    const interval = setInterval(fetchSession, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const mapData: MapLayersResponse | undefined = session
    ? {
        features: [
          {
            id: 'live-traveler',
            markerType: 'monastery',
            title: `${session.userName || 'Traveler'} (Live)`,
            subtitle: `Last updated ${lastPingTime}`,
            category: 'Live Location Tracking',
            district: 'Gangtok',
            latitude: session.latitude,
            longitude: session.longitude,
            altitudeMeters: session.altitudeMeters,
          },
        ],
        hazardZones: [],
        statistics: {
          totalPlaces: 1,
          totalVendors: 0,
          totalEmergencyContacts: 0,
          activeAlerts: 0,
        },
      }
    : undefined;

  const handleOpenGoogleMaps = () => {
    if (session) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${session.latitude},${session.longitude}`,
        '_blank'
      );
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#011412] px-4 py-12 text-center text-white">
        <div className="mx-auto max-w-md space-y-4">
          <div className="h-10 w-10 mx-auto animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <p className="text-xs text-emerald-300">Connecting to Sikkim Live Satellite Tracker...</p>
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="min-h-screen bg-[#011412] px-4 py-12 text-center text-white">
        <div className="mx-auto max-w-md rounded-3xl border border-rose-500/30 bg-rose-950/30 p-8 shadow-2xl">
          <AlertTriangle className="mx-auto h-12 w-12 text-rose-400" />
          <h2 className="mt-3 text-lg font-bold text-white">Tracking Session Inactive</h2>
          <p className="mt-1 text-xs text-rose-200/80">
            {error || 'This live location session has ended or expired.'}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Go to Sikkim Yatra Home</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#073b35] via-[#042420] to-[#011412] px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-5xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Sikkim Yatra</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40 animate-pulse">
              <Radio className="h-3.5 w-3.5" />
              <span>Live GPS Broadcast</span>
            </span>

            <button
              onClick={handleOpenGoogleMaps}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
            >
              <Navigation className="h-3.5 w-3.5 fill-current" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>

        {/* Traveler Live Status Header Card */}
        <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 font-bold text-xl border border-emerald-500/40">
                {session.userName?.[0] || 'T'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {session.userName} is sharing location
                </h2>
                <p className="text-xs text-emerald-300/80">
                  Last satellite ping: <span className="font-mono text-white">{lastPingTime}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="rounded-xl border border-emerald-500/20 bg-black/40 px-3 py-1.5 font-mono text-emerald-300">
                {session.latitude.toFixed(5)}° N, {session.longitude.toFixed(5)}° E
              </div>
              {session.altitudeMeters && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/40 px-3 py-1.5 font-bold text-amber-300">
                  {session.altitudeMeters} m
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Map Display */}
        <div className="overflow-hidden rounded-3xl border border-emerald-500/30 shadow-2xl">
          <MapWrapper
            data={mapData}
            selectedCoordinates={[session.latitude, session.longitude]}
            heightClass="h-[550px]"
          />
        </div>

        {/* Emergency Assistance Direct Call Strip */}
        <div className="mt-6 rounded-3xl border border-rose-500/30 bg-rose-950/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">
              Need to report emergency for this traveler?
            </h4>
            <p className="text-xs text-rose-200/80">
              Direct dispatch to Sikkim Police & SDMA Control
            </p>
          </div>

          <a
            href="tel:1364"
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-500 shadow-lg shadow-rose-950/80"
          >
            <Phone className="h-4 w-4" />
            <span>Call 24x7 Tourist Helpline (1364)</span>
          </a>
        </div>
      </div>
    </main>
  );
}
