'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Maximize2,
  Minimize2,
  Compass,
  Volume2,
  RotateCw,
  X,
  Sparkles,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PanoramaScene, PanoramaHotspot } from '@sikkim-yatra/shared';

interface PanoramaViewer360Props {
  scenes: PanoramaScene[];
  initialSceneId?: string;
  heightClass?: string;
  onSceneChange?: (scene: PanoramaScene) => void;
}

export default function PanoramaViewer360({
  scenes,
  initialSceneId,
  heightClass = 'h-[580px]',
  onSceneChange,
}: PanoramaViewer360Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(() => {
    const idx = scenes.findIndex((s) => s.id === initialSceneId);
    return idx !== -1 ? idx : 0;
  });

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<PanoramaHotspot | null>(null);

  const [activeHotspotsScreenPos, setActiveHotspotsScreenPos] = useState<
    { hotspot: PanoramaHotspot; x: number; y: number; visible: boolean }[]
  >([]);

  const currentScene = scenes[currentSceneIndex] || scenes[0];

  // Three.js instances ref
  const threeState = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    sphereMesh: THREE.Mesh | null;
    isUserInteracting: boolean;
    isAutoRotating: boolean;
    onMouseDownMouseX: number;
    onMouseDownMouseY: number;
    lon: number;
    onMouseDownLon: number;
    lat: number;
    onMouseDownLat: number;
    phi: number;
    theta: number;
    fov: number;
    reqAnimId: number | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    sphereMesh: null,
    isUserInteracting: false,
    isAutoRotating: true,
    onMouseDownMouseX: 0,
    onMouseDownMouseY: 0,
    lon: 0,
    onMouseDownLon: 0,
    lat: 0,
    onMouseDownLat: 0,
    phi: 0,
    theta: 0,
    fov: 75,
    reqAnimId: null,
  });

  // Keep isAutoRotating ref in sync
  useEffect(() => {
    threeState.current.isAutoRotating = isAutoRotating;
  }, [isAutoRotating]);

  // Calculate 2D screen positions for 3D hotspots
  const updateHotspotScreenPositions = useCallback(() => {
    const { camera } = threeState.current;
    const container = containerRef.current;
    if (!camera || !container || !currentScene) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const calculated = (currentScene.hotspots || []).map((hotspot) => {
      // Convert pitch & yaw (degrees) to 3D Cartesian spherical coordinates
      const phi = THREE.MathUtils.degToRad(90 - hotspot.pitch);
      const theta = THREE.MathUtils.degToRad(hotspot.yaw);

      const radius = 450; // Inside sphere of radius 500
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      const pos = new THREE.Vector3(x, y, z);
      pos.project(camera);

      // Check if hotspot is facing the camera in front
      const isVisible = pos.z < 1;
      const screenX = ((pos.x + 1) * width) / 2;
      const screenY = ((-pos.y + 1) * height) / 2;

      return {
        hotspot,
        x: screenX,
        y: screenY,
        visible: isVisible,
      };
    });

    setActiveHotspotsScreenPos(calculated);
  }, [currentScene]);

  // Texture Loader & Scene Initializer
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !currentScene) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(currentScene.initialView?.fov || 75, width / height, 1, 1100);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Inverted Sphere for Equirectangular Panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      currentScene.panoramaImageUrl,
      () => {
        renderer.render(scene, camera);
      },
      undefined,
      (err) => {
        console.warn('[Panorama] Texture load fallback:', err);
      }
    );
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);

    // Ambient Warm Light for sacred atmosphere
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    threeState.current = {
      ...threeState.current,
      scene,
      camera,
      renderer,
      sphereMesh,
      lon: currentScene.initialView?.yaw || 0,
      lat: currentScene.initialView?.pitch || 0,
      fov: currentScene.initialView?.fov || 75,
    };

    // Animation Loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (threeState.current.isAutoRotating && !threeState.current.isUserInteracting) {
        threeState.current.lon += 0.08;
      }

      threeState.current.lat = Math.max(-85, Math.min(85, threeState.current.lat));
      const phi = THREE.MathUtils.degToRad(90 - threeState.current.lat);
      const theta = THREE.MathUtils.degToRad(threeState.current.lon);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      renderer.render(scene, camera);
      updateHotspotScreenPositions();
    };

    animate();
    threeState.current.reqAnimId = animId;

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateHotspotScreenPositions();
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [currentScene, updateHotspotScreenPositions]);


  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    threeState.current.isUserInteracting = true;
    threeState.current.onMouseDownMouseX = e.clientX;
    threeState.current.onMouseDownMouseY = e.clientY;
    threeState.current.onMouseDownLon = threeState.current.lon;
    threeState.current.onMouseDownLat = threeState.current.lat;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (threeState.current.isUserInteracting) {
      const deltaX = e.clientX - threeState.current.onMouseDownMouseX;
      const deltaY = e.clientY - threeState.current.onMouseDownMouseY;
      threeState.current.lon = (threeState.current.onMouseDownLon - deltaX * 0.15) % 360;
      threeState.current.lat = threeState.current.onMouseDownLat + deltaY * 0.15;
    }
  };

  const handlePointerUp = () => {
    threeState.current.isUserInteracting = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!threeState.current.camera) return;
    const currentFov = threeState.current.camera.fov;
    const nextFov = Math.max(30, Math.min(100, currentFov + e.deltaY * 0.05));
    threeState.current.camera.fov = nextFov;
    threeState.current.camera.updateProjectionMatrix();
    updateHotspotScreenPositions();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const switchScene = (index: number) => {
    setCurrentSceneIndex(index);
    setSelectedHotspot(null);
    if (scenes[index] && onSceneChange) {
      onSceneChange(scenes[index]);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      className={`relative w-full ${heightClass} bg-black rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 select-none group cursor-grab active:cursor-grabbing`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Top Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 pointer-events-auto shadow-xl max-w-md">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
              360° Virtual Pilgrimage
            </span>
            <span className="text-xs text-white/50">{currentScene?.roomName || 'Sanctuary'}</span>
          </div>
          <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            {currentScene?.sceneTitle || 'Sacred Shrine'}
          </h3>
          <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5">{currentScene?.monasteryName || 'Sikkim Heritage'}</p>
        </div>

        {/* Scene Selector Dropdown */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <select
            value={currentSceneIndex}
            onChange={(e) => switchScene(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-semibold border border-white/20 shadow-xl focus:outline-none focus:border-amber-400 backdrop-blur-md"
          >
            {scenes.map((s, idx) => (
              <option key={s.id} value={idx}>
                🛕 {s.monasteryName} — {s.roomName}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all shadow-xl ${
              isAutoRotating
                ? 'bg-amber-500/30 border-amber-400 text-amber-300'
                : 'bg-black/60 border-white/20 text-white/70 hover:text-white'
            }`}
            title={isAutoRotating ? 'Pause auto-rotation' : 'Start auto-rotation'}
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white/80 hover:text-white border border-white/20 backdrop-blur-md shadow-xl transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 360°'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive 3D Hotspot Badges on Screen */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {activeHotspotsScreenPos.map(({ hotspot, x, y, visible }) => {
          if (!visible || x < 0 || x > (containerRef.current?.clientWidth || 0) || y < 0 || y > (containerRef.current?.clientHeight || 0)) {
            return null;
          }

          return (
            <button
              key={hotspot.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHotspot(hotspot);
              }}
              style={{
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
              }}
              className="absolute pointer-events-auto p-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-2xl hover:scale-125 transition-transform flex items-center justify-center ring-4 ring-amber-400/40 animate-bounce group/pin"
            >
              <Sparkles className="w-4 h-4" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-8 opacity-0 group-hover/pin:opacity-100 transition-opacity bg-slate-950/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap border border-white/20 pointer-events-none shadow-xl">
                {hotspot.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Controls Strip */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-white/80 pointer-events-auto flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Click & Drag to Look Around • Scroll to Zoom</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {scenes.length > 1 && (
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/15">
              <button
                onClick={() => switchScene((currentSceneIndex - 1 + scenes.length) % scenes.length)}
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                title="Previous Scene"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-bold text-white px-2">
                {currentSceneIndex + 1} / {scenes.length}
              </span>
              <button
                onClick={() => switchScene((currentSceneIndex + 1) % scenes.length)}
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                title="Next Scene"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hotspot Sacred Relic Details Modal */}
      {selectedHotspot && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-4 bottom-4 md:inset-auto md:bottom-8 md:right-8 md:w-96 z-30 p-5 rounded-3xl bg-slate-950/95 border border-amber-500/40 text-white shadow-2xl backdrop-blur-2xl space-y-3 animate-fadeIn"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {selectedHotspot.category.toUpperCase()} RELIC
              </span>
              <h4 className="text-base font-bold text-white mt-1">{selectedHotspot.title}</h4>
              {selectedHotspot.tibetanTitle && (
                <p className="text-xs text-amber-200/70 font-medium">{selectedHotspot.tibetanTitle}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-white/80 leading-relaxed">{selectedHotspot.description}</p>

          {selectedHotspot.audioLoreSnippet && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
              <Volume2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed italic">{selectedHotspot.audioLoreSnippet}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
