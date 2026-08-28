'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Download,
  Share2,
  Check,
  Store,
  Copy,
} from 'lucide-react';

import { GarmentItem, HeadgearItem, GarmentLayerItem } from '@sikkim-yatra/shared';

interface BrandedShareModalProps {
  rawSnapshotDataUrl: string;
  garment: GarmentItem;
  headgear?: HeadgearItem | null;
  layer?: GarmentLayerItem | null;
  onClose: () => void;
  onExploreVendors?: () => void;
}

export default function BrandedShareModal({
  rawSnapshotDataUrl,
  garment,
  headgear,
  layer,
  onClose,
  onExploreVendors,
}: BrandedShareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [brandedDataUrl, setBrandedDataUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  // Generate Branded Postcard Canvas (1080 x 1350 px)
  const generateBrandedPostcard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = rawSnapshotDataUrl;

    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });

    const targetWidth = 1080;
    const targetHeight = 1350; // 4:5 Portrait Ratio

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Clean Deep Navy & White Postcard Background
    ctx.fillStyle = '#0B3D91';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Subtle decorative accents
    ctx.fillStyle = '#082E6E';
    ctx.fillRect(0, 0, targetWidth, 140);
    ctx.fillStyle = '#062252';
    ctx.fillRect(0, targetHeight - 200, targetWidth, 200);

    // 2. Top Header & Government Branding
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 36px "Google Sans", "Roboto", sans-serif';
    ctx.fillText('SIKKIM YATRA • CULTURAL HERITAGE', 60, 75);

    ctx.fillStyle = '#D2E3FC';
    ctx.font = '400 22px "Google Sans", "Roboto", sans-serif';
    ctx.fillText('Government of Sikkim • Tourism & Civil Aviation Department', 60, 112);

    // 3. User AR Snapshot Photo Frame
    const frameX = 60;
    const frameY = 165;
    const frameW = 960;
    const frameH = 920;

    // Outer Frame Border
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(frameX - 6, frameY - 6, frameW + 12, frameH + 12);

    // Draw Captured Video Frame
    ctx.drawImage(img, frameX, frameY, frameW, frameH);

    // 4. Bottom Information Panel
    const infoY = 1175;

    // Garment Name & Community Badge
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 38px "Google Sans", "Roboto", sans-serif';
    ctx.fillText(garment.name, 60, infoY);

    ctx.fillStyle = '#8AB4F8';
    ctx.font = '400 24px "Google Sans", "Roboto", sans-serif';
    const subtext = `${garment.community} Traditional Attire${
      garment.nativeName ? ` (${garment.nativeName})` : ''
    }`;
    ctx.fillText(subtext, 60, infoY + 40);

    // Layers Subtitle
    if (layer || headgear) {
      const accessoryText = [layer?.name, headgear?.name].filter(Boolean).join(' + ');
      ctx.fillStyle = '#D2E3FC';
      ctx.font = '400 20px "Google Sans", "Roboto", sans-serif';
      ctx.fillText(`Accessories: ${accessoryText}`, 60, infoY + 74);
    }

    // Official QR / Watermark Text
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 24px "Google Sans", "Roboto", sans-serif';
    ctx.fillText('sikkimyatra.in/culture', targetWidth - 60, infoY + 15);

    ctx.fillStyle = '#8AB4F8';
    ctx.font = '400 18px "Google Sans", "Roboto", sans-serif';
    ctx.fillText('Certified Handloom Weavers', targetWidth - 60, infoY + 45);
    ctx.fillText('Direct Artisan Multiplier', targetWidth - 60, infoY + 72);
    ctx.textAlign = 'left';

    const url = canvas.toDataURL('image/png', 0.95);
    setBrandedDataUrl(url);
  }, [rawSnapshotDataUrl, garment, headgear, layer]);

  useEffect(() => {
    generateBrandedPostcard();
  }, [generateBrandedPostcard]);

  // Handle Download Postcard
  const handleDownload = () => {
    if (!brandedDataUrl) return;
    const a = document.createElement('a');
    a.href = brandedDataUrl;
    a.download = `Sikkim_Yatra_${garment.name.replace(/\s+/g, '_')}_Postcard.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle Native Web Share API
  const handleShare = async () => {
    if (!brandedDataUrl) return;

    try {
      const res = await fetch(brandedDataUrl);
      const blob = await res.blob();
      const file = new File([blob], `Sikkim_AR_${garment.name}.png`, {
        type: 'image/png',
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Tried on ${garment.name} on Sikkim Yatra`,
          text: `Exploring authentic ${garment.community} traditional wear in Sikkim! Support local weavers and artisans directly.`,
          files: [file],
          url: 'https://sikkimyatra.in/culture',
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } else if (navigator.share) {
        await navigator.share({
          title: `Tried on ${garment.name} on Sikkim Yatra`,
          text: `Exploring authentic ${garment.community} traditional wear in Sikkim!`,
          url: 'https://sikkimyatra.in/culture',
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } else {
        await navigator.clipboard.writeText(
          `I tried on the traditional ${garment.name} (${garment.community} community) on Sikkim Yatra! Check it out: https://sikkimyatra.in/culture`
        );
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      }
    } catch {
      // User cancelled share
    }
  };

  // Copy Link to Clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `Check out traditional ${garment.name} on Sikkim Yatra Cultural Heritage Studio: https://sikkimyatra.in/culture/ar-demo`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-5 sm:p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#DADCE0] pb-3">
          <div>
            <h3 className="text-[16px] font-medium text-[#202124]">
              Branded Cultural Heritage Postcard
            </h3>
            <p className="text-[12px] text-[#5F6368]">
              Tourism certified postcard with authentic community attribution
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-[#5F6368] hover:text-[#202124] hover:bg-[#F8F9FA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Postcard Live Preview Container */}
        <div className="rounded-[4px] overflow-hidden border border-[#DADCE0] bg-[#F8F9FA] flex items-center justify-center p-3">
          {brandedDataUrl ? (
            <img
              src={brandedDataUrl}
              alt="Branded Sikkim Postcard"
              className="max-h-[460px] w-auto object-contain rounded-[4px] shadow-sm"
            />
          ) : (
            <div className="py-20 text-center space-y-2">
              <div className="w-6 h-6 rounded-full border-2 border-[#DADCE0] border-t-[#0B3D91] animate-spin mx-auto" />
              <p className="text-[12px] text-[#5F6368]">Rendering branded frame...</p>
            </div>
          )}
        </div>

        {/* Local Artisan Hook Notice */}
        <div className="p-3 rounded-[4px] bg-[#E8F0FE] border border-[#D2E3FC] flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#0B3D91]">
              <Store className="w-3.5 h-3.5" />
              <span>Interested in wearing this outfit in real life?</span>
            </div>
            <p className="text-[12px] text-[#5F6368]">
              Directly rent or purchase from verified local weavers and cooperatives across Sikkim.
            </p>
          </div>
          {onExploreVendors && (
            <button
              onClick={() => {
                onClose();
                onExploreVendors();
              }}
              className="px-3 py-1.5 rounded-[4px] bg-[#0B3D91] text-[#FFFFFF] text-[12px] font-medium hover:bg-[#082E6E] shrink-0"
            >
              View Artisans
            </button>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#DADCE0]">
          <button
            onClick={handleShare}
            className="flex-1 py-2 px-4 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {shareSuccess ? <Check className="w-4 h-4 text-[#FFFFFF]" /> : <Share2 className="w-4 h-4" />}
            <span>{shareSuccess ? 'Shared Successfully' : 'Share Postcard'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="py-2 px-4 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] text-[#0B3D91] text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="py-2 px-4 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] text-[#5F6368] hover:text-[#202124] text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            {isCopied ? <Check className="w-4 h-4 text-[#1E8E3E]" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Link Copied' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
