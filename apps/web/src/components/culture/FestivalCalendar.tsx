'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Download,
} from 'lucide-react';

import { SikkimFestival } from '@sikkim-yatra/shared';

interface FestivalCalendarProps {
  festivals: SikkimFestival[];
}

export default function FestivalCalendar({ festivals }: FestivalCalendarProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');



  const filteredFestivals = festivals.filter((f) => {
    if (selectedCommunity !== 'all' && f.community !== selectedCommunity && f.community !== 'All Communities') {
      return false;
    }
    if (selectedMonth !== 'all' && !f.monthRange.toLowerCase().includes(selectedMonth.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = f.name.toLowerCase().includes(q);
      const matchSummary = f.shortSummary.toLowerCase().includes(q);
      const matchSignificance = f.significance.toLowerCase().includes(q);
      if (!matchName && !matchSummary && !matchSignificance) return false;
    }
    return true;
  });

  const exportICS = (festival: SikkimFestival) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sikkim Yatra//Festival Calendar//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${festival.name} (${festival.localName})`,
      `DESCRIPTION:${festival.shortSummary.replace(/\n/g, ' ')}`,
      `LOCATION:${festival.primeMonasteries.join(', ')}, Sikkim`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${festival.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] space-y-3 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)]">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#5F6368] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search festivals or dances..."
              className="w-full h-9 pl-9 pr-3 rounded-[4px] bg-[#FFFFFF] border border-[#DADCE0] text-[12px] text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#0B3D91]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 text-[12px] w-full sm:w-auto">
            {['all', 'Bhutia', 'Lepcha', 'Nepali'].map((com) => (
              <button
                key={com}
                onClick={() => setSelectedCommunity(com)}
                className={`px-3 py-1 rounded-full border transition-colors font-medium capitalize ${
                  selectedCommunity === com
                    ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                    : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA]'
                }`}
              >
                {com === 'all' ? 'All Communities' : com}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Festivals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFestivals.map((festival) => (
          <div
            key={festival.id}
            className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] shadow-xs space-y-3 flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E8F0FE] text-[#0B3D91] border border-[#D2E3FC]">
                  {festival.community}
                </span>
                <span className="text-[11px] font-medium text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#CEEAD6]">
                  {festival.monthRange}
                </span>
              </div>

              <div>
                <h3 className="text-[16px] font-medium text-[#202124]">{festival.name}</h3>
                <p className="text-[12px] text-[#5F6368]">{festival.localName}</p>
              </div>

              <p className="text-[12px] text-[#5F6368] leading-relaxed line-clamp-3">
                {festival.shortSummary}
              </p>

              {festival.primeMonasteries.length > 0 && (
                <div className="flex items-center gap-1 text-[11px] text-[#5F6368] pt-1">
                  <MapPin className="w-3 h-3 text-[#0B3D91] shrink-0" />
                  <span className="truncate">{festival.primeMonasteries.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#DADCE0] flex items-center justify-between">
              <span className="text-[11px] text-[#5F6368]">
                {festival.tibetanLunarDate}
              </span>

              <button
                onClick={() => exportICS(festival)}
                className="px-2.5 py-1 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] text-[#0B3D91] text-[11px] font-medium flex items-center gap-1 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
