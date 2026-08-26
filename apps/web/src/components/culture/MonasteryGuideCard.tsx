'use client';

import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ShieldCheck,
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
    <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/20 shadow-xl space-y-4 hover:border-amber-400/50 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {monastery.lineage} Lineage
            </span>
            <span className="text-xs text-white/50">{monastery.district} District</span>
          </div>

          <span className="text-xs text-amber-400 font-semibold">
            Est. {monastery.foundedYear} CE
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-xl font-bold text-white">{monastery.name}</h3>
          <p className="text-xs text-amber-200/70 font-medium">{monastery.localName}</p>
        </div>

        {/* Overview */}
        <p className="text-xs text-white/80 leading-relaxed line-clamp-3">
          {monastery.description}
        </p>

        {/* Quick Facts Strip */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/40 border border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-white/40 block">Founder:</span>
            <strong className="text-white text-[11px] truncate block">{monastery.founder}</strong>
          </div>
          <div>
            <span className="text-[10px] text-white/40 block">Altitude:</span>
            <strong className="text-amber-300 text-[11px]">⛰️ {monastery.altitudeMeters} m</strong>
          </div>
        </div>

        {/* Sacred Relics Preview */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Sacred Relics Enshrined:
          </span>
          <div className="space-y-1">
            {monastery.sacredRelics.slice(0, 2).map((relic, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-white/5 text-[11px] flex items-center justify-between"
              >
                <span className="text-white font-medium">{relic.name}</span>
                <span className="text-[10px] text-amber-400/80">{relic.century}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expandable Monastic Etiquette Section */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-white/10 text-xs animate-fadeIn">
            <div>
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5 mb-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Monastery Visitor Etiquette Code:
              </h4>
              <ul className="space-y-1.5">
                {monastery.etiquetteRules.map((rule, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-black/30 text-white/80 space-y-0.5">
                    <strong className="text-emerald-300 block text-[11px]">👉 {rule.rule}</strong>
                    <p className="text-[10px] text-white/60">{rule.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-white/5 space-y-1 text-[11px] text-white/70">
              <div className="flex justify-between">
                <span>Visiting Hours:</span>
                <strong className="text-white">{monastery.visitingHours}</strong>
              </div>
              <div className="flex justify-between">
                <span>Entry Fee:</span>
                <strong className="text-white">{monastery.entryFee}</strong>
              </div>
              {monastery.annualChamDanceMonth && (
                <div className="flex justify-between">
                  <span>Cham Dance Season:</span>
                  <strong className="text-amber-300">{monastery.annualChamDanceMonth}</strong>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <div className="flex gap-2">
          {monastery.panoramaSceneId && (
            <button
              onClick={() => onLaunch360Tour && onLaunch360Tour(monastery.panoramaSceneId)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Launch 360° Virtual Tour</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <span>{isExpanded ? 'Less' : 'Etiquette'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
