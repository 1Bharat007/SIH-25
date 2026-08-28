'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Camera,
  Layers,
  Shirt,
  Compass,
  HeartHandshake,
} from 'lucide-react';

import ARTryOnStudio from '../../../components/culture/ARTryOnStudio';
import WardrobeSelector from '../../../components/culture/WardrobeSelector';
import CulturalContextPanel from '../../../components/culture/CulturalContextPanel';
import { TEST_GARMENT_ITEM } from '../../../utils/garment-assets';
import { GarmentItem } from '@sikkim-yatra/shared';

export default function ARDemoPage() {
  const [selectedGarment, setSelectedGarment] = useState<GarmentItem>(TEST_GARMENT_ITEM);
  const artisanSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToArtisans = () => {
    if (artisanSectionRef.current) {
      artisanSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/culture"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cultural Heritage Hub</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MediaPipe Pose & Multi-Layer Vision Engine (30+ FPS)</span>
          </div>
        </div>

        {/* Hero Intro Screen: Heritage & Living Culture Mission */}
        <div className="relative rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Virtual Cultural Heritage Studio</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Bhutia • Lepcha • Nepali
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                100% Client-Side Privacy
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Wear Sikkim’s Living Heritage in Real-Time AR
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Step beyond simple social filters. Try on authentic traditional attire from Sikkim’s indigenous communities,
              explore deep cultural symbolism & weaving craftsmanship, and connect directly with certified local weavers and artisan rental hubs across Sikkim.
            </p>

            {/* Quick Feature Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="text-base font-bold text-white">12 Outfits</div>
                <div className="text-[11px] text-slate-400">Authentic community wear</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="text-base font-bold text-teal-400">3-Layer Stack</div>
                <div className="text-[11px] text-slate-400">Robes, sashes & headgear</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="text-base font-bold text-purple-400">Postcard Share</div>
                <div className="text-[11px] text-slate-400">Organic tourism promotion</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="text-base font-bold text-emerald-400">Local Economy</div>
                <div className="text-[11px] text-slate-400">Direct artisan booking</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main AR Studio & Cultural Context Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Core AR Camera Viewport (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Live Interactive AR Mirror</span>
              </h2>
              <span className="text-xs text-emerald-400 font-semibold truncate max-w-[220px]">
                Active: {selectedGarment.name}
              </span>
            </div>

            <ARTryOnStudio
              key={selectedGarment.id}
              customGarment={selectedGarment}
              onExploreVendors={scrollToArtisans}
            />
          </div>

          {/* Right Column: Cultural Lore & Local Artisan Shop Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-400" />
                <span>Cultural Context & Artisans</span>
              </h2>
              <span className="text-xs text-slate-400">
                Indigenous Craftsmanship
              </span>
            </div>

            <div ref={artisanSectionRef}>
              <CulturalContextPanel
                garment={selectedGarment}
                isCurrentlyWearing={true}
              />
            </div>
          </div>
        </div>

        {/* Traditional Wardrobe Selector Section */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Browse 12-Outfit Sikkimese Wardrobe</h2>
                <p className="text-xs text-slate-400">
                  Select any attire to instantly try on and view its indigenous heritage lore
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              Zero-Flicker Preloaded Assets
            </span>
          </div>

          <WardrobeSelector
            selectedGarmentId={selectedGarment.id}
            onSelectGarment={(garment) => {
              setSelectedGarment(garment);
              window.scrollTo({ top: 180, behavior: 'smooth' });
            }}
          />
        </div>

        {/* Technical Architecture & Economic Impact Deep-Dive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Proportional Affine Transformation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically maps Euclidean shoulder distance D(LS-RS) and torso length H(torso) to scale garments smoothly as users step closer or farther from the camera lens.
            </p>
          </div>


          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 w-fit">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Multi-Piece Independent Stacking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Renders base robes, secondary sashes/aprons, and traditional caps (*Dhaka Topi, Gyalshom, Sumbok*) on independent anchor matrices with discrete EMA temporal smoothing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 w-fit">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Local Artisan Economy Multiplier</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Directly links virtual try-on items with verified government-certified weaving cooperatives (*DHH Gangtok, Dzongu Weavers, Namchi Dhaka*), converting tourists into local patrons.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
