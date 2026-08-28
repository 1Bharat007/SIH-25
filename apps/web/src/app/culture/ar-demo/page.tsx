'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Shield, Camera, Cpu, Layers } from 'lucide-react';
import ARTryOnStudio from '../../../components/culture/ARTryOnStudio';
import { TEST_GARMENT_ITEM } from '../../../utils/garment-assets';

export default function ARDemoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
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
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Isolated AR Engine Validation</span>
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Test Garment #1
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Real-Time Body-Tracking AR Try-On Studio
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Running real-time 33-point pose landmark estimation via MediaPipe Tasks Vision. 
            The traditional Sikkimese royal silk Bakhu & Kera sash proportionally scales to your shoulder distance and aligns with your body posture at 30+ FPS.
          </p>
        </div>

        {/* Isolated Core AR Component */}
        <ARTryOnStudio customGarment={TEST_GARMENT_ITEM} />

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
