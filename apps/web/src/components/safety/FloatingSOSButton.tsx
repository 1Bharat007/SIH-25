'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import SOSModal from './SOSModal';

export default function FloatingSOSButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[9990]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-full border border-[#FAD2CF] bg-[#D93025] hover:bg-[#C5221F] px-4 py-2.5 text-[#FFFFFF] shadow-[0_2px_6px_0_rgba(60,64,67,0.3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D93025] cursor-pointer"
          aria-label="Emergency SOS Trigger"
        >
          <AlertCircle className="h-4 w-4 text-[#FFFFFF]" />
          <span className="text-[13px] font-medium tracking-wide">Emergency SOS</span>
        </button>
      </div>

      <SOSModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
