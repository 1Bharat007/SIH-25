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
      <main className="min-h-screen bg-[#011412] px-4 py-12 sm:px-6 lg:px-8 text-center text-white">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="h-8 w-32 animate-pulse rounded-xl bg-slate-800" />
          <div className="h-80 w-full animate-pulse rounded-3xl bg-slate-800" />
          <div className="h-40 w-full animate-pulse rounded-3xl bg-slate-800" />
        </div>
      </main>
    );
  }

  if (isError || !place) {
    return (
      <main className="min-h-screen bg-[#011412] px-4 py-12 sm:px-6 lg:px-8 text-center text-white">
        <div className="mx-auto max-w-md rounded-3xl border border-rose-500/30 bg-rose-950/30 p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-rose-400" />
          <h2 className="mt-3 text-lg font-bold text-white">Destination Not Found</h2>
          <p className="mt-1 text-xs text-rose-200/80">
            {error?.message || `We could not find the destination '${slug}'.`}
          </p>
          <Link
            href="/explore"
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Map Explorer</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#073b35] via-[#042420] to-[#011412] px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-5xl">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4 mb-6">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Map & Explore</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-slate-950/50 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-slate-900 transition-all"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={handleGetDirections}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-950/60 hover:from-emerald-400 hover:to-teal-500 transition-all"
            >
              <Navigation className="h-3.5 w-3.5 fill-current" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>

        {/* Active Hazard Alert Banner (if applicable) */}
        {place.activeAlerts && place.activeAlerts.length > 0 && (
          <div className="mb-6 space-y-3">
            {place.activeAlerts.map(alert => (
              <div
                key={alert.id}
                className="rounded-3xl border border-rose-500/40 bg-rose-950/40 p-5 backdrop-blur-md text-rose-100 shadow-xl"
              >
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-300 border border-rose-500/40">
                        {alert.severity} Hazard Advisory
                      </span>
                      <span className="text-xs text-rose-300/80">
                        Radius: {alert.radiusKm || 10} km
                      </span>
                    </div>
                    <h4 className="mt-1.5 text-sm font-bold text-white">{alert.title}</h4>
                    <p className="mt-1 text-xs text-rose-200/90 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hero Banner & Gallery */}
        <section className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-900/60 shadow-2xl backdrop-blur-xl">
          {/* Main Hero Image */}
          <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-950">
            <img src={place.thumbnailUrl} alt={place.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                {place.district} District
              </span>
              <span className="rounded-full bg-emerald-950/80 px-3 py-1 text-xs font-medium text-emerald-200 backdrop-blur-md capitalize border border-emerald-500/20">
                {place.category.replace('_', ' ')}
              </span>
            </div>

            {/* Altitude & Rating */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {place.altitudeMeters && (
                <div className="flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md border border-amber-500/40">
                  <Mountain className="h-3.5 w-3.5 text-amber-400" />
                  <span>{place.altitudeMeters} meters</span>
                </div>
              )}
            </div>

            {/* Bottom Header Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                {place.name}
              </h2>
              {place.localName && (
                <p className="mt-1 text-sm sm:text-base font-medium text-emerald-300/90">
                  {place.localName}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-200">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-white">{place.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({place.reviewCount} verified reviews)</span>
                </div>

                <div className="flex items-center gap-1 text-emerald-300">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery Strip */}
          {place.images && place.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2 p-4 bg-slate-950/80 border-t border-emerald-900/40">
              {place.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative h-24 sm:h-32 overflow-hidden rounded-xl bg-slate-900"
                >
                  <img
                    src={imgUrl}
                    alt={`${place.name} photo ${idx + 1}`}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Practical Facts Grid */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/50 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300/70">
              <Calendar className="h-4 w-4 text-emerald-400" />
              <span>Best Season</span>
            </div>
            <p className="mt-2 text-sm font-bold text-white">
              {place.bestTimeToVisit || 'October to May'}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/50 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300/70">
              <Clock className="h-4 w-4 text-teal-400" />
              <span>Visiting Hours</span>
            </div>
            <p className="mt-2 text-sm font-bold text-white">
              {place.openingHours || '6:00 AM - 6:00 PM'}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/50 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300/70">
              <Ticket className="h-4 w-4 text-amber-400" />
              <span>Entry Fee</span>
            </div>
            <p className="mt-2 text-sm font-bold text-white">{place.entryFee || 'Free'}</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/50 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300/70">
              <ShieldCheck className="h-4 w-4 text-sky-400" />
              <span>Permit Status</span>
            </div>
            <p className="mt-2 text-sm font-bold text-white">
              {place.permitRequired ? 'Permit Required (PAP)' : 'No Permit Required'}
            </p>
          </div>
        </section>

        {/* Description & Cultural Lore */}
        <section className="mt-6 space-y-6">
          <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-emerald-400" />
              <span>About Destination</span>
            </h3>
            <p className="mt-3 text-sm text-emerald-100/90 leading-relaxed">{place.description}</p>

            {/* Cultural & History Section */}
            {place.history && (
              <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  <span>Monastery Heritage & Sacred Lore</span>
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-amber-100/80 leading-relaxed font-serif">
                  {place.history}
                </p>
              </div>
            )}

          </div>
        </section>

        {/* Nearby Verified Local Vendors (Homestays, Cabs, Cafes) */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-teal-400" />
                <span>Nearby Verified Local Vendors & Services</span>
              </h3>
              <p className="text-xs text-emerald-300/70">
                Directly support local Sikkimese homestay hosts, drivers, and artisans
              </p>
            </div>
          </div>

          {place.nearbyVendors && place.nearbyVendors.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {place.nearbyVendors.map(vendor => (
                <div
                  key={vendor.id}
                  className="rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-5 backdrop-blur-md shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                        {vendor.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-amber-400">
                        ★ {vendor.rating.toFixed(1)}
                      </span>
                    </div>

                    <h4 className="mt-3 text-base font-bold text-white">{vendor.businessName}</h4>
                    <p className="text-xs text-emerald-300/80 font-medium">
                      Host / Owner: {vendor.ownerName}
                    </p>

                    {vendor.description && (
                      <p className="mt-2 text-xs text-emerald-100/70 line-clamp-2">
                        {vendor.description}
                      </p>
                    )}

                    {vendor.pricingInfo && (
                      <div className="mt-3 rounded-xl bg-slate-950/60 p-2 text-[11px] font-semibold text-emerald-300">
                        {vendor.pricingInfo}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-emerald-900/30 pt-3">
                    <a
                      href={`tel:${vendor.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-500/20 transition-all"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call Host</span>
                    </a>

                    {vendor.whatsapp && (
                      <a
                        href={`https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all"
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
            <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/40 p-6 text-center text-xs text-emerald-300/70">
              No registered vendors in the immediate vicinity yet.
            </div>
          )}
        </section>

        {/* Nearby Emergency Helplines & Assistance */}
        <section className="mt-8 mb-12">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <span>Emergency Services & 24x7 Helplines</span>
            </h3>
            <p className="text-xs text-emerald-300/70">
              Immediate medical aid, police, and state tourist response teams
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {place.nearbyEmergencyContacts && place.nearbyEmergencyContacts.length > 0 ? (
              place.nearbyEmergencyContacts.map(contact => (
                <div
                  key={contact.id}
                  className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-5 backdrop-blur-md shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-300 border border-rose-500/30">
                      {contact.type.replace(/_/g, ' ')}
                    </span>
                    <h4 className="mt-2.5 text-sm font-bold text-white">{contact.name}</h4>
                    <p className="mt-1 text-xs text-slate-300">{contact.address}</p>
                  </div>

                  <div className="mt-4 border-t border-rose-900/30 pt-3">
                    <a
                      href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/50 hover:bg-rose-500 transition-all"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call Now: {contact.phone}</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-rose-500/20 bg-rose-950/20 p-6 text-center">
                <p className="text-xs text-rose-200">
                  Dial statewide 24x7 Tourist Helpline:{' '}
                  <a href="tel:1364" className="font-bold underline">
                    1364
                  </a>{' '}
                  or Emergency Control Room:{' '}
                  <a href="tel:112" className="font-bold underline">
                    112
                  </a>
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
