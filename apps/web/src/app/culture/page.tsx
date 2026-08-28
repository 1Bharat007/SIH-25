'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Camera,
  Calendar,
  Building,
  ArrowLeft,
  Eye,
  Search,
  BookOpen,
  Loader2,
  ArrowRight,
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
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] pb-16">
      {/* Top Header Card */}
      <div className="bg-[#FFFFFF] border-b border-[#DADCE0]">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[12px] text-[#5F6368]">
              <Link href="/" className="text-[#0B3D91] hover:underline font-medium flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Portal Overview</span>
              </Link>
              <span>/</span>
              <span className="text-[#202124] font-medium">Cultural Heritage Hub</span>
            </div>

            <Link
              href="/culture/ar-demo"
              className="px-3 py-1.5 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[12px] font-medium transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Launch Live AR Attire Studio</span>
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="text-[22px] font-medium text-[#202124] leading-tight">
              Sikkim Cultural Heritage & Monastic Preservation
            </h1>
            <p className="text-[14px] text-[#5F6368] max-w-3xl leading-relaxed">
              Explore 360° virtual tours of sacred Buddhist shrines, authenticated Bhutia, Lepcha & Nepali attire,
              and official monastic festival calendars.
            </p>
          </div>

          {/* Navigation Tabs (Google Outlined Pill Style) */}
          <div className="flex overflow-x-auto gap-2 pt-2 border-t border-[#DADCE0] scrollbar-none text-[13px]">
            <button
              onClick={() => setActiveTab('panoramas')}
              className={`px-3.5 py-1.5 rounded-full border transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'panoramas'
                  ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                  : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>360° Pilgrimage Tours ({panoramaScenes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('attire_studio')}
              className={`px-3.5 py-1.5 rounded-full border transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'attire_studio'
                  ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                  : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Traditional Attire Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('monasteries')}
              className={`px-3.5 py-1.5 rounded-full border transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'monasteries'
                  ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                  : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Sacred Monasteries ({monasteries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('festivals')}
              className={`px-3.5 py-1.5 rounded-full border transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'festivals'
                  ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                  : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Festival & Cham Calendar ({festivals.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {isLoading ? (
          <div className="p-12 text-center text-[#5F6368] bg-[#FFFFFF] rounded-[8px] border border-[#DADCE0] flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-[#0B3D91] animate-spin" />
            <p className="text-[13px] font-medium text-[#202124]">Loading Cultural Archives & Monasteries...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: 360° VIRTUAL MONASTERY PANORAMA */}
            {activeTab === 'panoramas' && (
              <div className="space-y-4">
                {panoramaScenes.length > 0 ? (
                  <PanoramaViewer360
                    scenes={panoramaScenes}
                    initialSceneId={selectedInitialPanoramaId}
                  />
                ) : (
                  <div className="p-8 text-center text-[#5F6368] bg-[#FFFFFF] rounded-[8px] border border-[#DADCE0]">
                    No 360° Panorama Scenes available.
                  </div>
                )}

                {/* Cultural Context Cards below 360 viewer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] space-y-1.5">
                    <div className="w-7 h-7 rounded-[4px] bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </div>
                    <h4 className="text-[14px] font-medium text-[#202124]">Interactive 3D Hotspots</h4>
                    <p className="text-[12px] text-[#5F6368] leading-relaxed">
                      Select hotspot pins inside chanting halls to examine the Golden Stupa of the 16th Karmapa, ancient silk thangkas, and sacred Kangyur scriptures.
                    </p>
                  </div>

                  <div className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] space-y-1.5">
                    <div className="w-7 h-7 rounded-[4px] bg-[#E6F4EA] text-[#1E8E3E] flex items-center justify-center">
                      <Compass className="w-4 h-4" />
                    </div>
                    <h4 className="text-[14px] font-medium text-[#202124]">WebGL Spherical Navigation</h4>
                    <p className="text-[12px] text-[#5F6368] leading-relaxed">
                      Built with WebGL projections for 360-degree rotation with pitch/yaw clamping, field-of-view zoom, and touch gesture support.
                    </p>
                  </div>

                  <div className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] space-y-1.5">
                    <div className="w-7 h-7 rounded-[4px] bg-[#FEF7E0] text-[#B06000] flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <h4 className="text-[14px] font-medium text-[#202124]">Monastic Documentation</h4>
                    <p className="text-[12px] text-[#5F6368] leading-relaxed">
                      Archival records, Tibetan transliterations, and historical lineage verified in consultation with Sikkim Ecclesiastical Affairs Department.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TRADITIONAL ATTIRE AR TRY-ON STUDIO */}
            {activeTab === 'attire_studio' && (
              <div className="space-y-4">
                {/* Live MediaPipe Pose AR Studio Banner */}
                <div className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)]">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
                      MediaPipe Vision Engine
                    </span>
                    <h3 className="text-[15px] font-medium text-[#202124]">
                      Real-Time Body-Tracking AR Attire Studio (12 Outfits)
                    </h3>
                    <p className="text-[12px] text-[#5F6368]">
                      Experience real-time shoulder tracking, posture alignment, and dynamic scaling across Bhutia, Lepcha, and Nepali traditional attires.
                    </p>
                  </div>

                  <Link
                    href="/culture/ar-demo"
                    className="px-4 py-2 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[12px] font-medium transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Launch AR Camera Studio</span>
                  </Link>
                </div>

                {attireCatalog.length > 0 ? (
                  <AttireTryOnStudio attireCatalog={attireCatalog} />
                ) : (
                  <div className="p-8 text-center text-[#5F6368] bg-[#FFFFFF] rounded-[8px] border border-[#DADCE0]">
                    Loading Traditional Attire Catalog...
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SACRED MONASTERIES & HERITAGE GUIDES */}
            {activeTab === 'monasteries' && (
              <div className="space-y-4">
                {/* Search & Lineage Filters Bar */}
                <div className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)]">
                  {/* Lineage Filter Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 text-[12px]">
                    {['all', 'Nyingma', 'Karma Kagyu'].map((lineage) => (
                      <button
                        key={lineage}
                        onClick={() => setSelectedLineageFilter(lineage as MonasteryLineage | 'all')}
                        className={`px-3 py-1 rounded-full border transition-colors font-medium capitalize shrink-0 ${
                          selectedLineageFilter === lineage
                            ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                            : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA]'
                        }`}
                      >
                        {lineage === 'all' ? 'All Lineages' : `${lineage} Order`}
                      </button>
                    ))}
                  </div>

                  {/* Search Box */}
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-[#5F6368] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={monasterySearch}
                      onChange={(e) => setMonasterySearch(e.target.value)}
                      placeholder="Search monastery or founder..."
                      className="w-full h-9 pl-9 pr-3 rounded-[4px] bg-[#FFFFFF] border border-[#DADCE0] text-[12px] text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#0B3D91]"
                    />
                  </div>
                </div>

                {/* Monasteries Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div>
                {festivals.length > 0 ? (
                  <FestivalCalendar festivals={festivals} />
                ) : (
                  <div className="p-8 text-center text-[#5F6368] bg-[#FFFFFF] rounded-[8px] border border-[#DADCE0]">
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
