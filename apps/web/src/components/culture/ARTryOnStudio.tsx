'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  CameraOff,
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
  Share2,
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
import BrandedShareModal from './BrandedShareModal';

interface ARTryOnStudioProps {
  customGarment?: GarmentDefinition;
  onSnapshotCaptured?: (dataUrl: string) => void;
  onExploreVendors?: () => void;
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
  onExploreVendors,
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
  const [showBrandedShareModal, setShowBrandedShareModal] = useState<boolean>(false);

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

                  // LAYER 1: BASE TRADITIONAL GARMENT
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

                  // LAYER 2: SECONDARY WAISTCOAT / APRON / SASH OVERLAY
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

                  // LAYER 3: TRADITIONAL HEADGEAR / CAP
                  if (selectedHeadgear && (noseRaw || leftEarRaw || rightEarRaw || leftEyeRaw)) {
                    const nose = noseRaw ? { x: mapX(noseRaw.x), y: mapY(noseRaw.y) } : null;
                    const le = leftEarRaw ? { x: mapX(leftEarRaw.x), y: mapY(leftEarRaw.y) } : null;
                    const re = rightEarRaw ? { x: mapX(rightEarRaw.x), y: mapY(rightEarRaw.y) } : null;
                    const ley = leftEyeRaw ? { x: mapX(leftEyeRaw.x), y: mapY(leftEyeRaw.y) } : null;
                    const rey = rightEyeRaw ? { x: mapX(rightEyeRaw.x), y: mapY(rightEyeRaw.y) } : null;

                    const headCenterX = nose ? nose.x : (ls.x + rs.x) / 2;
                    const eyeY = ley && rey ? (ley.y + rey.y) / 2 : (nose ? nose.y - shoulderDist * 0.4 : ls.y - shoulderDist * 0.6);

                    let headSpan = shoulderDist * 0.65;
                    if (le && re) {
                      headSpan = Math.hypot(re.x - le.x, re.y - le.y) * 1.35;
                    }

                    const targetHeadY = eyeY - (headSpan * selectedHeadgear.anchorPoints.verticalHeadOffsetRatio);

                    let targetHeadAngle = prev.angle;
                    if (le && re) {
                      const hdx = isMirrored ? le.x - re.x : re.x - le.x;
                      const hdy = isMirrored ? le.y - re.y : re.y - le.y;
                      targetHeadAngle = Math.atan2(hdy, hdx);
                    }

                    const targetHeadWidth = headSpan * selectedHeadgear.anchorPoints.widthScaleRatio * manualScale;
                    const targetHeadHeight = (headSpan * 0.6) * selectedHeadgear.anchorPoints.heightScaleRatio * manualScale;

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
                    ctx.strokeStyle = '#1A73E8';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(ls.x, ls.y);
                    ctx.lineTo(rs.x, rs.y);
                    ctx.stroke();

                    ctx.fillStyle = '#E37400';
                    ctx.beginPath();
                    ctx.arc(ls.x, ls.y, 5, 0, Math.PI * 2);
                    ctx.arc(rs.x, rs.y, 5, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#1E8E3E';
                    ctx.beginPath();
                    ctx.arc(prev.neckX, prev.neckY, 6, 0, Math.PI * 2);
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
          const stream = videoRef.current as HTMLVideoElement;
          if (stream.srcObject) {
            (stream.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
          }
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
      className="relative flex flex-col items-center w-full bg-[#FFFFFF] border border-[#DADCE0] rounded-[8px] p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)] overflow-hidden"
    >
      {/* Top Header Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 border-b border-[#DADCE0] pb-3 mb-3">
        <div>
          <h2 className="text-[16px] font-medium text-[#202124] leading-tight">
            Virtual AR Attire Studio
          </h2>
          <p className="text-[12px] text-[#5F6368]">
            Live upper-body tracking, proportional scaling & accessory layering (30+ FPS)
          </p>
        </div>

        {/* Action Toolbar (Google Outlined & Chip Style) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Pose Guide Hint */}
          <button
            onClick={() => setShowPoseGuide(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] text-[12px] font-medium border border-[#DADCE0] bg-[#FFFFFF] text-[#0B3D91] hover:bg-[#F8F9FA] transition-colors"
            title="How to pose for optimal tracking"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0B3D91]" />
            <span className="hidden sm:inline">Pose Guide</span>
          </button>

          {/* Layer Stacking Drawer Toggle */}
          <button
            onClick={() => setShowLayersDrawer(!showLayersDrawer)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] text-[12px] font-medium border transition-colors ${
              showLayersDrawer || selectedHeadgear || selectedLayer
                ? 'bg-[#E8F0FE] text-[#0B3D91] border-[#D2E3FC]'
                : 'border-[#DADCE0] bg-[#FFFFFF] text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124]'
            }`}
            title="Toggle accessories & outer layers"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Layers</span>
          </button>

          {/* Debug Skeleton Toggle */}
          <button
            onClick={() => setShowDebugSkeleton(!showDebugSkeleton)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] text-[12px] font-medium border transition-colors ${
              showDebugSkeleton
                ? 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]'
                : 'border-[#DADCE0] bg-[#FFFFFF] text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124]'
            }`}
            title="Toggle landmark skeleton overlay"
          >
            {showDebugSkeleton ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Skeleton</span>
          </button>

          {/* Mirror Toggle */}
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] text-[12px] font-medium border transition-colors ${
              isMirrored
                ? 'bg-[#E8F0FE] text-[#0B3D91] border-[#D2E3FC]'
                : 'border-[#DADCE0] bg-[#FFFFFF] text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124]'
            }`}
            title="Mirror video feed"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mirror</span>
          </button>

          {/* Camera Flip Switcher */}
          <button
            onClick={() => {
              setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'));
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] text-[12px] font-medium border border-[#DADCE0] bg-[#FFFFFF] text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124] transition-colors"
            title="Flip camera (Front / Back)"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0B3D91]" />
            <span className="hidden sm:inline">{cameraFacing === 'user' ? 'Front' : 'Back'}</span>
          </button>

          {/* Fine-Tuning Fit Toggle */}
          <button
            onClick={() => setShowAdjustmentSliders(!showAdjustmentSliders)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] text-[12px] font-medium border transition-colors ${
              showAdjustmentSliders
                ? 'bg-[#E8F0FE] text-[#0B3D91] border-[#D2E3FC]'
                : 'border-[#DADCE0] bg-[#FFFFFF] text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124]'
            }`}
            title="Manual garment fine-tuning"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fit</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-[4px] text-[#5F6368] hover:text-[#202124] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] transition-colors"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Accessories & Stacking Layers Drawer */}
      {showLayersDrawer && (
        <div className="w-full mb-3 p-3.5 rounded-[4px] bg-[#F8F9FA] border border-[#DADCE0] space-y-3">
          <div className="flex items-center justify-between border-b border-[#DADCE0] pb-2">
            <div className="flex items-center gap-1.5 text-[#0B3D91] font-medium text-[13px]">
              <Layers className="w-4 h-4" />
              <span>Multi-Piece Layer Stacking (Headgear & Outer Layers)</span>
            </div>
            <button
              onClick={() => setShowLayersDrawer(false)}
              className="text-[12px] text-[#5F6368] hover:text-[#202124]"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Traditional Headgear */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#5F6368] block">
                Traditional Headgear (Layer 3)
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedHeadgear(null)}
                  className={`px-2.5 py-1 rounded-[4px] text-[12px] font-medium border transition-colors ${
                    selectedHeadgear === null
                      ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                      : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA]'
                  }`}
                >
                  None
                </button>
                {SIKKIM_HEADGEAR_CATALOG.map((hat) => (
                  <button
                    key={hat.id}
                    onClick={() => setSelectedHeadgear(hat)}
                    className={`px-2.5 py-1 rounded-[4px] text-[12px] font-medium border transition-colors ${
                      selectedHeadgear?.id === hat.id
                        ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                        : 'bg-[#FFFFFF] text-[#202124] border-[#DADCE0] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    {hat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Outer Layer */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#5F6368] block">
                Outer Layer / Sash (Layer 2)
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedLayer(null)}
                  className={`px-2.5 py-1 rounded-[4px] text-[12px] font-medium border transition-colors ${
                    selectedLayer === null
                      ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                      : 'bg-[#FFFFFF] text-[#5F6368] border-[#DADCE0] hover:bg-[#F8F9FA]'
                  }`}
                >
                  None
                </button>
                {SIKKIM_LAYERS_CATALOG.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer)}
                    className={`px-2.5 py-1 rounded-[4px] text-[12px] font-medium border transition-colors ${
                      selectedLayer?.id === layer.id
                        ? 'bg-[#0B3D91] text-[#FFFFFF] border-[#0B3D91]'
                        : 'bg-[#FFFFFF] text-[#202124] border-[#DADCE0] hover:bg-[#F8F9FA]'
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

      {/* Main Camera Viewport Frame */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[580px] rounded-[4px] bg-[#000000] border border-[#DADCE0] overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="hidden"
        />

        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />

        {/* Top-Left Telemetry HUD (Google Chip Style) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 bg-[#FFFFFF]/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#DADCE0] text-[11px] shadow-sm text-[#202124]">
            <span className={`w-2 h-2 rounded-full ${fps >= 20 ? 'bg-[#1E8E3E]' : 'bg-[#E37400]'}`} />
            <span className="font-mono font-medium">{fps} FPS</span>
            <span className="text-[#DADCE0]">|</span>
            <span className="text-[#5F6368]">Confidence:</span>
            <span className={`font-mono font-medium ${confidence > 55 ? 'text-[#1E8E3E]' : 'text-[#E37400]'}`}>
              {confidence}%
            </span>
          </div>

          {status === 'active_tracking' && (
            <div className="flex items-center gap-1 bg-[#E6F4EA]/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-[#CEEAD6] text-[10px] text-[#137333] font-medium w-fit">
              <ShieldCheck className="w-3 h-3" />
              <span>Pose Locked</span>
            </div>
          )}
          {status === 'no_person_detected' && (
            <div className="flex items-center gap-1 bg-[#FEF7E0]/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-[#FEEFC3] text-[10px] text-[#B06000] font-medium w-fit">
              <AlertTriangle className="w-3 h-3" />
              <span>Step into frame</span>
            </div>
          )}
        </div>

        {/* Top-Right Active Outfit Stack Chip */}
        <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none max-w-[220px]">
          <div className="bg-[#FFFFFF]/90 backdrop-blur-sm p-2 rounded-[4px] border border-[#DADCE0] text-[11px] shadow-sm space-y-0.5">
            <span className="text-[10px] uppercase font-medium text-[#0B3D91] block">
              Active Attire
            </span>
            <div className="text-[#202124] font-medium truncate">
              {garment.name}
            </div>
            {selectedLayer && (
              <div className="text-[#5F6368] text-[10px] truncate">
                + {selectedLayer.name}
              </div>
            )}
            {selectedHeadgear && (
              <div className="text-[#5F6368] text-[10px] truncate">
                + {selectedHeadgear.name}
              </div>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {(status === 'loading_engine' || status === 'requesting_camera') && (
          <div className="absolute inset-0 bg-[#FFFFFF]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#DADCE0] border-t-[#0B3D91] animate-spin" />
            <div className="space-y-1">
              <h3 className="text-[14px] font-medium text-[#202124]">
                {status === 'loading_engine'
                  ? 'Initializing MediaPipe Pose & Vision Task...'
                  : 'Connecting to Camera Stream...'}
              </h3>
              <p className="text-[12px] text-[#5F6368] max-w-xs">
                Calibrating real-time 33-point upper body landmarks
              </p>
            </div>
          </div>
        )}

        {/* Camera Permission Denied Overlay */}
        {status === 'camera_denied' && (
          <div className="absolute inset-0 bg-[#FFFFFF]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30 space-y-3">
            <div className="p-3 rounded-full bg-[#FCE8E6] text-[#C5221F]">
              <CameraOff className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-[15px] font-medium text-[#202124]">Camera Access Required</h3>
              <p className="text-[12px] text-[#5F6368] leading-relaxed">
                {errorMessage ||
                  'Webcam permission is needed to track your body posture and fit traditional attire in real time.'}
              </p>
            </div>
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[13px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Permission</span>
            </button>
          </div>
        )}
      </div>

      {/* Manual Fine-Tuning Drawer */}
      {showAdjustmentSliders && (
        <div className="w-full mt-3 p-3.5 rounded-[4px] bg-[#F8F9FA] border border-[#DADCE0] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[13px] font-medium text-[#202124] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#0B3D91]" />
              <span>Garment Fitting Calibration</span>
            </h4>
            <button
              onClick={() => {
                setManualScale(1.0);
                setManualOffsetY(0);
                setManualOffsetX(0);
              }}
              className="text-[11px] text-[#0B3D91] hover:underline font-medium"
            >
              Reset Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
            <div className="space-y-1">
              <div className="flex justify-between text-[#5F6368]">
                <span>Scale Multiplier:</span>
                <span className="font-mono text-[#202124]">{manualScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.02"
                value={manualScale}
                onChange={(e) => setManualScale(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#DADCE0] rounded appearance-none cursor-pointer accent-[#0B3D91]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[#5F6368]">
                <span>Vertical Offset (Y):</span>
                <span className="font-mono text-[#202124]">{manualOffsetY} px</span>
              </div>
              <input
                type="range"
                min="-80"
                max="80"
                step="2"
                value={manualOffsetY}
                onChange={(e) => setManualOffsetY(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-[#DADCE0] rounded appearance-none cursor-pointer accent-[#0B3D91]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[#5F6368]">
                <span>Horizontal Offset (X):</span>
                <span className="font-mono text-[#202124]">{manualOffsetX} px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                step="2"
                value={manualOffsetX}
                onChange={(e) => setManualOffsetX(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-[#DADCE0] rounded appearance-none cursor-pointer accent-[#0B3D91]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Controls */}
      <div className="w-full mt-3 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#DADCE0]">
        <div className="flex items-center gap-1.5 text-[12px] text-[#5F6368]">
          <Info className="w-3.5 h-3.5 text-[#0B3D91] shrink-0" />
          <span>
            Position yourself 1.5 – 2.5m away so shoulders and waist are visible.
          </span>
        </div>

        <button
          onClick={handleCaptureSnapshot}
          disabled={status !== 'active_tracking'}
          className="w-full sm:w-auto px-4 py-2 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Camera className="w-4 h-4 text-[#FFFFFF]" />
          <span>Take AR Snapshot</span>
        </button>
      </div>

      {/* "How to Pose" Onboarding Modal */}
      {showPoseGuide && (
        <div className="fixed inset-0 z-50 bg-[#000000]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#DADCE0] pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#0B3D91]" />
                <h3 className="text-[16px] font-medium text-[#202124]">How to Pose for Optimal Tracking</h3>
              </div>
              <button
                onClick={() => setShowPoseGuide(false)}
                className="p-1 rounded-[4px] text-[#5F6368] hover:text-[#202124] hover:bg-[#F8F9FA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-[13px] text-[#5F6368]">
              <div className="flex items-start gap-2.5 p-3 rounded-[4px] bg-[#F8F9FA] border border-[#DADCE0]">
                <Compass className="w-4 h-4 text-[#0B3D91] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-[#202124] text-[13px]">1. Step Back for Full Upper Body</h4>
                  <p className="text-[12px] text-[#5F6368] mt-0.5">
                    Position your phone or webcam so head, shoulders, and waist are inside the camera frame (approx. 1.5 to 2.5 meters away).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-[4px] bg-[#F8F9FA] border border-[#DADCE0]">
                <Lightbulb className="w-4 h-4 text-[#0B3D91] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-[#202124] text-[13px]">2. Frontal Natural Lighting</h4>
                  <p className="text-[12px] text-[#5F6368] mt-0.5">
                    Ensure adequate room light. Avoid placing bright windows or direct backlight behind you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-[4px] bg-[#F8F9FA] border border-[#DADCE0]">
                <ShieldCheck className="w-4 h-4 text-[#0B3D91] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-[#202124] text-[13px]">3. Natural Posture</h4>
                  <p className="text-[12px] text-[#5F6368] mt-0.5">
                    Keep your shoulders level and arms slightly relaxed from your sides for accurate robe draping.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPoseGuide(false)}
              className="w-full py-2 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[13px] font-medium transition-colors"
            >
              Continue to AR Studio
            </button>
          </div>
        </div>
      )}

      {/* Snapshot Preview Modal */}
      {snapshotDataUrl && (
        <div className="fixed inset-0 z-50 bg-[#000000]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#DADCE0] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E8E3E]" />
                <h3 className="text-[16px] font-medium text-[#202124]">AR Photo Captured</h3>
              </div>
              <button
                onClick={() => setSnapshotDataUrl(null)}
                className="text-[12px] text-[#5F6368] hover:text-[#202124] px-1.5 py-0.5"
              >
                Close
              </button>
            </div>

            <div className="rounded-[4px] overflow-hidden border border-[#DADCE0] bg-[#000000] aspect-[4/3] flex items-center justify-center">
              <img
                src={snapshotDataUrl}
                alt="AR Try-On Snapshot"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={() => setShowBrandedShareModal(true)}
                className="flex-1 py-2 px-3 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Create Branded Share Postcard</span>
              </button>
              <button
                onClick={handleDownloadSnapshot}
                className="py-2 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] text-[#0B3D91] text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Raw (PNG)</span>
              </button>
              <button
                onClick={() => setSnapshotDataUrl(null)}
                className="py-2 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] text-[#5F6368] text-[13px] font-medium transition-colors"
              >
                Retake
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branded Postcard Share Modal */}
      {showBrandedShareModal && snapshotDataUrl && (
        <BrandedShareModal
          rawSnapshotDataUrl={snapshotDataUrl}
          garment={garment}
          headgear={selectedHeadgear}
          layer={selectedLayer}
          onClose={() => setShowBrandedShareModal(false)}
          onExploreVendors={onExploreVendors}
        />
      )}
    </div>
  );
}
