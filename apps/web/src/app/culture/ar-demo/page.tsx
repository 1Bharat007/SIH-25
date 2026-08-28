'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  Layers,
  Shirt,
  Compass,
  HeartHandshake,
  CheckCircle2,
  Cpu,
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
    <main className="min-h-screen bg-[#F8F9FA] text-[#202124] px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#5F6368]">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-[#0B3D91] hover:underline font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portal Overview</span>
            </Link>
            <span>/</span>
            <Link href="/culture" className="text-[#0B3D91] hover:underline font-medium">
              Cultural Heritage
            </Link>
            <span>/</span>
            <span className="text-[#202124] font-medium">AR Attire Studio</span>
          </div>

          <div className="flex items-center gap-2 bg-[#FFFFFF] px-2.5 py-1 rounded-full border border-[#DADCE0] text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span className="text-[#5F6368]">Engine: MediaPipe WASM/GPU (30+ FPS)</span>
          </div>
        </div>

        {/* Section Header Card */}
        <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-5 sm:p-6 space-y-3 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]">
              Virtual Attire Simulator
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
              Bhutia • Lepcha • Nepali
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F8F9FA] text-[#5F6368] border border-[#DADCE0]">
              100% Client-Side Privacy
            </span>
          </div>

          <h1 className="text-[22px] leading-[28px] font-medium text-[#202124]">
            Traditional Sikkimese AR Attire Studio
          </h1>

          <p className="text-[14px] leading-[20px] text-[#5F6368] max-w-4xl">
            Experience authentic traditional attire from Sikkim’s indigenous communities.
            The system tracks your posture in real-time, adjusts garment proportions dynamically,
            and links each outfit with certified local handloom weavers and rental clusters across Sikkim.
          </p>
        </div>

        {/* Studio & Cultural Context Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Core AR Camera Mirror Viewport (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-medium text-[#202124] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#0B3D91]" />
                <span>Live Interactive AR Mirror</span>
              </h2>
              <span className="text-[12px] font-medium text-[#0B3D91] bg-[#E8F0FE] px-2 py-0.5 rounded-full border border-[#D2E3FC]">
                {selectedGarment.name}
              </span>
            </div>

            <ARTryOnStudio
              key={selectedGarment.id}
              customGarment={selectedGarment}
              onExploreVendors={scrollToArtisans}
            />
          </div>

          {/* Right: Cultural Lore & Local Artisan Shop Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-medium text-[#202124] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#0B3D91]" />
                <span>Cultural Context & Artisans</span>
              </h2>
              <span className="text-[11px] text-[#5F6368]">
                Verified Heritage
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

        {/* 12-Outfit Wardrobe Selector Section */}
        <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-5 sm:p-6 space-y-4 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DADCE0] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-[4px] bg-[#E8F0FE] text-[#0B3D91]">
                <Shirt className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-[16px] font-medium text-[#202124]">
                  Browse 12-Outfit Traditional Wardrobe
                </h2>
                <p className="text-[12px] text-[#5F6368]">
                  Select any attire to preview on your camera feed and view authenticated weaving notes.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-[#137333] bg-[#E6F4EA] px-2.5 py-1 rounded-full border border-[#CEEAD6]">
              Instant In-Memory Switching
            </span>
          </div>

          <WardrobeSelector
            selectedGarmentId={selectedGarment.id}
            onSelectGarment={(garment) => {
              setSelectedGarment(garment);
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
          />
        </div>

        {/* Enterprise Technical & Socioeconomic Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-4 space-y-2">
            <div className="w-8 h-8 rounded-[4px] bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-[14px] font-medium text-[#202124]">
              Affine Proportional Tracking
            </h3>
            <p className="text-[12px] text-[#5F6368] leading-relaxed">
              Dynamically scales width and height using Euclidean shoulder and torso anchors for smooth sizing as you step back.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-4 space-y-2">
            <div className="w-8 h-8 rounded-[4px] bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-[14px] font-medium text-[#202124]">
              Multi-Layer Stacking Matrices
            </h3>
            <p className="text-[12px] text-[#5F6368] leading-relaxed">
              Base robes, outer sashes/aprons, and traditional headgear (*Dhaka Topi, Gyalshom, Sumbok*) render with independent z-index coordinates.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-4 space-y-2">
            <div className="w-8 h-8 rounded-[4px] bg-[#E6F4EA] text-[#1E8E3E] flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h3 className="text-[14px] font-medium text-[#202124]">
              Local Artisan Economy Multiplier
            </h3>
            <p className="text-[12px] text-[#5F6368] leading-relaxed">
              Directly links virtual outfits to verified cooperatives (*DHH Gangtok, Dzongu Weavers, Namchi Dhaka*) for tourism revenue generation.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
