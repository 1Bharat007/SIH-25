'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Users,
  User,
  Baby,
  Info,
  Calendar,
  ChevronDown,
  ChevronUp,
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
      const matchCommunity = selectedCommunity === 'all' || item.community === selectedCommunity;
      const matchGender = selectedGender === 'all' || item.gender === selectedGender;
      const matchAge = selectedAgeGroup === 'all' || item.ageGroup === selectedAgeGroup;
      const matchSearch =
        search === '' ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.categorySlug.toLowerCase().includes(search.toLowerCase()) ||
        item.culturalDescription.toLowerCase().includes(search.toLowerCase());


      return matchCommunity && matchGender && matchAge && matchSearch;
    });
  }, [selectedCommunity, selectedGender, selectedAgeGroup, search]);

  return (
    <div className="w-full space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="space-y-3">
        {/* Google Outlined Search Bar */}
        <div className="relative">
          <label htmlFor="garment-search" className="block text-[12px] text-[#5F6368] font-medium mb-1">
            Search Attire Catalog
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6368]" />
            <input
              id="garment-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name, community (Bhutia, Lepcha, Nepali), or material..."
              className="w-full h-10 pl-9 pr-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#0B3D91] focus:ring-1 focus:ring-[#0B3D91]"
            />
          </div>
        </div>

        {/* Filter Categories Chips Row */}
        <div className="flex flex-wrap gap-4 items-center pt-1 text-[12px]">
          {/* Community Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#5F6368] font-medium mr-1">Community:</span>
            {COMMUNITIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCommunity(c.key)}
                className={`px-2.5 py-1 rounded-full border transition-colors font-medium ${
                  selectedCommunity === c.key
                    ? 'bg-[#E8F0FE] text-[#0B3D91] border-[#D2E3FC]'
                    : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Gender Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#5F6368] font-medium mr-1">Gender:</span>
            {GENDERS.map((g) => (
              <button
                key={g.key}
                onClick={() => setSelectedGender(g.key)}
                className={`px-2.5 py-1 rounded-full border transition-colors font-medium ${
                  selectedGender === g.key
                    ? 'bg-[#E8F0FE] text-[#0B3D91] border-[#D2E3FC]'
                    : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Age Group Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#5F6368] font-medium mr-1">Age:</span>
            {AGE_GROUPS.map((a) => (
              <button
                key={a.key}
                onClick={() => setSelectedAgeGroup(a.key)}
                className={`px-2.5 py-1 rounded-full border transition-colors font-medium ${
                  selectedAgeGroup === a.key
                    ? 'bg-[#E8F0FE] text-[#0B3D91] border-[#D2E3FC]'
                    : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wardrobe Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredGarments.map((garment) => {
          const isSelected = selectedGarmentId === garment.id;
          const isExpanded = expandedInfoId === garment.id;

          return (
            <div
              key={garment.id}
              onClick={() => onSelectGarment(garment)}
              className={`group relative flex flex-col justify-between rounded-[8px] bg-[#FFFFFF] border transition-all cursor-pointer p-3.5 text-left ${
                isSelected
                  ? 'border-[#0B3D91] ring-2 ring-[#0B3D91]/20 shadow-sm'
                  : 'border-[#DADCE0] hover:border-[#BDC1C6] hover:shadow-[0_1px_3px_0_rgba(60,64,67,0.12)]'
              }`}
            >
              {/* Top Community & Gender Status Badges */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                    garment.community === 'Bhutia'
                      ? 'bg-[#E8F0FE] text-[#1A73E8] border-[#D2E3FC]'
                      : garment.community === 'Lepcha'
                        ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]'
                        : 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]'
                  }`}
                >
                  {garment.community}
                </span>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#5F6368] capitalize">
                    {garment.gender} • {garment.ageGroup}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#1E8E3E]" title="Active in camera mirror" />
                  )}
                </div>
              </div>

              {/* Garment Preview Image Thumbnail */}
              <div className="relative w-full aspect-square rounded-[4px] bg-[#F8F9FA] border border-[#DADCE0] p-2 flex items-center justify-center overflow-hidden mb-2.5">
                <img
                  src={garment.imageUrl}
                  alt={garment.name}
                  className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Garment Details & Nomenclature */}
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-[14px] font-medium text-[#202124] leading-snug">
                    {garment.name}
                  </h4>
                </div>

                <p className="text-[11px] text-[#5F6368] italic line-clamp-1">
                  Style: {garment.categorySlug.replace('-', ' ')}
                </p>

                <p className="text-[12px] text-[#5F6368] line-clamp-2 leading-relaxed">
                  {garment.culturalDescription}
                </p>
              </div>

              {/* Expandable Weaving Lore */}
              {isExpanded && garment.craftNotes && (
                <div
                  className="mt-2.5 pt-2 border-t border-[#DADCE0] text-[11px] text-[#5F6368] space-y-1 bg-[#F8F9FA] p-2 rounded-[4px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1 font-medium text-[#202124]">
                    <Calendar className="w-3 h-3 text-[#0B3D91]" />
                    <span>Occasion: {garment.festivalOccasions?.join(', ') || 'Festive'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#202124]">Material: </span>
                    {Array.isArray(garment.craftNotes.materials) ? garment.craftNotes.materials.join(', ') : garment.craftNotes.materials}
                  </div>
                  <div>
                    <span className="font-medium text-[#202124]">Cluster: </span>
                    {garment.craftNotes.producingRegion}
                  </div>
                </div>
              )}


              {/* Card Action Footer */}
              <div className="mt-3 pt-2 border-t border-[#DADCE0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedInfoId(isExpanded ? null : garment.id);
                  }}
                  className="text-[11px] text-[#0B3D91] hover:underline font-medium flex items-center gap-0.5"
                >
                  <Info className="w-3 h-3" />
                  <span>{isExpanded ? 'Less info' : 'Craft notes'}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectGarment(garment);
                  }}
                  className={`px-2.5 py-1 rounded-[4px] text-[11px] font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]'
                      : 'bg-[#0B3D91] text-[#FFFFFF] hover:bg-[#082E6E]'
                  }`}
                >
                  {isSelected ? 'Wearing Now' : 'Try On'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGarments.length === 0 && (
        <div className="text-center py-10 bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] space-y-2">
          <p className="text-[14px] font-medium text-[#202124]">No traditional outfits match your search criteria.</p>
          <p className="text-[12px] text-[#5F6368]">Try clearing your search query or selecting "All Communities".</p>
          <button
            onClick={() => {
              setSelectedCommunity('all');
              setSelectedGender('all');
              setSelectedAgeGroup('all');
              setSearch('');
            }}
            className="mt-2 px-3 py-1.5 rounded-[4px] bg-[#0B3D91] text-[#FFFFFF] text-[12px] font-medium hover:bg-[#082E6E]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
