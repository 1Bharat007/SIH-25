'use client';

import React from 'react';
import {
  Sparkles,
  Store,
  Compass,
  Phone,
  CheckCircle2,
  Calendar,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { GarmentItem } from '@sikkim-yatra/shared';

interface CulturalContextPanelProps {
  garment: GarmentItem;
  onTryOn?: () => void;
  isCurrentlyWearing?: boolean;
}

export default function CulturalContextPanel({
  garment,
  onTryOn,
  isCurrentlyWearing = false,
}: CulturalContextPanelProps) {
  const craft = garment.craftNotes;
  const vendors = garment.localVendors || [];

  return (
    <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Top Heading & Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                garment.community === 'Bhutia'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : garment.community === 'Lepcha'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {garment.community} Heritage
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-slate-300 capitalize border border-white/10">
              {garment.gender} • {garment.ageGroup}
            </span>
            {craft?.preservationStatus && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {craft.preservationStatus}
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {garment.name}
          </h3>
          {garment.nativeName && (
            <p className="text-xs text-emerald-400 font-serif mt-0.5">
              Traditional Script: {garment.nativeName}
            </p>
          )}
        </div>

        {onTryOn && (
          <button
            onClick={onTryOn}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg self-start sm:self-auto ${
              isCurrentlyWearing
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isCurrentlyWearing ? 'Currently in AR' : 'Try On in AR'}</span>
          </button>
        )}
      </div>

      {/* Cultural Lore & Occasions */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cultural Significance & Occasions</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {garment.culturalDescription}
        </p>

        {/* Festival Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {garment.festivalOccasions.map((occasion) => (
            <span
              key={occasion}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-950/70 text-slate-300 border border-white/10"
            >
              <Calendar className="w-3 h-3 text-emerald-400" />
              <span>{occasion}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Craftsmanship & Materials Card */}
      {craft && (
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
          <h4 className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Indigenous Textile & Weaving Craft</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Primary Materials:
              </span>
              <p className="text-slate-200 text-[11px] mt-0.5">
                {craft.materials.join(', ')}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Weaving Technique:
              </span>
              <p className="text-slate-200 text-[11px] mt-0.5">
                {craft.weavingTechnique}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Heritage Producing Region:
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {craft.producingRegion}
            </p>
          </div>

          {craft.originLore && (
            <p className="text-[11px] text-slate-400 italic bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/10">
              &ldquo;{craft.originLore}&rdquo;
            </p>
          )}
        </div>
      )}

      {/* Verified Local Artisan Vendors Section */}
      {vendors.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Where to Buy or Rent Locally in Sikkim</span>
            </h4>
            <span className="text-[10px] text-emerald-400 font-semibold">
              Support Local Economy
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{vendor.name}</span>
                    {vendor.isGovtCertified && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Govt Certified</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {vendor.address} • <strong className="text-slate-300">{vendor.district} District</strong>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                    <span className="text-emerald-400 font-semibold">
                      Rent: {vendor.rentalPricePerDay}
                    </span>
                    <span className="text-slate-400">
                      Buy: {vendor.purchasePriceRange}
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${vendor.contactPhone.replace(/\s+/g, '')}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-emerald-500/20 shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Artisan / Shop</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sustainable Tourism Impact Disclaimer */}
      <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5 flex items-center gap-2.5 text-[11px] text-slate-400">
        <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Renting or purchasing traditional attire directly supports indigenous Lepcha, Bhutia, and Nepali handloom weaving communities across rural Sikkim.
        </span>
      </div>
    </div>
  );
}
