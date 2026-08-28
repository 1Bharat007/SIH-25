'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shirt,
  Shield,
  AlertTriangle,
  DownloadCloud,
  Lock,
  User,
  LogOut,
  RefreshCw,
  ArrowRight,
  MapPin,
  Activity,
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useHealthCheck } from '../hooks/useHealthCheck';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePlacesQuery } from '../hooks/useTourism';

export default function HomePage() {
  const { data: health, refetch, isFetching } = useHealthCheck();
  const { isOnline } = useOnlineStatus();
  const { data: session } = useSession();
  const { data: previewPlaces = [] } = usePlacesQuery();


  const handleQuickLogin = (email: string) => {
    signIn('credentials', {
      email,
      password: email.startsWith('admin')
        ? 'Admin@12345'
        : email.startsWith('vendor')
          ? 'Vendor@12345'
          : 'Tourist@12345',
      redirect: false,
    });
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#202124] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top Status & System Health Bar */}
        <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[4px] bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8] shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[16px] font-medium text-[#202124] leading-tight">
                  Sikkim Tourism & Disaster Management Gateway
                </h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    isOnline
                      ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]'
                      : 'bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]'
                  }`}
                >
                  {isOnline ? 'Online / Live Sync' : 'Offline Storage Active'}
                </span>
              </div>
              <p className="text-[12px] text-[#5F6368]">
                Real-time services, high-altitude permits, road condition telemetry, and cultural preservation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-[12px]">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="px-3 py-1.5 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[#0B3D91] hover:bg-[#F8F9FA] font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              <span>{isFetching ? 'Checking...' : 'Check Status'}</span>
            </button>
            <span className="text-[#5F6368] text-[11px] hidden sm:inline">
              API Uptime: {health?.uptime ? `${Math.floor(health.uptime / 60)}m` : 'Active'}
            </span>
          </div>
        </div>


        {/* Primary Government Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Service 1: Cultural Heritage & AR Studio */}
          <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-5 flex flex-col justify-between space-y-4 hover:shadow-[0_1px_3px_0_rgba(60,64,67,0.15)] transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-[4px] bg-[#E8F0FE] text-[#1A73E8]">
                  <Shirt className="w-5 h-5" />
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
                  12 Outfits Ready
                </span>
              </div>
              <h2 className="text-[16px] font-medium text-[#202124]">
                Traditional AR Wardrobe Studio
              </h2>
              <p className="text-[13px] text-[#5F6368] leading-relaxed">
                Real-time camera mirror for authentic Bhutia, Lepcha, and Nepali attire with 3-layer accessory stacking and direct local artisan booking.
              </p>
            </div>
            <Link
              href="/culture/ar-demo"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[13px] font-medium transition-colors w-full"
            >
              <span>Launch AR Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Service 2: Safety & Emergency SOS */}
          <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-5 flex flex-col justify-between space-y-4 hover:shadow-[0_1px_3px_0_rgba(60,64,67,0.15)] transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-[4px] bg-[#FCE8E6] text-[#C5221F]">
                  <Shield className="w-5 h-5" />
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]">
                  GPS Geofenced
                </span>
              </div>
              <h2 className="text-[16px] font-medium text-[#202124]">
                Emergency Safety & SOS Dispatch
              </h2>
              <p className="text-[13px] text-[#5F6368] leading-relaxed">
                Offline SMS emergency triggers, nearest police/hospital locator via Haversine telemetry, and live location sharing with trusted contacts.
              </p>
            </div>
            <Link
              href="/safety"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] text-[#0B3D91] text-[13px] font-medium transition-colors w-full"
            >
              <span>Open Safety Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Service 3: Disaster Management & Landslide Detours */}
          <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-5 flex flex-col justify-between space-y-4 hover:shadow-[0_1px_3px_0_rgba(60,64,67,0.15)] transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-[4px] bg-[#FEF7E0] text-[#B06000]">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
                  Live Broadcasts
                </span>
              </div>
              <h2 className="text-[16px] font-medium text-[#202124]">
                Disaster Alerts & Safe Detours
              </h2>
              <p className="text-[13px] text-[#5F6368] leading-relaxed">
                Active road blockage tracking on NH10, GLOF/blizzard hazard perimeter alerts, and automated mountain pass rerouting.
              </p>
            </div>
            <Link
              href="/disaster"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] text-[#0B3D91] text-[13px] font-medium transition-colors w-full"
            >
              <span>View Road Alerts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Secondary Operational Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Places & Offline Navigation Directory */}
          <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DADCE0] pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0B3D91]" />
                <h3 className="text-[15px] font-medium text-[#202124]">
                  Key Destinations & Altitude Telemetry
                </h3>
              </div>
              <Link
                href="/explore"
                className="text-[12px] font-medium text-[#0B3D91] hover:underline"
              >
                View all places ({previewPlaces.length})
              </Link>
            </div>

            <div className="space-y-2">
              {previewPlaces.slice(0, 4).map((place) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between p-2.5 rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] text-[13px]"
                >
                  <div>
                    <div className="font-medium text-[#202124]">{place.name}</div>
                    <div className="text-[11px] text-[#5F6368]">
                      {place.district} District • {place.altitudeMeters ? `${place.altitudeMeters}m altitude` : place.category}
                    </div>

                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      place.permitRequired
                        ? 'bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]'
                        : 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]'
                    }`}
                  >
                    {place.permitRequired ? 'Permit Required' : 'Open Entry'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <Link
                href="/offline-settings"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0B3D91] hover:underline"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Pre-download regional map tiles and emergency databases →</span>
              </Link>
            </div>
          </div>

          {/* User Session & Role Verification Portal */}
          <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DADCE0] pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0B3D91]" />
                <h3 className="text-[15px] font-medium text-[#202124]">
                  Portal Access & Role Verification
                </h3>
              </div>
              <span className="text-[11px] text-[#5F6368]">
                RBAC Security Layer
              </span>
            </div>

            {session?.user ? (
              <div className="p-4 rounded-[4px] bg-[#E8F0FE] border border-[#D2E3FC] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0B3D91]" />
                    <span className="font-medium text-[#0B3D91] text-[13px]">
                      {session.user.name}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#0B3D91] text-[#FFFFFF]">
                    {session.user.role}
                  </span>
                </div>
                <p className="text-[12px] text-[#5F6368]">
                  Authenticated as: <strong className="text-[#202124]">{session.user.email}</strong>
                </p>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1.5 rounded-[4px] bg-[#FFFFFF] border border-[#DADCE0] text-[#D93025] hover:bg-[#FCE8E6] text-[12px] font-medium flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[12px] text-[#5F6368]">
                  Select a test identity below to verify role-based permissions:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickLogin('tourist@sikkimyatra.in')}
                    className="p-2.5 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] text-left transition-colors"
                  >
                    <div className="text-[12px] font-medium text-[#202124]">Tourist</div>
                    <div className="text-[10px] text-[#5F6368]">Visitor profile</div>
                  </button>

                  <button
                    onClick={() => handleQuickLogin('vendor@sikkimyatra.in')}
                    className="p-2.5 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] text-left transition-colors"
                  >
                    <div className="text-[12px] font-medium text-[#202124]">Artisan</div>
                    <div className="text-[10px] text-[#5F6368]">Weaver / Homestay</div>
                  </button>

                  <button
                    onClick={() => handleQuickLogin('admin@sikkimyatra.in')}
                    className="p-2.5 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] text-left transition-colors"
                  >
                    <div className="text-[12px] font-medium text-[#202124]">Officer</div>
                    <div className="text-[10px] text-[#5F6368]">Alert manager</div>
                  </button>
                </div>
              </div>
            )}

            {/* Official Compliance Footer */}
            <div className="pt-2 border-t border-[#DADCE0] text-[11px] text-[#5F6368] flex items-center justify-between">
              <span>NIC & MeitY Standards Compliant</span>
              <span>v0.1.0 • Stable Release</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
