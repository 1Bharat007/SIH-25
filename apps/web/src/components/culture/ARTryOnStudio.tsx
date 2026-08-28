'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  Sparkles,
  Download,
  RotateCw,
  RefreshCw,
  Info,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Maximize2,
  Minimize2,
  Layers,
  HelpCircle,
  X,
  Compass,
  Lightbulb,
} from 'lucide-react';
import {
  TEST_GARMENT_ITEM,
  GarmentDefinition,
  SIKKIM_HEADGEAR_CATALOG,
  SIKKIM_LAYERS_CATALOG,
  getCachedImage,
  preloadAllWardrobeAssets,
} from '../../utils/garment-assets';
import { HeadgearItem, GarmentLayerItem } from '@sikkim-yatra/shared';

interface ARTryOnStudioProps {
  customGarment?: GarmentDefinition;
  onSnapshotCaptured?: (dataUrl: string) => void;
}

type DetectionStatus =
  | 'uninitialized'
  | 'loading_engine'
  | 'requesting_camera'
  | 'active_tracking'
  | 'no_person_detected'
  | 'low_confidence'
  | 'camera_denied'
  | 'error';

interface SmoothedPoseState {
  neckX: number;
  neckY: number;
  angle: number;
  width: number;
  height: number;
  confidence: number;
  initialized: boolean;
}

interface SmoothedHeadState {
  headX: number;
  headY: number;
  angle: number;
  width: number;
  height: number;
  confidence: number;
  initialized: boolean;
}

