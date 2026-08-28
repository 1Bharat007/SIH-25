'use client';

import React, { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mountain,
  MapPin,
  Clock,
  Calendar,
  Ticket,
  Compass,
  Phone,
  MessageCircle,
  ShieldCheck,
  ShieldAlert,
  Navigation,
  Star,
  AlertTriangle,
  HeartHandshake,
  Share2,
} from 'lucide-react';
import { usePlaceDetailQuery } from '../../../hooks/useTourism';

export default function PlaceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { data: place, isLoading, isError, error } = usePlaceDetailQuery(slug);

  const handleGetDirections = () => {
    if (place) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share && place) {
      navigator.share({
        title: `${place.name} — Sikkim Yatra`,
        text: place.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] px-4 py-12 sm:px-6 lg:px-8 text-center text-[#5F6368]">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="h-8 w-32 animate-pulse rounded-[4px] bg-[#FFFFFF] border border-[#DADCE0]" />
          <div className="h-72 w-full animate-pulse rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0]" />
          <div className="h-32 w-full animate-pulse rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0]" />
        </div>
      </main>
    );
  }

  if (isError || !place) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] px-4 py-12 sm:px-6 lg:px-8 text-center text-[#202124]">
        <div className="mx-auto max-w-md rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-6 space-y-3 shadow-xs">
          <AlertTriangle className="mx-auto h-10 w-10 text-[#D93025]" />
          <h2 className="text-[16px] font-medium text-[#202124]">Destination Not Found</h2>
          <p className="text-[12px] text-[#5F6368]">
            {error?.message || `We could not find destination records for '${slug}'.`}
          </p>
          <Link
            href="/explore"
            className="mt-2 inline-flex items-center gap-1.5 rounded-[4px] bg-[#0B3D91] px-4 py-2 text-[12px] font-medium text-[#FFFFFF] hover:bg-[#082E6E]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Map Explorer</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#202124] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#5F6368] border-b border-[#DADCE0] pb-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1 text-[#0B3D91] hover:underline font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Map & Explore</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] px-3 py-1.5 text-[12px] font-medium text-[#5F6368] hover:bg-[#F8F9FA]"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={handleGetDirections}
              className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] px-4 py-1.5 text-[12px] font-medium text-[#FFFFFF] transition-colors"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>

        {/* Active Hazard Alert Banner (if applicable) */}
        {place.activeAlerts && place.activeAlerts.length > 0 && (
          <div className="space-y-2">
            {place.activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-[4px] border border-[#FAD2CF] bg-[#FCE8E6] p-4 text-[#C5221F] flex items-start gap-3 text-[12px]"
              >
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium uppercase">
                      {alert.severity} Hazard Advisory
                    </span>
                    <span>•</span>
                    <span>Radius: {alert.radiusKm || 10} km</span>
                  </div>
                  <h4 className="font-medium mt-0.5 text-[13px]">{alert.title}</h4>
                  <p className="mt-0.5 leading-relaxed">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hero Card & Gallery */}
        <section className="overflow-hidden rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] shadow-xs">
          {/* Main Hero Image */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#F8F9FA] border-b border-[#DADCE0]">
            <img
              src={place.thumbnailUrl}
              alt={place.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-[#FFFFFF]/90 px-2.5 py-0.5 text-[11px] font-medium text-[#202124] border border-[#DADCE0]">
                {place.district} District
              </span>
              <span className="rounded-full bg-[#E8F0FE] px-2.5 py-0.5 text-[11px] font-medium text-[#0B3D91] border border-[#D2E3FC] capitalize">
                {place.category.replace('_', ' ')}
              </span>
            </div>

            {place.altitudeMeters && (
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-[#FFFFFF]/90 px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#202124] border border-[#DADCE0]">
                <Mountain className="h-3.5 w-3.5 text-[#0B3D91]" />
                <span>{place.altitudeMeters}m</span>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6 space-y-3">
            <div>
              <h1 className="text-[22px] font-medium text-[#202124] leading-snug">
                {place.name}
              </h1>
              {place.localName && (
                <p className="text-[13px] text-[#5F6368] mt-0.5 font-medium">
                  {place.localName}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#5F6368] pt-1">
              <div className="flex items-center gap-1 text-[#B06000]">
                <Star className="h-3.5 w-3.5 fill-[#B06000]" />
                <span className="font-medium text-[#202124]">{place.rating.toFixed(1)}</span>
                <span>({place.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#0B3D91]" />
                <span>
                  {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E
                </span>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          {place.images && place.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2 p-4 bg-[#F8F9FA] border-t border-[#DADCE0]">
              {place.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative h-20 sm:h-28 overflow-hidden rounded-[4px] bg-[#FFFFFF] border border-[#DADCE0]"
                >
                  <img
                    src={imgUrl}
                    alt={`${place.name} view ${idx + 1}`}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Practical Facts Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[13px]">
          <div className="rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5F6368]">
              <Calendar className="h-3.5 w-3.5 text-[#0B3D91]" />
              <span>Recommended Season</span>
            </div>
            <p className="font-medium text-[#202124]">{place.bestTimeToVisit || 'October to May'}</p>
          </div>

          <div className="rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5F6368]">
              <Clock className="h-3.5 w-3.5 text-[#0B3D91]" />
              <span>Visiting Hours</span>
            </div>
            <p className="font-medium text-[#202124]">{place.openingHours || '6:00 AM - 6:00 PM'}</p>
          </div>

          <div className="rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5F6368]">
              <Ticket className="h-3.5 w-3.5 text-[#0B3D91]" />
              <span>Entry Tariff</span>
            </div>
            <p className="font-medium text-[#202124]">{place.entryFee || 'Free'}</p>
          </div>

          <div className="rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5F6368]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0B3D91]" />
              <span>Permit Category</span>
            </div>
            <p className="font-medium text-[#202124]">
              {place.permitRequired ? 'Permit Required (PAP)' : 'Open Entry'}
            </p>
          </div>
        </section>

        {/* Description & Cultural Lore */}
        <section className="rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-5 sm:p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-[16px] font-medium text-[#202124] flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#0B3D91]" />
              <span>Destination Overview</span>
            </h3>
            <p className="mt-2 text-[13px] text-[#5F6368] leading-relaxed">
              {place.description}
            </p>
          </div>

          {place.history && (
            <div className="rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] p-4 space-y-1">
              <h4 className="text-[13px] font-medium text-[#0B3D91]">
                Monastery Heritage & Historical Lore
              </h4>
              <p className="text-[12px] text-[#5F6368] leading-relaxed">
                {place.history}
              </p>
            </div>
          )}
        </section>

        {/* Nearby Verified Local Vendors */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#DADCE0] pb-2">
            <div>
              <h3 className="text-[15px] font-medium text-[#202124] flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-[#0B3D91]" />
                <span>Nearby Verified Local Vendors & Homestays</span>
              </h3>
              <p className="text-[12px] text-[#5F6368]">
                Directly support local Sikkimese homestay hosts, drivers, and artisans
              </p>
            </div>
          </div>

          {place.nearbyVendors && place.nearbyVendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {place.nearbyVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-4 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#E8F0FE] px-2 py-0.2 text-[10px] font-medium text-[#0B3D91] border border-[#D2E3FC] capitalize">
                        {vendor.type.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] font-medium text-[#B06000]">
                        ★ {vendor.rating.toFixed(1)}
                      </span>
                    </div>

                    <h4 className="text-[14px] font-medium text-[#202124]">{vendor.businessName}</h4>
                    <p className="text-[11px] text-[#5F6368]">
                      Host: {vendor.ownerName}
                    </p>

                    {vendor.pricingInfo && (
                      <div className="rounded-[4px] bg-[#F8F9FA] border border-[#DADCE0] p-1.5 text-[11px] text-[#202124] font-medium">
                        {vendor.pricingInfo}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#DADCE0]">
                    <a
                      href={`tel:${vendor.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] py-1.5 text-[12px] font-medium text-[#0B3D91]"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call Host</span>
                    </a>

                    {vendor.whatsapp && (
                      <a
                        href={`https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-[4px] bg-[#1E8E3E] hover:bg-[#137333] py-1.5 text-[12px] font-medium text-[#FFFFFF]"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] p-6 text-center text-[12px] text-[#5F6368]">
              No registered vendors in the immediate vicinity.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
