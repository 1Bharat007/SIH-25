'use client';

import React from 'react';
import {
  Store,
  Compass,
  Phone,
  CheckCircle2,
  Layers,
  ShoppingBag,
  MapPin,
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
    <div className="rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-5 space-y-5 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)]">
      {/* Top Heading & Identity */}
      <div className="border-b border-[#DADCE0] pb-3 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
              garment.community === 'Bhutia'
                ? 'bg-[#E8F0FE] text-[#1A73E8] border-[#D2E3FC]'
                : garment.community === 'Lepcha'
                  ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]'
                  : 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]'
            }`}
          >
            {garment.community} Community Heritage
          </span>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F8F9FA] text-[#5F6368] border border-[#DADCE0] capitalize">
            {garment.gender} • {garment.ageGroup}
          </span>

          {craft?.preservationStatus && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E8F0FE] text-[#0B3D91] border border-[#D2E3FC]">
              {craft.preservationStatus}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-[18px] font-medium text-[#202124] leading-snug">
            {garment.name}
          </h3>
          {garment.nativeName && (
            <p className="text-[12px] text-[#5F6368]">
              Indigenous Script: <span className="text-[#0B3D91] font-medium">{garment.nativeName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Cultural Meaning & Folklore */}
      <div className="space-y-1.5">
        <h4 className="text-[13px] font-medium text-[#202124] flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#0B3D91]" />
          <span>Cultural Lore & Traditional Significance</span>
        </h4>
        <p className="text-[13px] text-[#5F6368] leading-relaxed">
          {garment.culturalDescription}
        </p>
      </div>

      {/* Material & Craftsmanship Specification Table */}
      {craft && (
        <div className="rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] p-3.5 space-y-2 text-[12px]">
          <h4 className="text-[13px] font-medium text-[#202124] flex items-center gap-1.5 border-b border-[#DADCE0] pb-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0B3D91]" />
            <span>Artisan Specifications & Weaving Heritage</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#5F6368]">
            <div>
              <span className="font-medium text-[#202124] block">Festivals & Occasions:</span>
              <span>{garment.festivalOccasions?.join(', ') || 'Festive celebrations'}</span>
            </div>
            <div>
              <span className="font-medium text-[#202124] block">Natural Fibres & Dyes:</span>
              <span>{Array.isArray(craft.materials) ? craft.materials.join(', ') : craft.materials}</span>
            </div>
            <div>
              <span className="font-medium text-[#202124] block">Weaving Craft Technique:</span>
              <span>{craft.weavingTechnique}</span>
            </div>
            <div>
              <span className="font-medium text-[#202124] block">Origin Cluster:</span>
              <span>{craft.producingRegion}</span>
            </div>
          </div>
        </div>
      )}

      {/* Verified Local Artisans & Rental Centers */}
      <div className="space-y-3 pt-1 border-t border-[#DADCE0]">
        <div className="flex items-center justify-between">
          <h4 className="text-[13px] font-medium text-[#202124] flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#0B3D91]" />
            <span>Verified Local Artisans & Weavers ({vendors.length})</span>
          </h4>
          <span className="text-[11px] text-[#137333] font-medium bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#CEEAD6]">
            Sikkim Handloom Certified
          </span>
        </div>

        <p className="text-[12px] text-[#5F6368]">
          Support indigenous weavers directly. Rent authentic outfits for photography or purchase handcrafted keepsakes:
        </p>

        <div className="space-y-2.5">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="p-3 rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] hover:bg-[#FFFFFF] hover:shadow-xs transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-[#202124] text-[13px]">
                      {vendor.name}
                    </span>
                    {vendor.isGovtCertified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1E8E3E]" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#5F6368] mt-0.5">
                    <MapPin className="w-3 h-3 text-[#0B3D91]" />
                    <span>{vendor.address}</span>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-[#0B3D91] bg-[#E8F0FE] px-2 py-0.5 rounded-full border border-[#D2E3FC] shrink-0">
                  {vendor.rentalPricePerDay} / day rental
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#DADCE0] text-[11px]">
                <div className="flex items-center gap-1 text-[#5F6368]">
                  <ShoppingBag className="w-3 h-3 text-[#5F6368]" />
                  <span>Buy: <strong className="text-[#202124]">{vendor.purchasePriceRange}</strong></span>
                </div>

                {vendor.contactPhone && (
                  <a
                    href={`tel:${vendor.contactPhone}`}
                    className="inline-flex items-center gap-1 text-[#0B3D91] font-medium hover:underline px-2 py-1 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA]"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{vendor.contactPhone}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Action Footer */}
      {!isCurrentlyWearing && onTryOn && (
        <button
          onClick={onTryOn}
          className="w-full py-2.5 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[13px] font-medium transition-colors"
        >
          Try On in Virtual Studio
        </button>
      )}
    </div>
  );
}
