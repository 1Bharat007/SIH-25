'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  X,
  Phone,
  MessageCircle,
  MapPin,
  Battery,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  HeartPulse,
  Snowflake,
  Wrench,
  Compass,
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
  { type: 'Vehicle Breakdown', icon: Wrench, label: 'Vehicle Breakdown in Mountain Pass' },
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
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (countdown === 0) {
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
          onSuccess: (data) => {
            setDispatchResult(data);
          },
        }
      );
    }
    return () => clearTimeout(timer);
  }, [countdown, coordinates, batteryLevel, selectedType, notes, contacts, sosMutation]);

  if (!isOpen) return null;

  const handleStartCountdown = () => {
    setCountdown(3);
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#000000]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-5 sm:p-6 shadow-2xl text-[#202124] max-h-[90vh] overflow-y-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#DADCE0] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#FCE8E6] text-[#D93025]">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[16px] font-medium text-[#202124]">
                Emergency SOS Broadcast
              </h2>
              <p className="text-[12px] text-[#5F6368]">
                Sikkim State Disaster Response & Police Dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-[#5F6368] hover:text-[#202124] hover:bg-[#F8F9FA]"
            title="Close SOS"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Render Dispatch Result Confirmation if completed */}
        {dispatchResult ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-[4px] border border-[#CEEAD6] bg-[#E6F4EA] p-4 text-center space-y-1">
              <CheckCircle2 className="h-7 w-7 text-[#1E8E3E] mx-auto" />
              <h3 className="text-[15px] font-medium text-[#137333]">
                SOS Broadcast Dispatched Successfully
              </h3>
              <p className="text-[12px] text-[#137333] font-mono">
                Confirmation ID: {dispatchResult.confirmationCode}
              </p>
            </div>

            {/* Nearest Dispatched Posts */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] p-3.5 space-y-2">
                <span className="text-[11px] font-medium text-[#C5221F] bg-[#FCE8E6] px-2 py-0.5 rounded-full border border-[#FAD2CF]">
                  Police ({dispatchResult.nearestPolice.distanceKm} km)
                </span>
                <h4 className="text-[13px] font-medium text-[#202124]">
                  {dispatchResult.nearestPolice.name}
                </h4>
                <p className="text-[11px] text-[#5F6368]">
                  {dispatchResult.nearestPolice.address}
                </p>
                <a
                  href={`tel:${dispatchResult.nearestPolice.phone.replace(/[^0-9+]/g, '')}`}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-[4px] bg-[#D93025] py-2 text-[12px] font-medium text-[#FFFFFF] hover:bg-[#C5221F] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call Police ({dispatchResult.nearestPolice.phone})</span>
                </a>
              </div>

              <div className="rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] p-3.5 space-y-2">
                <span className="text-[11px] font-medium text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded-full border border-[#D2E3FC]">
                  Hospital ({dispatchResult.nearestHospital.distanceKm} km)
                </span>
                <h4 className="text-[13px] font-medium text-[#202124]">
                  {dispatchResult.nearestHospital.name}
                </h4>
                <p className="text-[11px] text-[#5F6368]">
                  {dispatchResult.nearestHospital.address}
                </p>
                <a
                  href={`tel:${dispatchResult.nearestHospital.phone.replace(/[^0-9+]/g, '')}`}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-[4px] bg-[#0B3D91] py-2 text-[12px] font-medium text-[#FFFFFF] hover:bg-[#082E6E] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call Hospital ({dispatchResult.nearestHospital.phone})</span>
                </a>
              </div>
            </div>

            {/* Instant Messaging & Sharing */}
            <div className="rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#202124]">
                  Trusted Contacts Notified ({contacts.length})
                </span>
                <button
                  onClick={handleCopySms}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0B3D91] hover:underline"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy SOS Text'}</span>
                </button>
              </div>

              <a
                href={dispatchResult.whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-[4px] bg-[#1E8E3E] py-2 text-[12px] font-medium text-[#FFFFFF] hover:bg-[#137333] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Send Emergency GPS Location via WhatsApp</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] py-2 text-[12px] font-medium text-[#5F6368] hover:bg-[#F8F9FA]"
            >
              Close Emergency Window
            </button>
          </div>
        ) : (
          /* SOS Trigger Screen */
          <div className="mt-4 space-y-4">
            {/* Live GPS & Device Telemetry Radar */}
            <div className="rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-[#DADCE0] pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#0B3D91]" />
                  <span className="text-[12px] font-medium text-[#202124]">Live GPS Coordinates</span>
                  <span className="rounded-full bg-[#E8F0FE] px-2 py-0.2 text-[10px] font-medium text-[#0B3D91] border border-[#D2E3FC]">
                    {gpsStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#5F6368]">
                  {batteryLevel !== undefined && (
                    <div className="flex items-center gap-1">
                      <Battery className="h-3.5 w-3.5" />
                      <span>{batteryLevel}%</span>
                    </div>
                  )}
                  <button
                    onClick={refreshLocation}
                    className="hover:text-[#202124]"
                    title="Refresh GPS"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-[#5F6368] block">Latitude</span>
                  <span className="font-medium text-[#202124]">{coordinates.latitude.toFixed(5)}° N</span>
                </div>
                <div>
                  <span className="text-[#5F6368] block">Longitude</span>
                  <span className="font-medium text-[#202124]">{coordinates.longitude.toFixed(5)}° E</span>
                </div>
                <div>
                  <span className="text-[#5F6368] block">Altitude</span>
                  <span className="font-medium text-[#B06000]">{coordinates.altitudeMeters || 1650} m</span>
                </div>
                <div>
                  <span className="text-[#5F6368] block">Accuracy</span>
                  <span className="font-medium text-[#137333]">±{coordinates.accuracyMeters || 15} m</span>
                </div>
              </div>

              {nearestEmergency && (
                <div className="pt-2 border-t border-[#DADCE0] flex flex-wrap justify-between text-[11px] text-[#5F6368]">
                  <span>Nearest Police: <strong className="text-[#202124]">{nearestEmergency.nearestPolice?.name || 'Sadar Police Post'}</strong> ({nearestEmergency.nearestPolice?.distanceKm ?? 1.2} km)</span>
                  <span>Hospital: <strong className="text-[#202124]">{nearestEmergency.nearestHospital?.name || 'District Trauma Center'}</strong></span>
                </div>
              )}
            </div>



            {/* Select Emergency Type */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-[#5F6368]">
                Select Emergency Distress Category:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EMERGENCY_TYPES.map((em) => {
                  const isSelected = selectedType === em.type;
                  const Icon = em.icon;
                  return (
                    <button
                      key={em.type}
                      type="button"
                      onClick={() => setSelectedType(em.type)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-[4px] border text-left text-[12px] font-medium transition-colors ${
                        isSelected
                          ? 'border-[#D93025] bg-[#FCE8E6] text-[#C5221F]'
                          : 'border-[#DADCE0] bg-[#FFFFFF] text-[#202124] hover:bg-[#F8F9FA]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#D93025]' : 'text-[#5F6368]'}`} />
                      <span className="truncate">{em.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Distress Note */}
            <div className="space-y-1">
              <label htmlFor="sos-notes" className="block text-[12px] font-medium text-[#5F6368]">
                Optional Situation Details:
              </label>
              <input
                id="sos-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 2 passengers, flat tyre on North Sikkim highway..."
                className="w-full h-10 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] placeholder-[#80868B] focus:outline-none focus:border-[#D93025]"
              />
            </div>

            {/* Countdown / Dispatch Action Button */}
            {countdown !== null ? (
              <div className="rounded-[4px] border border-[#FAD2CF] bg-[#FCE8E6] p-4 text-center space-y-2">
                <p className="text-[14px] font-medium text-[#C5221F]">
                  Broadcasting SOS in {countdown} seconds...
                </p>
                <button
                  type="button"
                  onClick={handleCancelCountdown}
                  className="px-4 py-2 rounded-[4px] bg-[#FFFFFF] border border-[#DADCE0] text-[#202124] text-[12px] font-medium hover:bg-[#F8F9FA]"
                >
                  Cancel Trigger
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartCountdown}
                disabled={sosMutation.isPending}
                className="w-full py-3 rounded-[4px] bg-[#D93025] hover:bg-[#C5221F] text-[#FFFFFF] text-[14px] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Confirm & Dispatch Emergency SOS</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
