'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Download,
  Share2,
  Check,
  Sparkles,
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

  // Generate Branded Postcard Canvas
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
    const targetHeight = 1350; // 4:5 Instagram Portrait Ratio

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Dark Gradient Background with Himalayan Motif
    const bgGradient = ctx.createLinearGradient(0, 0, 0, targetHeight);
    bgGradient.addColorStop(0, '#020617');
    bgGradient.addColorStop(0.5, '#0f172a');
    bgGradient.addColorStop(1, '#022c22');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // 2. Draw Main AR Snapshot into center frame
    const framePadding = 50;
    const frameTop = 130;
    const frameWidth = targetWidth - framePadding * 2;
    const frameHeight = targetHeight - frameTop - 250;

    // Draw inner snapshot with aspect-fill
    ctx.save();
    // Rounded clip
    ctx.beginPath();
    ctx.roundRect(framePadding, frameTop, frameWidth, frameHeight, 32);
    ctx.clip();

    // Scale image to fill frame
    const imgRatio = img.width / img.height;
    const frameRatio = frameWidth / frameHeight;
    let renderW = frameWidth;
    let renderH = frameHeight;
    let renderX = framePadding;
    let renderY = frameTop;

    if (imgRatio > frameRatio) {
      renderW = frameHeight * imgRatio;
      renderX = framePadding - (renderW - frameWidth) / 2;
    } else {
      renderH = frameWidth / imgRatio;
      renderY = frameTop - (renderH - frameHeight) / 2;
    }

    ctx.drawImage(img, renderX, renderY, renderW, renderH);
    ctx.restore();

    // 3. Draw Golden Border around the photo frame
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(framePadding, frameTop, frameWidth, frameHeight, 32);
    ctx.stroke();

    // 4. Header Bar
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.textAlign = 'center';
    ctx.fillText('SIKKIM YATRA • CULTURAL AR STUDIO', targetWidth / 2, 70);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('Living Himalayan Heritage & Authentic Traditional Attire', targetWidth / 2, 100);

    // 5. Bottom Informational Card Bar
    const cardY = targetHeight - 210;

    // Dark pill container
    ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(framePadding, cardY, frameWidth, 160, 24);
    ctx.fill();
    ctx.stroke();

    // Outfit Details Text
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
    ctx.fillText(garment.name, framePadding + 32, cardY + 50);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    let subtext = `${garment.community} Community`;
    if (garment.nativeName) subtext += ` • ${garment.nativeName}`;
    if (headgear) subtext += ` + ${headgear.name}`;
    if (layer) subtext += ` + ${layer.name}`;
    ctx.fillText(subtext, framePadding + 32, cardY + 84);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px system-ui, -apple-system, sans-serif';
    ctx.fillText(
      `Tried on via Sikkim Yatra AR • Support Local Artisans in ${garment.craftNotes?.producingRegion || 'Sikkim'}`,
      framePadding + 32,
      cardY + 120
    );

    // Verified Stamp Badge on bottom right
    ctx.textAlign = 'right';
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('SIKKIM TOURISM', targetWidth - framePadding - 32, cardY + 60);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillText('Verified Heritage', targetWidth - framePadding - 32, cardY + 85);

    const generated = canvas.toDataURL('image/png', 0.95);
    setBrandedDataUrl(generated);
  }, [rawSnapshotDataUrl, garment, headgear, layer]);

  useEffect(() => {
    generateBrandedPostcard();
  }, [generateBrandedPostcard]);

  // Handle Download Postcard
  const handleDownload = () => {
    if (!brandedDataUrl) return;
    const a = document.createElement('a');
    a.href = brandedDataUrl;
    a.download = `Sikkim_Yatra_Heritage_${garment.categorySlug}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle Native Web Share API
  const handleNativeShare = async () => {
    if (!brandedDataUrl) return;

    try {
      // Convert dataUrl to Blob
      const res = await fetch(brandedDataUrl);
      const blob = await res.blob();
      const file = new File([blob], `Sikkim_AR_${garment.id}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `My Traditional ${garment.name} - Sikkim Yatra`,
          text: `Just tried on authentic ${garment.community} traditional wear (${garment.name}) using Sikkim Yatra's AR Heritage Studio! Explore Sikkim's living culture:`,
          url: window.location.href,
          files: [file],
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } else if (navigator.share) {
        await navigator.share({
          title: `My Traditional ${garment.name} - Sikkim Yatra`,
          text: `Just tried on authentic ${garment.community} traditional wear (${garment.name}) using Sikkim Yatra's AR Heritage Studio!`,
          url: window.location.href,
        });
      } else {
        // Fallback: Copy link
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      }
    } catch {
      // Ignore user abort or fallback
    }
  };

  // Handle Copy Postcard Image to Clipboard
  const handleCopyImage = async () => {
    if (!brandedDataUrl) return;

    try {
      const res = await fetch(brandedDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      // Fallback copy link
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Hidden Offscreen Generator Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-2xl rounded-3xl border border-emerald-500/30 bg-slate-900/95 p-5 sm:p-7 shadow-2xl space-y-6">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Share Your Sikkimese Heritage Postcard
              </h3>
              <p className="text-xs text-slate-400">
                Stitched with authentic {garment.community} motifs & tourism watermark
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Postcard Image Preview */}
        <div className="relative w-full aspect-[4/5] max-h-[460px] rounded-2xl overflow-hidden border border-emerald-500/30 bg-black shadow-inner flex items-center justify-center">
          {brandedDataUrl ? (
            <img
              src={brandedDataUrl}
              alt="Branded Sikkim Postcard"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
              <span>Generating High-Res Postcard Frame...</span>
            </div>
          )}
        </div>

        {/* Share & Download Actions */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Native Share Button */}
            <button
              onClick={handleNativeShare}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{shareSuccess ? 'Shared!' : 'Share to Instagram / WhatsApp'}</span>
            </button>

            {/* Download Postcard Button */}
            <button
              onClick={handleDownload}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Postcard (PNG)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Copy Button */}
            <button
              onClick={handleCopyImage}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-950/60 border border-white/10 transition-all"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Image to Clipboard'}</span>
            </button>

            {/* Link to Local Artisans */}
            {onExploreVendors && (
              <button
                onClick={() => {
                  onClose();
                  onExploreVendors();
                }}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-all"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Buy / Rent this outfit from local weavers →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
