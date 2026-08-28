'use client';

import React, { useState, useEffect } from 'react';
import { Navigation, Copy, Check, MessageCircle, Square } from 'lucide-react';

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
        (pos) => {
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
          setSession((prev) => (prev ? { ...prev, isActive: false } : null));
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(
            `${hours > 0 ? `${hours}h ` : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`
          );
        }
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(interval);
  }, [session]);

  const handleStartShare = async () => {
    try {
      setIsLoading(true);
      const newSession = await safetyService.createLiveLocationSession({
        durationMinutes: duration,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        altitudeMeters: coordinates.altitudeMeters,
        accuracyMeters: coordinates.accuracyMeters,
        batteryLevel,
      });
      setSession(newSession);
    } catch (err) {
      console.error('Failed to create live location session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopShare = async () => {
    if (!session) return;
    try {
      setIsLoading(true);
      const endedSession = await safetyService.endLiveLocationSession(session.token);
      setSession(endedSession);
    } catch (err) {
      console.error('Failed to end live location session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const shareUrl = session ? `${typeof window !== 'undefined' ? window.location.origin : ''}/safety/track/${session.token}` : '';

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleWhatsAppShare = () => {
    if (shareUrl) {
      const text = encodeURIComponent(
        `I am sharing my live mountain tracking location in Sikkim via Sikkim Yatra: ${shareUrl}\n(Active for next ${duration} mins)`
      );
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  return (
    <div className="rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-5 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)] space-y-4">
      <div className="flex items-center justify-between border-b border-[#DADCE0] pb-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#0B3D91]" />
          <h3 className="text-[15px] font-medium text-[#202124]">
            Live Mountain Location Sharing
          </h3>
        </div>
        <span className="text-[11px] font-medium bg-[#E8F0FE] text-[#0B3D91] px-2 py-0.5 rounded-full border border-[#D2E3FC]">
          Temporary Web Link
        </span>
      </div>

      <p className="text-[12px] text-[#5F6368] leading-relaxed">
        Generate a secure, time-limited tracking link for friends and family without requiring them to install an app.
      </p>

      {session && session.isActive ? (
        /* Active Session Display */
        <div className="rounded-[4px] border border-[#CEEAD6] bg-[#E6F4EA] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#137333]">
              <span className="w-2 h-2 rounded-full bg-[#1E8E3E] animate-pulse" />
              <span>Location Sharing Active</span>
            </div>
            <span className="text-[12px] font-mono font-medium text-[#137333]">
              Expires in: {timeLeft}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 py-2 px-3 rounded-[4px] bg-[#1E8E3E] hover:bg-[#137333] text-[#FFFFFF] text-[12px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send via WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] hover:bg-[#F8F9FA] text-[#0B3D91] text-[12px] font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#1E8E3E]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          <button
            onClick={handleStopShare}
            disabled={isLoading}
            className="w-full py-1.5 rounded-[4px] border border-[#FAD2CF] bg-[#FFFFFF] text-[#D93025] hover:bg-[#FCE8E6] text-[12px] font-medium transition-colors flex items-center justify-center gap-1"
          >
            <Square className="w-3.5 h-3.5" />
            <span>Stop Sharing Immediately</span>
          </button>
        </div>
      ) : (
        /* Duration Selection & Trigger */
        <div className="space-y-3">
          <div>
            <label className="block text-[12px] font-medium text-[#5F6368] mb-1.5">
              Select Sharing Duration:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.minutes}
                  onClick={() => setDuration(d.minutes)}
                  className={`py-2 rounded-[4px] border text-[12px] font-medium transition-colors ${
                    duration === d.minutes
                      ? 'border-[#0B3D91] bg-[#E8F0FE] text-[#0B3D91]'
                      : 'border-[#DADCE0] bg-[#FFFFFF] text-[#5F6368] hover:bg-[#F8F9FA]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartShare}
            disabled={isLoading}
            className="w-full py-2.5 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Navigation className="w-4 h-4" />
            <span>{isLoading ? 'Generating Link...' : `Start Sharing for ${duration} Mins`}</span>
          </button>
        </div>
      )}
    </div>
  );
}
