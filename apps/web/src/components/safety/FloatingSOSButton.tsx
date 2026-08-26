'use client';

import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import SOSModal from './SOSModal';

export default function FloatingSOSButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9990]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative flex items-center gap-2 rounded-full border-2 border-rose-400 bg-gradient-to-r from-rose-600 to-red-700 px-4 py-3.5 text-white shadow-2xl shadow-rose-950/80 transition-all hover:scale-105 active:scale-95 hover:from-rose-500 hover:to-red-600 focus:outline-none focus:ring-4 focus:ring-rose-500/50"
          aria-label="Emergency SOS Trigger"
        >
          {/* Animated Pulse Halo */}
          <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-rose-600/40 opacity-75 duration-1000" />

          <ShieldAlert className="h-5 w-5 animate-pulse text-white" />
          <span className="text-xs font-black uppercase tracking-wider">SOS</span>
        </button>
      </div>

      <SOSModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
