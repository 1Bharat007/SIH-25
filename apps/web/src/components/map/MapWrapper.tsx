'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Mountain } from 'lucide-react';
import { MapLayersResponse, MapFeatureItem } from '@sikkim-yatra/shared';

interface MapWrapperProps {
  data?: MapLayersResponse;
  selectedCoordinates?: [number, number];
  heightClass?: string;
  onMarkerSelect?: (feature: MapFeatureItem) => void;
}

// Dynamically import SikkimMap with ssr: false so Leaflet loads safely only in the browser
const DynamicSikkimMap = dynamic(() => import('./SikkimMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[550px] w-full flex-col items-center justify-center rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-6 text-center shadow-xl backdrop-blur-xl">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
        <Mountain className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-base font-bold text-white">Loading Sikkim Himalayan Map...</h3>
      <p className="mt-1 text-xs text-emerald-300/70">
        Rendering OpenStreetMap tiles, cultural trails & emergency layers
      </p>
      <div className="mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-emerald-950">
        <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-teal-300 animate-pulse" />
      </div>
    </div>
  ),
});

export default function MapWrapper(props: MapWrapperProps) {
  return <DynamicSikkimMap {...props} />;
}
