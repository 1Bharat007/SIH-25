'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Users,
  User,
  Baby,
  Sparkles,
  Info,
  CheckCircle2,
  Tag,
  Calendar,
} from 'lucide-react';
import {
  GarmentItem,
  SikkimeseCommunity,
  GarmentGenderType,
  GarmentAgeGroupType,
} from '@sikkim-yatra/shared';
import { SIKKIM_GARMENT_WARDROBE } from '../../utils/garment-assets';

interface WardrobeSelectorProps {
  selectedGarmentId: string;
  onSelectGarment: (garment: GarmentItem) => void;
}

const COMMUNITIES: { key: SikkimeseCommunity | 'all'; label: string }[] = [
  { key: 'all', label: 'All Communities' },
  { key: 'Bhutia', label: 'Bhutia (Lhopo)' },
  { key: 'Lepcha', label: 'Lepcha (Rongkup)' },
  { key: 'Nepali', label: 'Nepali (Gorkha)' },
];

const GENDERS: { key: GarmentGenderType | 'all'; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'All Genders', icon: Users },
  { key: 'female', label: 'Women', icon: User },
  { key: 'male', label: 'Men', icon: User },
  { key: 'unisex', label: 'Unisex', icon: Users },
];

const AGE_GROUPS: { key: GarmentAgeGroupType | 'all'; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'All Ages', icon: Users },
  { key: 'adult', label: 'Adults', icon: User },
  { key: 'child', label: 'Children', icon: Baby },
];

export default function WardrobeSelector({
  selectedGarmentId,
  onSelectGarment,
}: WardrobeSelectorProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<SikkimeseCommunity | 'all'>('all');
  const [selectedGender, setSelectedGender] = useState<GarmentGenderType | 'all'>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<GarmentAgeGroupType | 'all'>('all');
  const [search, setSearch] = useState<string>('');
  const [expandedInfoId, setExpandedInfoId] = useState<string | null>(null);

  // Filter garments
  const filteredGarments = useMemo(() => {
    return SIKKIM_GARMENT_WARDROBE.filter((item) => {
      if (selectedCommunity !== 'all' && item.community !== selectedCommunity) {
        return false;
      }
      if (
        selectedGender !== 'all' &&
        item.gender !== selectedGender &&
        item.gender !== 'unisex'
      ) {
        return false;
      }
      if (selectedAgeGroup !== 'all' && item.ageGroup !== selectedAgeGroup) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchNative = item.nativeName?.toLowerCase().includes(q);
        const matchDesc = item.culturalDescription.toLowerCase().includes(q);
        if (!matchName && !matchNative && !matchDesc) return false;
      }
      return true;
    });
  }, [selectedCommunity, selectedGender, selectedAgeGroup, search]);

  return (
    <div className="w-full space-y-6">
      {/* Search and Filters Header */}
      <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/80" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search traditional garments by name (Bakhu, Thokro, Gunyu, Daura), fabric, or lore..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/70 border border-emerald-500/30 text-white text-xs sm:text-sm placeholder-emerald-400/50 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Categories Bar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pt-1">
          {/* Community Selector Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {COMMUNITIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCommunity(c.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  selectedCommunity === c.key
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950/60 text-slate-300 border border-white/10 hover:text-white hover:bg-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Gender & Age Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Gender Toggle */}
            <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-2xl border border-white/10">
              {GENDERS.map((g) => {
                const Icon = g.icon;
                return (
                  <button
                    key={g.key}
                    onClick={() => setSelectedGender(g.key)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                      selectedGender === g.key
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{g.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Age Group Toggle */}
            <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-2xl border border-white/10">
              {AGE_GROUPS.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.key}
                    onClick={() => setSelectedAgeGroup(a.key)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                      selectedAgeGroup === a.key
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Wardrobe Grid Display */}
      {filteredGarments.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-white/10 text-slate-400 space-y-2">
          <p className="text-sm font-semibold text-white">No traditional garments matched your filter.</p>
          <p className="text-xs">Try selecting &quot;All Communities&quot; or clearing your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGarments.map((item) => {
            const isSelected = selectedGarmentId === item.id;
            const isExpanded = expandedInfoId === item.id;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between rounded-3xl p-5 border transition-all ${
                  isSelected
                    ? 'border-emerald-400 bg-gradient-to-b from-slate-900 via-emerald-950/30 to-slate-950 shadow-2xl shadow-emerald-500/20 ring-2 ring-emerald-400/40'
                    : 'border-white/10 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900/80 shadow-lg'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Community & Status Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.community === 'Bhutia'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : item.community === 'Lepcha'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {item.community} Community
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-slate-300 capitalize border border-white/10">
                        {item.gender}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 capitalize border border-purple-500/30">
                        {item.ageGroup}
                      </span>
                    </div>
                  </div>

                  {/* Garment Graphic Preview Frame */}
                  <div
                    onClick={() => onSelectGarment(item)}
                    className="relative w-full aspect-[4/3] rounded-2xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center p-3 cursor-pointer group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                    />

                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-slate-950 p-1 rounded-full shadow-lg">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Garment Title and Native Name */}
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{item.name}</h3>
                    {item.nativeName && (
                      <p className="text-xs text-slate-400 font-serif mt-0.5">{item.nativeName}</p>
                    )}
                  </div>

                  {/* Cultural Description Snippet */}
                  <p className="text-xs text-slate-300/90 leading-relaxed line-clamp-2">
                    {item.culturalDescription}
                  </p>

                  {/* Festival Occasions Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.festivalOccasions.map((fest) => (
                      <span
                        key={fest}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-950/60 text-slate-400 border border-white/5"
                      >
                        <Calendar className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{fest}</span>
                      </span>
                    ))}
                  </div>

                  {/* Expandable Lore Drawer */}
                  {isExpanded && (
                    <div className="mt-3 p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/20 text-xs text-slate-300 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Significance & Weaving Technique:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-400">
                        {item.culturalDescription} Worn proudly during sacred ceremonies to preserve indigenous Himalayan living traditions.
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Row */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setExpandedInfoId(isExpanded ? null : item.id)}
                    className="text-[11px] text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    <span>{isExpanded ? 'Hide Info' : 'Cultural Lore'}</span>
                  </button>

                  <button
                    onClick={() => onSelectGarment(item)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Active in AR' : 'Try On in AR'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
