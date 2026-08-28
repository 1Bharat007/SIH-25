'use client';

import React, { useState } from 'react';
import {
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { MonasteryProfile } from '@sikkim-yatra/shared';

interface MonasteryGuideCardProps {
  monastery: MonasteryProfile;
  onLaunch360Tour?: (panoramaSceneId?: string) => void;
}

export default function MonasteryGuideCard({
  monastery,
  onLaunch360Tour,
}: MonasteryGuideCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] shadow-xs space-y-3 hover:shadow-sm transition-all flex flex-col justify-between">
      <div className="space-y-2.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E8F0FE] text-[#0B3D91] border border-[#D2E3FC]">
              {monastery.lineage} Order
            </span>
            <span className="text-[11px] text-[#5F6368]">{monastery.district} District</span>
          </div>

          <span className="text-[11px] text-[#5F6368] font-medium">
            Est. {monastery.foundedYear} CE
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-[16px] font-medium text-[#202124]">{monastery.name}</h3>
          <p className="text-[12px] text-[#5F6368]">{monastery.localName}</p>
        </div>

        {/* Overview */}
        <p className="text-[12px] text-[#5F6368] leading-relaxed line-clamp-3">
          {monastery.description}
        </p>

        {/* Quick Facts Strip */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-[4px] bg-[#F8F9FA] border border-[#DADCE0] text-[11px]">
          <div>
            <span className="text-[#5F6368] block">Founder:</span>
            <strong className="text-[#202124] truncate block">{monastery.founder}</strong>
          </div>
          <div>
            <span className="text-[#5F6368] block">Altitude:</span>
            <strong className="text-[#202124]">{monastery.altitudeMeters} m</strong>
          </div>
        </div>

        {/* Expandable Architectural Details */}
        {isExpanded && (
          <div className="pt-2 border-t border-[#DADCE0] space-y-2 text-[12px] text-[#5F6368]">
            <div>
              <span className="font-medium text-[#202124] block">Key Relics & Art:</span>
              <ul className="list-disc list-inside space-y-0.5 mt-1">
                {monastery.sacredRelics?.map((relic, idx) => (
                  <li key={idx}><strong className="text-[#202124]">{relic.name}</strong> ({relic.century}) - {relic.significance}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-medium text-[#202124] block">Annual Cham Dances:</span>
              <p className="mt-0.5">{monastery.annualChamDanceMonth || 'Held according to Tibetan lunar calendar'}</p>
            </div>
          </div>
        )}

      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-[#DADCE0] flex items-center justify-between gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] text-[#0B3D91] hover:underline font-medium flex items-center gap-1"
        >
          <span>{isExpanded ? 'Less details' : 'View relics'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {monastery.panoramaSceneId && onLaunch360Tour && (
          <button
            onClick={() => onLaunch360Tour(monastery.panoramaSceneId)}
            className="px-3 py-1.5 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[11px] font-medium transition-colors flex items-center gap-1"
          >
            <Compass className="w-3 h-3" />
            <span>Launch 360° Tour</span>
          </button>
        )}
      </div>
    </div>
  );
}
