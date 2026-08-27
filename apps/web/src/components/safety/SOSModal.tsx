'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  X,
  Phone,
  MessageCircle,
  MapPin,
  Battery,
  CheckCircle2,
  Share2,
  RefreshCw,
  Copy,
  Check,
  HeartPulse,
  Snowflake,
  Wrench,
  Compass,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { EmergencyDistressType, SOSDispatchResult } from '@sikkim-yatra/shared';
import {
  useUserGeolocation,
  useNearestEmergencyQuery,
  useTrustedContacts,
  useSOSMutation,
} from '../../hooks/useSafety';

const EMERGENCY_TYPES: { type: EmergencyDistressType; icon: React.ElementType; label: string }[] = [
  { type: 'Medical Emergency', icon: HeartPulse, label: 'Medical Aid / Altitude Sickness' },
  { type: 'Stranded in Snow / Landslide', icon: Snowflake, label: 'Stranded (Snow / Landslide)' },
  { type: 'Vehicle Breakdown', icon: Wrench, label: 'Vehicle Breakdown in Pass' },
  { type: 'Lost in Mountain Trail', icon: Compass, label: 'Lost / Disoriented in Trail' },
  { type: 'Harassment / Security Threat', icon: Shield, label: 'Security / Harassment Threat' },
  { type: 'Other Emergency', icon: AlertCircle, label: 'General Emergency Distress' },
];


interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SOSModal({ isOpen, onClose }: SOSModalProps) {
  const [selectedType, setSelectedType] = useState<EmergencyDistressType>('Medical Emergency');
  const [notes, setNotes] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [dispatchResult, setDispatchResult] = useState<SOSDispatchResult | null>(null);
  const [copied, setCopied] = useState(false);

  const { coordinates, batteryLevel, gpsStatus, refreshLocation } = useUserGeolocation();
  const { contacts } = useTrustedContacts();
  const { data: nearestEmergency } = useNearestEmergencyQuery(
    coordinates.latitude,
    coordinates.longitude
  );

  const sosMutation = useSOSMutation();

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setCountdown(null);
      setDispatchResult(null);
    }
  }, [isOpen]);

  // Countdown timer handler for accidental trigger prevention
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (countdown === 0) {
      // Trigger actual dispatch
      setCountdown(null);
      sosMutation.mutate(
        {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          altitudeMeters: coordinates.altitudeMeters,
          accuracyMeters: coordinates.accuracyMeters,
          batteryLevel,
          emergencyType: selectedType,
          notes: notes.trim() || undefined,
          notifyTrustedContacts: true,
          trustedContacts: contacts,
        },
        {
          onSuccess: data => {
            setDispatchResult(data);
          },
        }
      );
    }
    return () => clearTimeout(timer);
  }, [countdown, coordinates, batteryLevel, selectedType, notes, contacts, sosMutation]);

  if (!isOpen) return null;

  const handleStartCountdown = () => {
    setCountdown(3); // 3-second buffer to cancel
  };

  const handleCancelCountdown = () => {
    setCountdown(null);
  };

  const handleCopySms = () => {
    if (dispatchResult?.smsPayloadPreview) {
      navigator.clipboard?.writeText(dispatchResult.smsPayloadPreview);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-rose-500/40 bg-[#0c0507] p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Background glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-rose-600/20 blur-3xl" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-rose-900/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-900/80 animate-pulse">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white uppercase sm:text-xl">
                Emergency SOS Broadcast
              </h2>
              <p className="text-xs text-rose-300/80">
                Sikkim State Disaster Response & Police Dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-rose-300 hover:bg-rose-950/60 transition-colors"
            title="Close SOS"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Render Dispatch Result Confirmation if completed */}
        {dispatchResult ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-3">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                SOS Broadcast Dispatched
              </span>
              <h3 className="mt-2 text-lg font-bold text-white">Emergency Response Alert Active</h3>
              <p className="text-xs text-emerald-200/80 mt-1 font-mono">
                Confirmation ID: {dispatchResult.confirmationCode}
              </p>
            </div>

            {/* Nearest Dispatched Posts */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  Primary Police Outpost ({dispatchResult.nearestPolice.distanceKm} km)
                </span>
                <h4 className="mt-1 text-sm font-bold text-white">
                  {dispatchResult.nearestPolice.name}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {dispatchResult.nearestPolice.address}
                </p>
                <a
                  href={`tel:${dispatchResult.nearestPolice.phone.replace(/[^0-9+]/g, '')}`}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2 text-xs font-bold text-white hover:bg-rose-500 transition-all shadow-md"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call Police ({dispatchResult.nearestPolice.phone})</span>
                </a>
              </div>

              <div className="rounded-2xl border border-teal-500/30 bg-teal-950/30 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Nearest Hospital ({dispatchResult.nearestHospital.distanceKm} km)
                </span>
                <h4 className="mt-1 text-sm font-bold text-white">
                  {dispatchResult.nearestHospital.name}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {dispatchResult.nearestHospital.address}
                </p>
                <a
                  href={`tel:${dispatchResult.nearestHospital.phone.replace(/[^0-9+]/g, '')}`}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal-600 py-2 text-xs font-bold text-white hover:bg-teal-500 transition-all shadow-md"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call Hospital ({dispatchResult.nearestHospital.phone})</span>
                </a>
              </div>
            </div>

            {/* Instant Messaging & Sharing */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Trusted Contacts Notified ({contacts.length})
                </span>
                <button
                  onClick={handleCopySms}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Emergency Text'}</span>
                </button>
              </div>

              <a
                href={dispatchResult.whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/60 hover:bg-emerald-500 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Send Emergency GPS Location via WhatsApp</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Close Emergency Window
            </button>
          </div>
        ) : (
          /* SOS Trigger Screen */
          <div className="mt-5 space-y-5">
            {/* Live GPS & Device Telemetry Radar */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4">
              <div className="flex items-center justify-between border-b border-rose-900/30 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-rose-400" />
                  <span className="text-xs font-bold text-rose-200">Live GPS Location</span>
                  <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-rose-300">
                    {gpsStatus}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-rose-300">
                  {batteryLevel !== undefined && (
                    <div className="flex items-center gap-1">
                      <Battery className="h-3.5 w-3.5" />
                      <span>{batteryLevel}%</span>
                    </div>
                  )}
                  <button
                    onClick={refreshLocation}
                    className="hover:text-white"
                    title="Refresh GPS"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 sm:grid-cols-4">
                <div>
                  <span className="text-[10px] text-slate-500 block">Latitude</span>
                  <span className="font-bold text-white">{coordinates.latitude.toFixed(5)}° N</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Longitude</span>
                  <span className="font-bold text-white">
                    {coordinates.longitude.toFixed(5)}° E
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Altitude</span>
                  <span className="font-bold text-amber-300">
                    {coordinates.altitudeMeters || 1650} m
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Accuracy</span>
                  <span className="font-bold text-emerald-400">
                    ±{coordinates.accuracyMeters || 15} m
                  </span>
                </div>
              </div>

              {nearestEmergency && (
                <div className="mt-3 rounded-xl bg-black/40 p-2.5 flex items-center justify-between text-xs border border-rose-900/40">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-rose-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white">
                        {nearestEmergency.nearestPolice.name}
                      </span>
                      <span className="text-[11px] text-rose-300/80 block">
                        Closest Police Station • {nearestEmergency.nearestPolice.distanceKm} km away
                      </span>
                    </div>
                  </div>
                  <a
                    href={`tel:${nearestEmergency.nearestPolice.phone.replace(/[^0-9+]/g, '')}`}
                    className="rounded-lg bg-rose-600/80 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-500"
                  >
                    Call
                  </a>
                </div>
              )}
            </div>

            {/* Emergency Type Selector */}
            <div>
              <label className="text-xs font-bold text-white mb-2 block">
                Select Nature of Distress:
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {EMERGENCY_TYPES.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      onClick={() => setSelectedType(item.type)}
                      className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-all ${
                        selectedType === item.type
                          ? 'border-rose-500 bg-rose-600/30 text-white shadow-md'
                          : 'border-rose-900/30 bg-slate-950/40 text-slate-300 hover:bg-rose-950/30 hover:border-rose-700/50'
                      }`}
                    >
                      <Icon className="h-4 w-4 text-rose-400 shrink-0" />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>


            {/* Optional Distress Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Additional Notes / Landmarks (Optional):
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Near 13th Mile checkpost, 2 people with breathing difficulty..."
                className="w-full rounded-2xl border border-rose-900/40 bg-slate-950/60 p-3 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            {/* Trusted Contacts Preview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-emerald-400" />
                <span>
                  Emergency alert will also dispatch to{' '}
                  <strong className="text-white">{contacts.length} Trusted Contacts</strong>
                </span>
              </div>
            </div>

            {/* Accidental Protection Countdown vs Trigger Button */}
            {countdown !== null ? (
              <div className="rounded-2xl border border-rose-500 bg-rose-950/60 p-6 text-center space-y-3 animate-pulse">
                <div className="text-4xl font-black text-rose-400">{countdown}</div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Broadcasting SOS in {countdown} Seconds...
                </h4>
                <p className="text-xs text-rose-200/80">
                  Tap Cancel immediately if this was pressed by mistake
                </p>
                <button
                  onClick={handleCancelCountdown}
                  className="rounded-2xl bg-white px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-slate-200 shadow-xl"
                >
                  CANCEL SOS BROADCAST
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartCountdown}
                disabled={sosMutation.isPending}
                className="flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 py-4 text-sm font-black text-white uppercase tracking-wider shadow-2xl shadow-rose-900/90 hover:from-rose-500 hover:to-red-500 active:scale-[0.98] transition-all border border-rose-400/40"
              >
                <ShieldAlert className="h-5 w-5" />
                <span>Trigger Instant SOS Broadcast</span>
              </button>
            )}

            {/* 24x7 Direct Helplines Strip */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-rose-950">
              <span>Sikkim Tourist Helpline: 1364</span>
              <span>Police Control Room: 112 / 100</span>
              <span>Ambulance: 102 / 108</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
