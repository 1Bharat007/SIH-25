'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Shield, Camera, Cpu, Layers, Shirt } from 'lucide-react';
import ARTryOnStudio from '../../../components/culture/ARTryOnStudio';
import WardrobeSelector from '../../../components/culture/WardrobeSelector';
import { TEST_GARMENT_ITEM } from '../../../utils/garment-assets';
import { GarmentItem } from '@sikkim-yatra/shared';

export default function ARDemoPage() {
  const [selectedGarment, setSelectedGarment] = useState<GarmentItem>(TEST_GARMENT_ITEM);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/culture"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cultural Heritage Hub</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>MediaPipe PoseLandmarker (WASM/GPU)</span>
          </div>
        </div>

        {/* Header Title Section */}
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-teal-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time AR Body Tracking</span>
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              12 Traditional Sikkimese Outfits
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Active: {selectedGarment.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Traditional Sikkimese AR Attire Studio
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Select any authentic attire from Sikkim&apos;s three indigenous communities (Bhutia, Lepcha, Nepali) below.
            The garment dynamically tracks your posture, tilts with your shoulders, and scales in real-time at 30+ FPS.
          </p>
        </div>

        {/* Live Core AR Camera Component with Active Garment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Live Webcam AR Preview</span>
            </h2>
            <span className="text-xs text-emerald-400 font-semibold">
              Currently Wearing: {selectedGarment.name}
            </span>
          </div>
          <ARTryOnStudio key={selectedGarment.id} customGarment={selectedGarment} />
        </div>

        {/* Traditional Wardrobe Selector Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Shirt className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Sikkimese Cultural Wardrobe</h2>
                <p className="text-xs text-slate-400">
                  Filter by community, gender, or age to try on authentic robes, waistcoats, and sashes
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              12 Authentic Attires
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


        {/* Feature & Technical Architecture Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Dynamic Shoulder-Width Scaling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates Euclidean distance between left and right shoulder landmarks (11 & 12) to scale the robe proportionally as you move closer or farther.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 w-fit">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Temporal EMA Coordinate Smoothing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applies Exponential Moving Average damping (alpha = 0.65) to eliminate camera jitter and create smooth cloth motion across video frames.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 w-fit">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Graceful Edge Handling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides real-time feedback for camera permissions, out-of-frame positions, and low-lighting confidence states with 1-click HD photo capture.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
