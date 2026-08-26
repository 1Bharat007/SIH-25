'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  MapPin,
  Flame,
  Search,
  Music,
  CheckCircle2,
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
      `SUMMARY:🎉 ${festival.name} (${festival.localName})`,
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
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Sikkimese Cultural Calendar
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Sacred Festivals & Monastic Cham Dances
            </h2>
            <p className="text-xs text-white/70 mt-1 max-w-2xl">
              Experience the ancient Tibetan lunar calendar festivals, sacred masked dance rituals (Cham), and nature-worship ceremonies of Sikkim.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search festivals or dances..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-black/40 border border-white/20 text-white text-xs placeholder-white/40 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {['all', 'Buddhist', 'Lepcha', 'Nepali'].map((comm) => (
              <button
                key={comm}
                onClick={() => setSelectedCommunity(comm)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all capitalize flex-shrink-0 ${
                  selectedCommunity === comm
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-black/30 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                {comm === 'all' ? 'All Traditions' : `${comm} Festivals`}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:ml-auto">
            {['all', 'January', 'February', 'March', 'May', 'August', 'September', 'December'].map(
              (m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all capitalize flex-shrink-0 ${
                    selectedMonth === m
                      ? 'bg-white text-slate-950 font-bold'
                      : 'bg-black/20 text-white/60 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Festival Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFestivals.map((festival) => (
          <div
            key={festival.id}
            className="p-6 rounded-3xl bg-slate-900 border border-purple-500/20 shadow-xl space-y-4 hover:border-purple-400/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {festival.community}
                  </span>
                  <span className="text-xs text-white/50">{festival.monthRange}</span>
                </div>

                <button
                  onClick={() => exportICS(festival)}
                  title="Add to Google Calendar / iCal"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-purple-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add to Cal</span>
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{festival.name}</h3>
                <p className="text-xs text-purple-200/70 font-medium">{festival.localName}</p>
              </div>

              {festival.tibetanLunarDate && (
                <div className="text-[11px] text-amber-300 font-semibold bg-amber-950/30 px-3 py-1 rounded-xl border border-amber-500/20 w-fit">
                  🌙 Lunar Date: {festival.tibetanLunarDate}
                </div>
              )}

              <p className="text-xs text-white/80 leading-relaxed">{festival.shortSummary}</p>

              {/* Ritual Highlights */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-purple-400" />
                  Key Celebrations & Rituals:
                </span>
                <ul className="space-y-1 text-xs text-white/70">
                  {festival.ritualsAndCelebrations.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-[11px]">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cham Masked Dance Badges */}
              {festival.chamDancesFeatured && festival.chamDancesFeatured.length > 0 && (
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                    <Music className="w-3 h-3 text-amber-400" />
                    Sacred Cham Dances Performed:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {festival.chamDancesFeatured.map((dance, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg text-[10px] bg-amber-500/20 text-amber-200 border border-amber-500/30 font-medium"
                      >
                        🎭 {dance}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Best Monastery Venues Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center gap-1 truncate max-w-[280px]">
                <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span className="truncate">{festival.primeMonasteries.join(' • ')}</span>
              </div>

              <span className="text-[11px] text-white/40">2025: {festival.approximateDates2025}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
