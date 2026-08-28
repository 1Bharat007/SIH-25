import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Download,
  RotateCw,
  Sliders,
  RefreshCw,
  Info,
  User,
} from 'lucide-react';
import {
  TraditionalAttire,
  SikkimeseCommunity,
  AttireGender,
} from '@sikkim-yatra/shared';


interface AttireTryOnStudioProps {
  attireCatalog: TraditionalAttire[];
  initialAttireId?: string;
}

const SAMPLE_AVATARS = [
  {
    name: 'Sample Himalayan Traveler (Female)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800',
  },
  {
    name: 'Sample Himalayan Traveler (Male)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800',
  },
];

export default function AttireTryOnStudio({
  attireCatalog,
  initialAttireId,
}: AttireTryOnStudioProps) {
  const [selectedAttireId, setSelectedAttireId] = useState<string>(() => {
    return initialAttireId || attireCatalog[0]?.id || '';
  });

  const [selectedCommunity, setSelectedCommunity] = useState<SikkimeseCommunity | 'all'>('all');
  const [selectedGender, setSelectedGender] = useState<AttireGender | 'all'>('all');

  // Input Media Mode: 'camera' | 'upload' | 'avatar'
  const [mediaMode, setMediaMode] = useState<'camera' | 'upload' | 'avatar'>('avatar');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(SAMPLE_AVATARS[0]?.url || '');


  // Overlay Adjustment Controls
  const [overlayScale, setOverlayScale] = useState<number>(1.0);
  const [overlayOffsetY, setOverlayOffsetY] = useState<number>(20);
  const [overlayOffsetX, setOverlayOffsetX] = useState<number>(0);
  const [includeHeadgear, setIncludeHeadgear] = useState<boolean>(true);
  const [includeJewelry, setIncludeJewelry] = useState<boolean>(true);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const activeAttire =
    attireCatalog.find((a) => a.id === selectedAttireId) || attireCatalog[0];

  const filteredCatalog = attireCatalog.filter((item) => {
    if (selectedCommunity !== 'all' && item.community !== selectedCommunity) return false;
    if (selectedGender !== 'all' && item.gender !== selectedGender && item.gender !== 'unisex')
      return false;
    return true;
  });

  // Camera start / stop
  const startCamera = useCallback(async () => {
    try {
      if (videoRef.current && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        setMediaMode('camera');
      }
    } catch (err) {
      console.warn('[Camera] Failed to access webcam:', err);
      alert('Could not access camera. Please allow camera permissions or use Upload/Avatar mode.');
    }
  }, [cameraFacing]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    if (mediaMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mediaMode, startCamera, stopCamera]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImageSrc(event.target?.result as string);
        setMediaMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas Compositing & Live Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isSubscribed = true;

    const renderLoop = () => {
      if (!isSubscribed) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw Background (Camera video / Uploaded Photo / Avatar)
      if (mediaMode === 'camera' && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.save();
        if (cameraFacing === 'user') {
          // Mirror front camera
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        ctx.restore();
      } else if (mediaMode === 'upload' && uploadedImageSrc) {
        const img = new Image();
        img.src = uploadedImageSrc;
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, 0, 0, width, height);
        }
      } else if (mediaMode === 'avatar' && selectedAvatarUrl) {
        const img = new Image();
        img.src = selectedAvatarUrl;
        img.crossOrigin = 'anonymous';
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, 0, 0, width, height);
        }
      } else {
        // Fallback placeholder dark backdrop
        ctx.fillStyle = '#061d19';
        ctx.fillRect(0, 0, width, height);
      }

      // Draw Traditional Attire Drape Graphic (SVG / Vector simulation)
      if (activeAttire) {
        ctx.save();

        const centerX = width / 2 + overlayOffsetX;
        const centerY = height / 2 + overlayOffsetY;

        // Draw Stylized Attire Silhouettes & Authentic Textures
        ctx.translate(centerX, centerY);
        ctx.scale(overlayScale, overlayScale);

        // Community-specific garment rendering
        if (activeAttire.community === 'Bhutia') {
          // Bhutia Bakhu Brocade Robe
          ctx.fillStyle = selectedColorIndex === 1 ? '#7f1d1d' : selectedColorIndex === 2 ? '#1e3a8a' : '#065f46';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 4;

          // Main Robe Body
          ctx.beginPath();
          ctx.moveTo(-160, 40);
          ctx.lineTo(160, 40);
          ctx.lineTo(190, 320);
          ctx.lineTo(-190, 320);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Brocade Golden Trim
          ctx.fillStyle = '#d97706';
          ctx.fillRect(-25, 40, 50, 280);

          // Inner Honju Silk Collar
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.moveTo(-70, -20);
          ctx.lineTo(70, -20);
          ctx.lineTo(40, 50);
          ctx.lineTo(-40, 50);
          ctx.closePath();
          ctx.fill();

          // Married Pangden Apron (if female)
          if (activeAttire.gender === 'female') {
            ctx.fillStyle = '#b45309';
            ctx.fillRect(-100, 160, 200, 150);
            ctx.strokeStyle = '#3b82f6';
            ctx.strokeRect(-100, 160, 200, 150);
          }

          // Khao Amulet Pendant (if enabled)
          if (includeJewelry) {
            ctx.fillStyle = '#0d9488'; // Turquoise
            ctx.strokeStyle = '#eab308'; // Gold
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 75, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }

          // Shambo Hat (if enabled)
          if (includeHeadgear) {
            ctx.fillStyle = '#d97706';
            ctx.beginPath();
            ctx.ellipse(0, -180, 85, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#7f1d1d';
            ctx.lineWidth = 5;
            ctx.stroke();
          }
        } else if (activeAttire.community === 'Lepcha') {
          // Lepcha Dumvum / Thokro-Dum Natural Weave
          ctx.fillStyle = selectedColorIndex === 1 ? '#c2410c' : selectedColorIndex === 2 ? '#0369a1' : '#3f6212';
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 3;

          // Main Weave Robe
          ctx.beginPath();
          ctx.moveTo(-140, 30);
          ctx.lineTo(140, 30);
          ctx.lineTo(170, 320);
          ctx.lineTo(-170, 320);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Handwoven Bamboo Pin
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(-100, 20, 20, 40);

          // Gyaptok Hat
          if (includeHeadgear) {
            ctx.fillStyle = '#d97706';
            ctx.beginPath();
            ctx.moveTo(0, -220);
            ctx.lineTo(90, -150);
            ctx.lineTo(-90, -150);
            ctx.closePath();
            ctx.fill();
          }
        } else {
          // Nepali Daura Suruwal
          ctx.fillStyle = selectedColorIndex === 1 ? '#334155' : selectedColorIndex === 2 ? '#1e293b' : '#475569';
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 3;

          // Daura Cross Tunic
          ctx.beginPath();
          ctx.moveTo(-150, 40);
          ctx.lineTo(150, 40);
          ctx.lineTo(160, 280);
          ctx.lineTo(-160, 280);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // 8 Sacred Ribbon Ties
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-40, 80, 80, 6);
          ctx.fillRect(-40, 120, 80, 6);

          // Dhaka Topi
          if (includeHeadgear) {
            ctx.fillStyle = '#b91c1c';
            ctx.beginPath();
            ctx.moveTo(-60, -150);
            ctx.lineTo(60, -150);
            ctx.lineTo(40, -210);
            ctx.lineTo(-40, -210);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#f59e0b';
            ctx.stroke();
          }
        }

        ctx.restore();
      }

      // Golden Sikkim Yatra Tourist Souvenir Watermark & Frame
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, width - 12, height - 12);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(16, height - 54, 340, 38);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`Sikkim Yatra • ${activeAttire?.name || 'Traditional Attire'}`, 28, height - 30);


      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    activeAttire,
    mediaMode,
    cameraFacing,
    uploadedImageSrc,
    selectedAvatarUrl,
    overlayScale,
    overlayOffsetX,
    overlayOffsetY,
    includeHeadgear,
    includeJewelry,
    selectedColorIndex,
  ]);

  // Download Postcard Snapshot
  const handleDownloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Sikkim_Yatra_${activeAttire?.community || 'Sikkim'}_Attire_Souvenir.png`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Interactive AR Attire Studio
            </span>
            <span className="text-xs text-white/50">Zero-Lag Universal Compatibility</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Traditional Sikkimese Clothing Try-On Experience
          </h2>
          <p className="text-xs text-white/70 mt-1 max-w-2xl">
            Preview authentic Bhutia <em>Bakhu & Honju</em>, Lepcha <em>Dumvum</em>, and Nepali <em>Daura Suruwal</em> using your live webcam or photo portrait.
          </p>
        </div>

        <button
          onClick={handleDownloadSnapshot}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 border border-amber-300/60"
        >
          <Download className="w-4 h-4" />
          <span>Capture Souvenir Postcard</span>
        </button>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Center: Interactive Canvas & Mode Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between bg-slate-900/90 p-2 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex gap-1.5">
              <button
                onClick={() => setMediaMode('avatar')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  mediaMode === 'avatar'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Sample Avatar
              </button>

              <button
                onClick={() => setMediaMode('camera')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  mediaMode === 'camera'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Live Webcam</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  mediaMode === 'upload'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Portrait</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {mediaMode === 'avatar' && (
              <div className="flex items-center gap-1.5">
                {SAMPLE_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAvatarUrl(av.url)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                      selectedAvatarUrl === av.url
                        ? 'bg-amber-500/30 border border-amber-400 text-amber-300'
                        : 'bg-black/30 text-white/60 hover:text-white border border-white/10'
                    }`}
                  >
                    <User className="w-3 h-3" />
                    <span>{idx === 0 ? 'Female Model' : 'Male Model'}</span>
                  </button>
                ))}
              </div>
            )}

            {mediaMode === 'camera' && (
              <button
                onClick={() =>
                  setCameraFacing(cameraFacing === 'user' ? 'environment' : 'user')
                }
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1"
                title="Flip Camera"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Flip</span>
              </button>
            )}
          </div>

          {/* Canvas Viewport */}
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-black border-2 border-amber-500/40 shadow-2xl flex items-center justify-center">
            {/* Hidden video element for webcam feed stream */}
            <video ref={videoRef} playsInline autoPlay muted className="hidden" />

            {/* Composite Rendering Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full h-full object-cover block"
            />

            {/* Floating Alignment Helpers */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-white/15">
                {activeAttire?.community || 'Sikkim'} • {activeAttire?.name || 'Attire'}
              </span>
              {mediaMode === 'camera' && isCameraActive && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  Live Camera
                </span>
              )}
            </div>
          </div>

          {/* Sizing & Fine-Tuning Controls */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Drape Alignment & Accessories
              </h4>
              <button
                onClick={() => {
                  setOverlayScale(1.0);
                  setOverlayOffsetX(0);
                  setOverlayOffsetY(20);
                }}
                className="text-[11px] text-white/50 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Alignment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-white/70 flex justify-between">
                  <span>Size Scale</span>
                  <strong className="text-amber-400">{Math.round(overlayScale * 100)}%</strong>
                </label>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.05"
                  value={overlayScale}
                  onChange={(e) => setOverlayScale(Number(e.target.value))}
                  className="w-full mt-1 accent-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70 flex justify-between">
                  <span>Vertical Position</span>
                  <strong className="text-amber-400">{overlayOffsetY}px</strong>
                </label>
                <input
                  type="range"
                  min="-100"
                  max="120"
                  step="5"
                  value={overlayOffsetY}
                  onChange={(e) => setOverlayOffsetY(Number(e.target.value))}
                  className="w-full mt-1 accent-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70 flex justify-between">
                  <span>Horizontal Position</span>
                  <strong className="text-amber-400">{overlayOffsetX}px</strong>
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="5"
                  value={overlayOffsetX}
                  onChange={(e) => setOverlayOffsetX(Number(e.target.value))}
                  className="w-full mt-1 accent-amber-500"
                />
              </div>
            </div>

            {/* Accessory Toggles */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-white/10 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-white/90">
                <input
                  type="checkbox"
                  checked={includeHeadgear}
                  onChange={(e) => setIncludeHeadgear(e.target.checked)}
                  className="rounded border-white/20 accent-amber-500"
                />
                <span>Include Traditional Hat (Shambo/Dhaka Topi)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-white/90">
                <input
                  type="checkbox"
                  checked={includeJewelry}
                  onChange={(e) => setIncludeJewelry(e.target.checked)}
                  className="rounded border-white/20 accent-amber-500"
                />
                <span>Include Khao Turquoise Amulet / Ornaments</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Attire Catalog & Cultural Lore Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Filters: Community & Gender */}
          <div className="space-y-2">
            <div className="flex gap-2 pb-1 overflow-x-auto">
              {['all', 'Bhutia', 'Lepcha', 'Nepali'].map((comm) => (
                <button
                  key={comm}
                  onClick={() => setSelectedCommunity(comm as SikkimeseCommunity | 'all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize flex-shrink-0 ${
                    selectedCommunity === comm
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 border border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {comm === 'all' ? 'All Communities' : `${comm} Attire`}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pb-1 overflow-x-auto text-[11px]">
              {(['all', 'female', 'male'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all capitalize flex-shrink-0 ${
                    selectedGender === g
                      ? 'bg-white text-slate-950 font-bold'
                      : 'bg-black/30 border border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {g === 'all' ? 'All Genders' : g === 'female' ? "Women's Attire" : "Men's Attire"}
                </button>
              ))}
            </div>
          </div>


          {/* Garment Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {filteredCatalog.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedAttireId(item.id);
                  setSelectedColorIndex(0);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  selectedAttireId === item.id
                    ? 'bg-amber-950/40 border-amber-400 text-white shadow-xl ring-1 ring-amber-400/50'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-white/10 text-white/70 hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-amber-300">
                      {item.community}
                    </span>
                    <span className="text-[11px] text-white/50 capitalize">{item.gender}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1">{item.name}</h4>
                  <p className="text-[11px] text-white/60 line-clamp-1">{item.localName}</p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    selectedAttireId === item.id
                      ? 'bg-amber-500 border-amber-300 text-slate-950'
                      : 'border-white/20 text-transparent'
                  }`}
                >
                  ✓
                </div>
              </div>
            ))}
          </div>

          {/* Deep Cultural Lore Card */}
          {activeAttire && (
            <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Cultural Significance & Lore
                </h3>
              </div>

              <p className="text-xs text-white/80 leading-relaxed">{activeAttire.culturalLore}</p>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/50">Traditional Occasion:</span>
                  <strong className="text-amber-300">{activeAttire.occasion}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/50">Weaving Technique:</span>
                  <strong className="text-white">{activeAttire.textileTechnique}</strong>
                </div>
              </div>

              {/* Garment Pieces Breakdown */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block">
                  Ensemble Components:
                </span>
                <div className="space-y-1">
                  {activeAttire.pieces.map((piece) => (
                    <div
                      key={piece.name}
                      className="p-2 rounded-xl bg-white/5 text-[11px] flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-white">{piece.name}</strong>
                        <span className="text-white/50 text-[10px] ml-1">({piece.localName})</span>
                      </div>
                      <span className="text-amber-400/80 text-[10px]">{piece.material}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
