'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Camera,
  Calendar,
  Building,
  ArrowLeft,
  Eye,
  Search,
  BookOpen,
  Loader2,
} from 'lucide-react';

import {
  MonasteryProfile,
  PanoramaScene,
  TraditionalAttire,
  SikkimFestival,
  MonasteryLineage,
} from '@sikkim-yatra/shared';
import {
  fetchMonasteries,
  fetchPanoramaScenes,
  fetchTraditionalAttire,
  fetchFestivals,
} from '../../services/culture.service';
import PanoramaViewer360 from '../../components/culture/PanoramaViewer360';
import AttireTryOnStudio from '../../components/culture/AttireTryOnStudio';
import FestivalCalendar from '../../components/culture/FestivalCalendar';
import MonasteryGuideCard from '../../components/culture/MonasteryGuideCard';

type CultureTab = 'panoramas' | 'attire_studio' | 'monasteries' | 'festivals';

export default function CultureHubPage() {
  const [activeTab, setActiveTab] = useState<CultureTab>('panoramas');
  const [selectedLineageFilter, setSelectedLineageFilter] = useState<MonasteryLineage | 'all'>('all');
  const [monasterySearch, setMonasterySearch] = useState<string>('');

  const [monasteries, setMonasteries] = useState<MonasteryProfile[]>([]);
  const [panoramaScenes, setPanoramaScenes] = useState<PanoramaScene[]>([]);
  const [attireCatalog, setAttireCatalog] = useState<TraditionalAttire[]>([]);
  const [festivals, setFestivals] = useState<SikkimFestival[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedInitialPanoramaId, setSelectedInitialPanoramaId] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadCultureData() {
      try {
        setIsLoading(true);
        const [monData, panoData, attireData, festData] = await Promise.all([
          fetchMonasteries(),
          fetchPanoramaScenes(),
          fetchTraditionalAttire(),
          fetchFestivals(),
        ]);

        setMonasteries(monData);
        setPanoramaScenes(panoData);
        setAttireCatalog(attireData);
        setFestivals(festData);
      } catch (err) {
        console.warn('Failed to load cultural data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCultureData();
  }, []);

  const handleLaunch360TourFromCard = (panoramaSceneId?: string) => {
    if (panoramaSceneId) {
      setSelectedInitialPanoramaId(panoramaSceneId);
      setActiveTab('panoramas');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredMonasteries = monasteries.filter((m) => {
    if (selectedLineageFilter !== 'all' && m.lineage !== selectedLineageFilter) return false;
    if (monasterySearch.trim() !== '') {
      const q = monasterySearch.toLowerCase().trim();
      const matchName = m.name.toLowerCase().includes(q);
      const matchLocal = m.localName.toLowerCase().includes(q);
      const matchDesc = m.description.toLowerCase().includes(q);
      if (!matchName && !matchLocal && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#031e1a] via-[#021815] to-black text-slate-100 pb-20">
      {/* Top Heritage Ambient Banner */}
      <div className="relative border-b border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-950 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Sikkim Cultural Heritage & AR Hub
                </span>
                <span className="text-xs text-white/50">Buddhist Shrines • Living Traditions</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Sacred Monasteries, 360° Virtual Pilgrimage & Traditional AR
              </h1>
              <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Step inside centuries-old Himalayan chanting halls, explore sacred Buddhist relics, try on authentic Sikkimese attire, and discover upcoming festival Cham dances.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/explore"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all flex items-center gap-2 border border-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Explore Map</span>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto gap-2 mt-8 pt-4 border-t border-white/10 scrollbar-none">
            <button
              onClick={() => setActiveTab('panoramas')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'panoramas'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20 font-extrabold'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>360° Virtual Pilgrimage ({panoramaScenes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('attire_studio')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'attire_studio'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20 font-extrabold'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Traditional Attire AR Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('monasteries')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'monasteries'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20 font-extrabold'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Sacred Monasteries ({monasteries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('festivals')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'festivals'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20 font-extrabold'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Festival & Cham Calendar ({festivals.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {isLoading ? (
          <div className="p-16 text-center text-white/70 bg-slate-900/60 rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-sm font-semibold">Loading Sacred Monasteries & Cultural Archives...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: 360° VIRTUAL MONASTERY PANORAMA */}
            {activeTab === 'panoramas' && (
              <div className="space-y-6 animate-fadeIn">
                {panoramaScenes.length > 0 ? (
                  <PanoramaViewer360
                    scenes={panoramaScenes}
                    initialSceneId={selectedInitialPanoramaId}
                  />
                ) : (
                  <div className="p-12 text-center text-white/60 bg-slate-900 rounded-3xl">
                    No 360° Panorama Scenes available.
                  </div>
                )}


            {/* Cultural Context Cards below 360 viewer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 space-y-2">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 w-fit">
                  <Eye className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Interactive 3D Hotspots</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Click the golden glowing pins inside the chanting halls to discover the Golden Stupa of the 16th Karmapa, silk thangkas, and sacred Kangyur scriptures.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 space-y-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Equirectangular VR Navigation</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Engineered with WebGL spherical projections for seamless 360-degree look-around with field-of-view zoom and smooth momentum controls.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 space-y-2">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 w-fit">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-white">Sacred Monastic Lore</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Includes authentic historical documentation, Tibetan scripture transliterations, and spiritual significance verified with monastic authorities.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRADITIONAL ATTIRE AR TRY-ON STUDIO */}
        {activeTab === 'attire_studio' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Live MediaPipe Pose AR Studio Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  New • MediaPipe Pose Estimation
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>Real-Time Body-Tracking AR Studio (Single Garment Demo)</span>
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Experience real-time shoulder tracking and dynamic garment scaling at 30+ FPS directly through your webcam.
                </p>
              </div>

              <Link
                href="/culture/ar-demo"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 flex-shrink-0"
              >
                <Camera className="w-4 h-4 text-slate-950" />
                <span>Launch Live AR Camera Demo</span>
              </Link>
            </div>

            {attireCatalog.length > 0 ? (
              <AttireTryOnStudio attireCatalog={attireCatalog} />
            ) : (
              <div className="p-12 text-center text-white/60 bg-slate-900 rounded-3xl">
                Loading Traditional Attire Catalog...
              </div>
            )}
          </div>
        )}


        {/* TAB 3: SACRED MONASTERIES & HERITAGE GUIDES */}
        {activeTab === 'monasteries' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Lineage Filters Bar */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Lineage Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {['all', 'Nyingma', 'Karma Kagyu'].map((lineage) => (
                  <button
                    key={lineage}
                    onClick={() => setSelectedLineageFilter(lineage as MonasteryLineage | 'all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize flex-shrink-0 ${
                      selectedLineageFilter === lineage
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'bg-black/30 text-white/70 hover:text-white border border-white/10'
                    }`}
                  >
                    {lineage === 'all' ? 'All Lineages' : `${lineage} Order`}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={monasterySearch}
                  onChange={(e) => setMonasterySearch(e.target.value)}
                  placeholder="Search monastery or founder..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-black/40 border border-white/20 text-white text-xs placeholder-white/40 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Monasteries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMonasteries.map((monastery) => (
                <MonasteryGuideCard
                  key={monastery.id}
                  monastery={monastery}
                  onLaunch360Tour={handleLaunch360TourFromCard}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FESTIVAL & CHAM DANCE CALENDAR */}
        {activeTab === 'festivals' && (
          <div className="animate-fadeIn">
            {festivals.length > 0 ? (
              <FestivalCalendar festivals={festivals} />
            ) : (
              <div className="p-12 text-center text-white/60 bg-slate-900 rounded-3xl">
                Loading Festival Calendar...
              </div>
            )}
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
}