export default function ARTryOnStudio({
  customGarment,
  onSnapshotCaptured,
}: ARTryOnStudioProps) {
  const garment = customGarment || TEST_GARMENT_ITEM;

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // MediaPipe Landmarker Ref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const poseLandmarkerRef = useRef<any>(null);

  // Component State
  const [status, setStatus] = useState<DetectionStatus>('uninitialized');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(0);
  const [showDebugSkeleton, setShowDebugSkeleton] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [snapshotDataUrl, setSnapshotDataUrl] = useState<string | null>(null);

  // Multi-Layer & Headgear Stack State
  const [selectedHeadgear, setSelectedHeadgear] = useState<HeadgearItem | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<GarmentLayerItem | null>(null);
  const [showLayersDrawer, setShowLayersDrawer] = useState<boolean>(false);
  const [showPoseGuide, setShowPoseGuide] = useState<boolean>(false);

  // Fine-tuning adjustments (Manual scale / offset overrides)
  const [manualScale, setManualScale] = useState<number>(1.0);
  const [manualOffsetY, setManualOffsetY] = useState<number>(0);
  const [manualOffsetX, setManualOffsetX] = useState<number>(0);
  const [showAdjustmentSliders, setShowAdjustmentSliders] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pose Smoothing State (EMA)
  const smoothedPoseRef = useRef<SmoothedPoseState>({
    neckX: 0,
    neckY: 0,
    angle: 0,
    width: 0,
    height: 0,
    confidence: 0,
    initialized: false,
  });

  // Headgear Smoothing State (EMA)
  const smoothedHeadRef = useRef<SmoothedHeadState>({
    headX: 0,
    headY: 0,
    angle: 0,
    width: 0,
    height: 0,
    confidence: 0,
    initialized: false,
  });

  // Preload all wardrobe assets on mount for zero-flicker instant switching
  useEffect(() => {
    preloadAllWardrobeAssets();
  }, []);

  // Set default matching layers/headgear when garment changes
  useEffect(() => {
    if (garment.community === 'Nepali') {
      const defaultHat = SIKKIM_HEADGEAR_CATALOG.find((h) => h.id === 'headgear-nepali-dhaka-topi') || null;
      setSelectedHeadgear(defaultHat);
      if (garment.gender === 'male') {
        const askot = SIKKIM_LAYERS_CATALOG.find((l) => l.id === 'layer-nepali-askot') || null;
        setSelectedLayer(askot);
      } else {
        setSelectedLayer(null);
      }
    } else if (garment.community === 'Bhutia') {
      const defaultHat = SIKKIM_HEADGEAR_CATALOG.find((h) => h.id === 'headgear-bhutia-gyalshom') || null;
      setSelectedHeadgear(defaultHat);
      if (garment.gender === 'female' && garment.categorySlug.includes('pangden')) {
        const pangden = SIKKIM_LAYERS_CATALOG.find((l) => l.id === 'layer-bhutia-pangden') || null;
        setSelectedLayer(pangden);
      } else {
        setSelectedLayer(null);
      }
    } else if (garment.community === 'Lepcha') {
      const defaultHat = SIKKIM_HEADGEAR_CATALOG.find((h) => h.id === 'headgear-lepcha-sumbok') || null;
      setSelectedHeadgear(defaultHat);
      const sash = SIKKIM_LAYERS_CATALOG.find((l) => l.id === 'layer-lepcha-sash') || null;
      setSelectedLayer(sash);
    }
  }, [garment]);

  // 1. Initialize MediaPipe Vision Task
  const initializeMediaPipe = useCallback(async () => {
    try {
      setStatus('loading_engine');
      setErrorMessage(null);

      const { FilesetResolver, PoseLandmarker } = await import('@mediapipe/tasks-vision');

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.4,
        minPosePresenceConfidence: 0.4,
        minTrackingConfidence: 0.4,
      });

      poseLandmarkerRef.current = landmarker;
      return landmarker;
    } catch (err: unknown) {
      console.warn('[MediaPipe] GPU init failed, retrying with CPU delegate:', err);
      try {
        const { FilesetResolver, PoseLandmarker } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        const fallbackLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
          minPoseDetectionConfidence: 0.35,
          minPosePresenceConfidence: 0.35,
        });
        poseLandmarkerRef.current = fallbackLandmarker;
        return fallbackLandmarker;
      } catch (cpuErr: unknown) {
        const errorMsg = cpuErr instanceof Error ? cpuErr.message : 'Failed to initialize vision engine';
        console.error('[MediaPipe] Fatal initialization error:', cpuErr);
        setStatus('error');
        setErrorMessage(`Vision Engine Init Error: ${errorMsg}`);
        return null;
      }
    }
  }, []);

  // 2. Start Camera Feed with Auto-Mirroring for Mobile
  const startCamera = useCallback(async () => {
    try {
      setStatus('requesting_camera');
      setErrorMessage(null);

      // Auto mirror: selfie = mirrored, back camera = normal
      setIsMirrored(cameraFacing === 'user');

      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('active_tracking');
      }
    } catch (err: unknown) {
      console.error('[Camera] Access error:', err);
      setStatus('camera_denied');
      setErrorMessage(
        'Camera permission was denied or unavailable. Please grant webcam access in browser settings.'
      );
    }
  }, [cameraFacing]);

  // 3. Real-Time Detection & Rendering Loop
  useEffect(() => {
    let isRunning = true;
    let lastVideoTime = -1;
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const renderLoop = () => {
      if (!isRunning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const landmarker = poseLandmarkerRef.current;

      if (
        video &&
        canvas &&
        landmarker &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          // FPS calculation
          frameCount++;
          const now = performance.now();
          if (now - lastFpsUpdate >= 1000) {
            setFps(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
            frameCount = 0;
            lastFpsUpdate = now;
          }

          // Draw the base video frame
          ctx.save();
          if (isMirrored) {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(video, 0, 0, width, height);
          ctx.restore();

          // Run MediaPipe inference
          if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            try {
              const results = landmarker.detectForVideo(video, now);

              if (results && results.landmarks && results.landmarks.length > 0) {
                const landmarks = results.landmarks[0];

                // Extract Key Body Landmarks:
                // 0: Nose, 2: Left Eye, 5: Right Eye, 7: Left Ear, 8: Right Ear
                // 11: Left Shoulder, 12: Right Shoulder, 23: Left Hip, 24: Right Hip
                const noseRaw = landmarks[0];
                const leftEyeRaw = landmarks[2];
                const rightEyeRaw = landmarks[5];
                const leftEarRaw = landmarks[7];
                const rightEarRaw = landmarks[8];
                const leftShoulderRaw = landmarks[11];
                const rightShoulderRaw = landmarks[12];
                const leftHipRaw = landmarks[23];
                const rightHipRaw = landmarks[24];

                const shoulderConfidence = Math.min(
                  leftShoulderRaw?.visibility ?? 0.8,
                  rightShoulderRaw?.visibility ?? 0.8
                );

                if (shoulderConfidence > 0.35 && leftShoulderRaw && rightShoulderRaw) {
                  // Coordinate space mapping (handle mirror if active)
                  const mapX = (normX: number) => (isMirrored ? (1 - normX) * width : normX * width);
                  const mapY = (normY: number) => normY * height;

                  const ls = { x: mapX(leftShoulderRaw.x), y: mapY(leftShoulderRaw.y) };
                  const rs = { x: mapX(rightShoulderRaw.x), y: mapY(rightShoulderRaw.y) };
                  const lh = leftHipRaw ? { x: mapX(leftHipRaw.x), y: mapY(leftHipRaw.y) } : null;
                  const rh = rightHipRaw ? { x: mapX(rightHipRaw.x), y: mapY(rightHipRaw.y) } : null;

                  // Target Shoulder Midpoint
                  const targetNeckX = (ls.x + rs.x) / 2;
                  const targetNeckY = (ls.y + rs.y) / 2;

                  // Compute Orientation Angle (tilt of shoulders)
                  const dx = isMirrored ? ls.x - rs.x : rs.x - ls.x;
                  const dy = isMirrored ? ls.y - rs.y : rs.y - ls.y;
                  const targetAngle = Math.atan2(dy, dx);

                  // Compute Shoulder Width
                  const shoulderDist = Math.hypot(rs.x - ls.x, rs.y - ls.y);

                  // Compute Torso Length
                  let torsoHeight = shoulderDist * 1.5;
                  if (lh && rh) {
                    const hipMidY = (lh.y + rh.y) / 2;
                    torsoHeight = Math.max(hipMidY - targetNeckY, shoulderDist * 1.3);
                  }

                  // Target garment scale
                  const targetGarmentWidth =
                    shoulderDist * garment.anchorPoints.widthScaleRatio * manualScale;
                  const targetGarmentHeight =
                    torsoHeight * garment.anchorPoints.heightScaleRatio * manualScale;

                  // Apply Temporal Smoothing (EMA)
                  const alpha = 0.65;
                  const prev = smoothedPoseRef.current;

                  if (!prev.initialized) {
                    prev.neckX = targetNeckX;
                    prev.neckY = targetNeckY;
                    prev.angle = targetAngle;
                    prev.width = targetGarmentWidth;
                    prev.height = targetGarmentHeight;
                    prev.confidence = shoulderConfidence;
                    prev.initialized = true;
                  } else {
                    prev.neckX = prev.neckX * (1 - alpha) + targetNeckX * alpha;
                    prev.neckY = prev.neckY * (1 - alpha) + targetNeckY * alpha;

                    let angleDiff = targetAngle - prev.angle;
                    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                    prev.angle = prev.angle + angleDiff * alpha;

                    prev.width = prev.width * (1 - alpha) + targetGarmentWidth * alpha;
                    prev.height = prev.height * (1 - alpha) + targetGarmentHeight * alpha;
                    prev.confidence = prev.confidence * 0.8 + shoulderConfidence * 0.2;
                  }

                  setConfidence(Math.round(prev.confidence * 100));

                  // -----------------------------------------------------------
                  // LAYER 1: BASE TRADITIONAL GARMENT
                  // -----------------------------------------------------------
                  const baseGarmentImg = getCachedImage(garment.imageUrl);
                  if (baseGarmentImg && baseGarmentImg.complete) {
                    ctx.save();
                    ctx.translate(
                      prev.neckX + manualOffsetX,
                      prev.neckY + manualOffsetY
                    );
                    ctx.rotate(prev.angle);

                    const anchorOffsetX = -prev.width * garment.anchorPoints.neckCenterX;
                    const anchorOffsetY = -prev.height * garment.anchorPoints.neckCenterY;

                    ctx.drawImage(
                      baseGarmentImg,
                      anchorOffsetX,
                      anchorOffsetY,
                      prev.width,
                      prev.height
                    );
                    ctx.restore();
                  }

                  // -----------------------------------------------------------
                  // LAYER 2: SECONDARY WAISTCOAT / APRON / SASH OVERLAY
                  // -----------------------------------------------------------
                  if (selectedLayer) {
                    const layerImg = getCachedImage(selectedLayer.imageUrl);
                    if (layerImg && layerImg.complete) {
                      ctx.save();
                      ctx.translate(
                        prev.neckX + manualOffsetX,
                        prev.neckY + manualOffsetY
                      );
                      ctx.rotate(prev.angle);

                      const layerWidth = shoulderDist * selectedLayer.anchorPoints.widthScaleRatio * manualScale;
                      const layerHeight = torsoHeight * selectedLayer.anchorPoints.heightScaleRatio * manualScale;
                      const anchorOffsetX = -layerWidth * selectedLayer.anchorPoints.neckCenterX;
                      const anchorOffsetY = -layerHeight * selectedLayer.anchorPoints.neckCenterY;

                      ctx.drawImage(
                        layerImg,
                        anchorOffsetX,
                        anchorOffsetY,
                        layerWidth,
                        layerHeight
                      );
                      ctx.restore();
                    }
                  }

                  // -----------------------------------------------------------
                  // LAYER 3: TRADITIONAL HEADGEAR / CAP
                  // -----------------------------------------------------------
                  if (selectedHeadgear && (noseRaw || leftEarRaw || rightEarRaw || leftEyeRaw)) {
                    const nose = noseRaw ? { x: mapX(noseRaw.x), y: mapY(noseRaw.y) } : null;
                    const le = leftEarRaw ? { x: mapX(leftEarRaw.x), y: mapY(leftEarRaw.y) } : null;
                    const re = rightEarRaw ? { x: mapX(rightEarRaw.x), y: mapY(rightEarRaw.y) } : null;
                    const ley = leftEyeRaw ? { x: mapX(leftEyeRaw.x), y: mapY(leftEyeRaw.y) } : null;
                    const rey = rightEyeRaw ? { x: mapX(rightEyeRaw.x), y: mapY(rightEyeRaw.y) } : null;

                    const headCenterX = nose ? nose.x : (ls.x + rs.x) / 2;
                    const eyeY = ley && rey ? (ley.y + rey.y) / 2 : (nose ? nose.y - shoulderDist * 0.4 : ls.y - shoulderDist * 0.6);
                    
                    // Head width based on ear span or shoulder ratio
                    let headSpan = shoulderDist * 0.65;
                    if (le && re) {
                      headSpan = Math.hypot(re.x - le.x, re.y - le.y) * 1.35;
                    }

                    // Position headgear on forehead/crown
                    const targetHeadY = eyeY - (headSpan * selectedHeadgear.anchorPoints.verticalHeadOffsetRatio);
                    
                    // Head angle tilt
                    let targetHeadAngle = prev.angle;
                    if (le && re) {
                      const hdx = isMirrored ? le.x - re.x : re.x - le.x;
                      const hdy = isMirrored ? le.y - re.y : re.y - le.y;
                      targetHeadAngle = Math.atan2(hdy, hdx);
                    }

                    const targetHeadWidth = headSpan * selectedHeadgear.anchorPoints.widthScaleRatio * manualScale;
                    const targetHeadHeight = (headSpan * 0.6) * selectedHeadgear.anchorPoints.heightScaleRatio * manualScale;

                    // Smooth headgear coordinates
                    const headAlpha = 0.7;
                    const prevHead = smoothedHeadRef.current;
                    if (!prevHead.initialized) {
                      prevHead.headX = headCenterX;
                      prevHead.headY = targetHeadY;
                      prevHead.angle = targetHeadAngle;
                      prevHead.width = targetHeadWidth;
                      prevHead.height = targetHeadHeight;
                      prevHead.initialized = true;
                    } else {
                      prevHead.headX = prevHead.headX * (1 - headAlpha) + headCenterX * headAlpha;
                      prevHead.headY = prevHead.headY * (1 - headAlpha) + targetHeadY * headAlpha;
                      
                      let hAngleDiff = targetHeadAngle - prevHead.angle;
                      while (hAngleDiff < -Math.PI) hAngleDiff += Math.PI * 2;
                      while (hAngleDiff > Math.PI) hAngleDiff -= Math.PI * 2;
                      prevHead.angle = prevHead.angle + hAngleDiff * headAlpha;

                      prevHead.width = prevHead.width * (1 - headAlpha) + targetHeadWidth * headAlpha;
                      prevHead.height = prevHead.height * (1 - headAlpha) + targetHeadHeight * headAlpha;
                    }

                    const headgearImg = getCachedImage(selectedHeadgear.imageUrl);
                    if (headgearImg && headgearImg.complete) {
                      ctx.save();
                      ctx.translate(
                        prevHead.headX + manualOffsetX,
                        prevHead.headY + manualOffsetY
                      );
                      ctx.rotate(prevHead.angle);

                      const hatOffsetX = -prevHead.width * selectedHeadgear.anchorPoints.crownCenterX;
                      const hatOffsetY = -prevHead.height * selectedHeadgear.anchorPoints.crownCenterY;

                      ctx.drawImage(
                        headgearImg,
                        hatOffsetX,
                        hatOffsetY,
                        prevHead.width,
                        prevHead.height
                      );
                      ctx.restore();
                    }
                  }

                  // Optional Debug Skeleton Overlay
                  if (showDebugSkeleton) {
                    ctx.save();
                    ctx.strokeStyle = '#38bdf8';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(ls.x, ls.y);
                    ctx.lineTo(rs.x, rs.y);
                    ctx.stroke();

                    ctx.fillStyle = '#f59e0b';
                    ctx.beginPath();
                    ctx.arc(ls.x, ls.y, 6, 0, Math.PI * 2);
                    ctx.arc(rs.x, rs.y, 6, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#10b981';
                    ctx.beginPath();
                    ctx.arc(prev.neckX, prev.neckY, 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                  }
                } else {
                  setStatus('no_person_detected');
                }
              } else {
                setStatus('no_person_detected');
              }
            } catch {
              // Frame dropped, continue next tick
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [garment, selectedLayer, selectedHeadgear, isMirrored, manualScale, manualOffsetY, manualOffsetX, showDebugSkeleton]);

  // Lifecycle initialization
  useEffect(() => {
    let mounted = true;

    async function setup() {
      const landmarker = await initializeMediaPipe();
      if (mounted && landmarker) {
        await startCamera();
      }
    }

    setup();

    return () => {
      mounted = false;
      if (videoRef.current && videoRef.current.srcObject) {
        try {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        } catch {
          // ignore
        }
      }
    };
  }, [initializeMediaPipe, startCamera]);

  // Handle Snapshot Capture
  const handleCaptureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      setSnapshotDataUrl(dataUrl);

      if (onSnapshotCaptured) {
        onSnapshotCaptured(dataUrl);
      }
    } catch (err) {
      console.error('[Snapshot] Capture failed:', err);
    }
  };

  // Download Snapshot
  const handleDownloadSnapshot = () => {
    if (!snapshotDataUrl) return;
    const a = document.createElement('a');
    a.href = snapshotDataUrl;
    a.download = `Sikkim_AR_TryOn_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Toggle Fullscreen Mode
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center w-full max-w-5xl mx-auto rounded-3xl border border-emerald-500/20 bg-slate-950/80 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl overflow-hidden"
    >
      {/* Top Header Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Virtual AR Attire Studio</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MediaPipe Multi-Layer
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live body tracking, proportional scaling & accessory layering (30+ FPS)
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pose Guide Hint */}
          <button
            onClick={() => setShowPoseGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
            title="How to pose for best tracking"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Pose Guide</span>
          </button>

          {/* Layer Stacking Drawer Toggle */}
          <button
            onClick={() => setShowLayersDrawer(!showLayersDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showLayersDrawer || selectedHeadgear || selectedLayer
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-white'
            }`}
            title="Toggle accessories & outer layers"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Layers</span>
            {(selectedHeadgear || selectedLayer) && (
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            )}
          </button>

          {/* Debug Skeleton Toggle */}
          <button
            onClick={() => setShowDebugSkeleton(!showDebugSkeleton)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showDebugSkeleton
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-white'
            }`}
            title="Toggle landmark skeleton overlay"
          >
            {showDebugSkeleton ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Skeleton</span>
          </button>

          {/* Mirror Toggle */}
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isMirrored
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-white'
            }`}
            title="Mirror video feed"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mirror</span>
          </button>

          {/* Mobile Camera Switcher (Front/Back) */}
          <button
            onClick={() => {
              setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/60 text-slate-300 border border-slate-700/60 hover:bg-slate-800 hover:text-white transition-all"
            title="Flip camera (Front / Back)"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{cameraFacing === 'user' ? 'Front' : 'Back'}</span>
          </button>

          {/* Adjustments Slider Toggle */}
          <button
            onClick={() => setShowAdjustmentSliders(!showAdjustmentSliders)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showAdjustmentSliders
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-white'
            }`}
            title="Manual garment fine-tuning"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fit</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 border border-slate-700/60 transition-all"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Accessories & Stacking Layers Drawer */}
      {showLayersDrawer && (
        <div className="w-full mb-4 p-4 rounded-2xl bg-slate-900/90 border border-teal-500/30 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
              <Layers className="w-4 h-4" />
              <span>Multi-Piece Layer Stacking (Headgear & Outer Layers)</span>
            </div>
            <button
              onClick={() => setShowLayersDrawer(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Traditional Headgear Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Traditional Headgear (Layer 3)
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedHeadgear(null)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedHeadgear === null
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                      : 'bg-slate-950/60 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  None
                </button>
                {SIKKIM_HEADGEAR_CATALOG.map((hat) => (
                  <button
                    key={hat.id}
                    onClick={() => setSelectedHeadgear(hat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedHeadgear?.id === hat.id
                        ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-md'
                        : 'bg-slate-950/60 text-slate-300 border-white/10 hover:text-white'
                    }`}
                  >
                    {hat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Outer Layer Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Outer Layer / Sash (Layer 2)
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLayer(null)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedLayer === null
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                      : 'bg-slate-950/60 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  None
                </button>
                {SIKKIM_LAYERS_CATALOG.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedLayer?.id === layer.id
                        ? 'bg-purple-500 text-white border-purple-400 font-bold shadow-md'
                        : 'bg-slate-950/60 text-slate-300 border-white/10 hover:text-white'
                    }`}
                  >
                    {layer.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[640px] rounded-2xl bg-black border border-emerald-500/30 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Hidden Video Source Element */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="hidden"
        />

        {/* Live Canvas Output Element */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />

        {/* Top-Left Telemetry HUD */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] shadow-lg">
            <span className={`w-2 h-2 rounded-full ${fps >= 20 ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
            <span className="font-mono font-bold text-white">{fps} FPS</span>
            <span className="text-white/40">|</span>
            <span className="text-white/70">Confidence:</span>
            <span className={`font-mono font-bold ${confidence > 55 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {confidence}%
            </span>
          </div>

          {/* Status Badge */}
          {status === 'active_tracking' && (
            <div className="flex items-center gap-1.5 bg-emerald-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold w-fit">
              <ShieldCheck className="w-3 h-3" />
              <span>Pose Locked</span>
            </div>
          )}
          {status === 'no_person_detected' && (
            <div className="flex items-center gap-1.5 bg-amber-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-500/30 text-[10px] text-amber-300 font-semibold w-fit">
              <AlertTriangle className="w-3 h-3" />
              <span>Step back into view</span>
            </div>
          )}
        </div>

        {/* Active Layers Stack Badge */}
        <div className="absolute top-3 right-3 z-20 pointer-events-none max-w-[240px]">
          <div className="bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl border border-emerald-500/30 text-xs shadow-lg space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
              Active Outfit Stack
            </span>
            <div className="text-white text-xs font-semibold truncate">
              {garment.name}
            </div>
            {selectedLayer && (
              <div className="text-[11px] text-purple-300 truncate">
                + {selectedLayer.name}
              </div>
            )}
            {selectedHeadgear && (
              <div className="text-[11px] text-teal-300 truncate">
                + {selectedHeadgear.name}
              </div>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {(status === 'loading_engine' || status === 'requesting_camera') && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-teal-500/20 border-b-teal-400 animate-spin" style={{ animationDirection: 'reverse' }} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">
                {status === 'loading_engine'
                  ? 'Initializing MediaPipe Pose & Vision Engine...'
                  : 'Connecting to Camera Stream...'}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Calibrating 33-point real-time pose detector for multi-layer wardrobe try-on
              </p>
            </div>
          </div>
        )}

        {/* Camera Permission Denied Overlay */}
        {status === 'camera_denied' && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
            <div className="p-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <CameraOff className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-base font-bold text-white">Camera Access Required</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {errorMessage ||
                  'Webcam permission is needed to track your body posture and fit traditional attire in real time.'}
              </p>
            </div>
            <button
              onClick={startCamera}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Camera Permission</span>
            </button>
          </div>
        )}
      </div>

      {/* Manual Fine-Tuning Slider Drawer */}
      {showAdjustmentSliders && (
        <div className="w-full mt-4 p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Garment Fitting Fine-Tuning</span>
            </h4>
            <button
              onClick={() => {
                setManualScale(1.0);
                setManualOffsetY(0);
                setManualOffsetX(0);
              }}
              className="text-[10px] text-purple-300/80 hover:text-white underline"
            >
              Reset Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Scale Multiplier:</span>
                <span className="font-mono text-purple-300">{manualScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.02"
                value={manualScale}
                onChange={(e) => setManualScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Vertical Offset (Y):</span>
                <span className="font-mono text-purple-300">{manualOffsetY} px</span>
              </div>
              <input
                type="range"
                min="-80"
                max="80"
                step="2"
                value={manualOffsetY}
                onChange={(e) => setManualOffsetY(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Horizontal Offset (X):</span>
                <span className="font-mono text-purple-300">{manualOffsetX} px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                step="2"
                value={manualOffsetX}
                onChange={(e) => setManualOffsetX(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Controls */}
      <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Stand 1.5 – 2.5 meters away so shoulders and waist are visible. Garments scale dynamically as you move.
          </span>
        </div>

        {/* Snapshot Capture Button */}
        <button
          onClick={handleCaptureSnapshot}
          disabled={status !== 'active_tracking'}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Camera className="w-4 h-4 text-slate-950" />
          <span>Take AR Snapshot</span>
        </button>
      </div>

      {/* "How to Pose" Onboarding Modal */}
      {showPoseGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">How to Pose for Best AR Tracking</h3>
              </div>
              <button
                onClick={() => setShowPoseGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-white/10">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">1. Step Back for Full Upper Body</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Position your phone or webcam so your head, shoulders, and waist are clearly inside the camera frame (approx. 1.5 to 2.5 meters away).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-white/10">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">2. Frontal Natural Lighting</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Ensure adequate room light or face a window. Avoid dark rooms or bright backlight behind you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-white/10">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">3. Relaxed Natural A-Pose</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Keep your shoulders level and your arms slightly relaxed away from your sides for the cleanest robe and sash alignment.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPoseGuide(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              Got It, Let&apos;s Try On!
            </button>
          </div>
        </div>
      )}

      {/* Snapshot Preview Modal */}
      {snapshotDataUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl border border-emerald-500/30 bg-slate-900 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">AR Photo Captured</h3>
              </div>
              <button
                onClick={() => setSnapshotDataUrl(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Close
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-[4/3] flex items-center justify-center">
              <img
                src={snapshotDataUrl}
                alt="AR Try-On Snapshot"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleDownloadSnapshot}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res Photo (PNG)</span>
              </button>
              <button
                onClick={() => setSnapshotDataUrl(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all"
              >
                Retake Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
