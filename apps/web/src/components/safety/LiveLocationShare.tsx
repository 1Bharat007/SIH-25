'use client';

import React, { useState, useEffect } from 'react';
import { Navigation, Copy, Check, MessageCircle, Square, Radio } from 'lucide-react';
import { LiveLocationSession } from '@sikkim-yatra/shared';
import { safetyService } from '../../services/safety.service';
import { useUserGeolocation } from '../../hooks/useSafety';

const DURATIONS = [
  { minutes: 15, label: '15 Mins' },
  { minutes: 60, label: '1 Hour' },
  { minutes: 240, label: '4 Hours' },
  { minutes: 480, label: '8 Hours' },
];

export default function LiveLocationShare() {
  const [duration, setDuration] = useState(60);
  const [session, setSession] = useState<LiveLocationSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const { coordinates, batteryLevel } = useUserGeolocation();

  // Watch position during active session
  useEffect(() => {
    let watchId: number;
    if (session && session.isActive && typeof window !== 'undefined' && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        pos => {
          safetyService.updateLiveLocation(session.token, {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            altitudeMeters: pos.coords.altitude ? Math.round(pos.coords.altitude) : undefined,
            accuracyMeters: Math.round(pos.coords.accuracy),
            batteryLevel,
          });
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [session, batteryLevel]);

  // Countdown timer for active session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (session && session.isActive) {
      const updateTimer = () => {
        const diff = new Date(session.expiresAt).getTime() - Date.now();
        if (diff <= 0) {
          setTimeLeft('Expired');
          setSession(prev => (prev ? { ...prev, isActive: false } : null));
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${hours > 0 ? `${hours}h ` : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`);
        }
      };

      updateTimer();
      interval = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(interval);
  }, [session]);

  const handleStartSharing = async () => {
    setIsLoading(true);
    try {
      const newSession = await safetyService.startLiveLocation({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        altitudeMeters: coordinates.altitudeMeters,
        accuracyMeters: coordinates.accuracyMeters,
        batteryLevel,
        durationMinutes: duration,
      });
      setSession(newSession);
    } catch {
      // Ignore sharing error
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSharing = () => {
    setSession(null);
  };

  const fullShareUrl =
    typeof window !== 'undefined' && session
      ? `${window.location.origin}${session.shareableUrl}`
      : '';

  const handleCopy = () => {
    if (fullShareUrl) {
      navigator.clipboard.writeText(fullShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const whatsappShareText = `I am sharing my live location in Sikkim with you: ${fullShareUrl} (Active for ${duration} mins).`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`;

  return (
    <div className="rounded-3xl border border-teal-500/20 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-teal-900/40 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="h-5 w-5 text-teal-400 animate-pulse" />
            <span>Share My Live Location</span>
          </h3>
          <p className="text-xs text-teal-300/70">
            Send real-time GPS coordinates with auto-expiring secure link
          </p>
        </div>

        {session?.isActive && (
          <span className="flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-300 border border-teal-500/40 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            <span>Live Sharing Active</span>
          </span>
        )}
      </div>

      {session && session.isActive ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-teal-500/30 bg-teal-950/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-teal-400">Session Remaining</span>
                <div className="text-xl font-bold font-mono text-white mt-0.5">{timeLeft}</div>
              </div>
              <button
                onClick={handleStopSharing}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-950/40 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/40"
              >
                <Square className="h-3 w-3 fill-current" />
                <span>Stop Sharing</span>
              </button>
            </div>
          </div>

          {/* Share Controls */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Shareable Live Tracking URL</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 font-semibold text-teal-400 hover:text-teal-300"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
              </button>
            </div>

            <input
              type="text"
              readOnly
              value={fullShareUrl}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-teal-200 font-mono"
            />

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Share Link via WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-teal-200 block mb-2">
              Select Sharing Duration:
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DURATIONS.map(d => (
                <button
                  key={d.minutes}
                  onClick={() => setDuration(d.minutes)}
                  className={`rounded-2xl border p-3 text-xs font-bold transition-all ${
                    duration === d.minutes
                      ? 'border-teal-400 bg-teal-500/20 text-teal-200 shadow-md'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartSharing}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 py-3.5 text-xs font-bold text-slate-950 shadow-lg shadow-teal-950/60 hover:from-teal-400 hover:to-emerald-500 transition-all"
          >
            <Navigation className="h-4 w-4 fill-current" />
            <span>{isLoading ? 'Creating Session...' : 'Start Sharing Live Location'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
