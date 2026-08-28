'use client';

import React, { useState } from 'react';
import {
  Radio,
  Plus,
  Trash2,
  Send,
} from 'lucide-react';

import {
  DisasterAlert,
  CreateAlertPayload,
  DisasterType,
  DisasterSeverity,
  SikkimDistrict,
} from '@sikkim-yatra/shared';
import {
  createDisasterAlert,
  updateDisasterAlert,
  deleteDisasterAlert,
} from '../../services/disaster.service';

interface AdminAlertManagerProps {
  alerts?: DisasterAlert[];
  onAlertsChanged?: () => void;
}

const SIKKIM_CORRIDOR_PRESETS = [
  {
    name: 'NH10 29th Mile (Rangpo - Singtam)',
    district: 'Pakyong' as SikkimDistrict,
    type: 'landslide' as DisasterType,
    severity: 'critical' as DisasterSeverity,
    centerLat: 27.205,
    centerLng: 88.528,
    radiusKm: 7.5,
    affectedCorridor: 'NH10 Main Highway (Rangpo - Singtam - Gangtok)',
    recommendedAction:
      'Avoid NH10 corridor. Divert via Pakyong - Rorathang - Melli alternate bypass route.',
    alternateRouteId: 'detour-nh10-pakyong-rorathang',
  },
  {
    name: 'JN Marg 13th Mile (Tsomgo Route)',
    district: 'Gangtok' as SikkimDistrict,
    type: 'road_closure' as DisasterType,
    severity: 'moderate' as DisasterSeverity,
    centerLat: 27.35,
    centerLng: 88.7,
    radiusKm: 6.0,
    affectedCorridor: 'JN Marg (13th Mile - Kyongnosla Alpine Sanctuary)',
    recommendedAction:
      'Scheduled rock netting clearance. Follow traffic marshal signals at 3rd Mile.',
    alternateRouteId: 'detour-jn-road-alternate',
  },
  {
    name: 'Thangu Pass - Gurudongmar Snow Corridor',
    district: 'Mangan' as SikkimDistrict,
    type: 'heavy_snowfall' as DisasterType,
    severity: 'high' as DisasterSeverity,
    centerLat: 27.9,
    centerLng: 88.68,
    radiusKm: 16.0,
    affectedCorridor: 'North Sikkim High Altitude Pass (Thangu - Chopta - Gurudongmar)',
    recommendedAction:
      'Sub-zero black ice. 4WD vehicles with snow chains only before 11:00 AM.',
    alternateRouteId: 'detour-north-lachen-valley-safe',
  },
];

export default function AdminAlertManager({
  alerts = [],
  onAlertsChanged = () => {},
}: AdminAlertManagerProps) {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateAlertPayload>({
    title: '',
    description: '',
    type: 'landslide',
    severity: 'high',
    district: 'Pakyong',
    centerLat: 27.205,
    centerLng: 88.528,
    radiusKm: 5.0,
    affectedCorridor: '',
    recommendedAction: '',
    alternateRouteId: '',
    sourceAuthority: 'Sikkim State Disaster Management Authority (SSDMA)',
    expiresInHours: 24,
  });

  const applyPreset = (preset: (typeof SIKKIM_CORRIDOR_PRESETS)[0]) => {
    setFormData((prev) => ({
      ...prev,
      title: `${preset.type.toUpperCase()}: ${preset.name}`,
      description: `Active mountain hazard advisory broadcasted on ${preset.affectedCorridor}. Exercise caution.`,
      type: preset.type,
      severity: preset.severity,
      district: preset.district,
      centerLat: preset.centerLat,
      centerLng: preset.centerLng,
      radiusKm: preset.radiusKm,
      affectedCorridor: preset.affectedCorridor,
      recommendedAction: preset.recommendedAction,
      alternateRouteId: preset.alternateRouteId,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.affectedCorridor.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Please fill in title and affected corridor' });
      return;
    }

    try {
      setIsSubmitting(true);
      await createDisasterAlert(formData);
      setFeedbackMsg({
        type: 'success',
        text: 'Alert broadcasted successfully in real-time to all connected Sikkim travelers.',
      });
      setIsCreating(false);
      onAlertsChanged();
      // Reset
      setFormData({
        title: '',
        description: '',
        type: 'landslide',
        severity: 'high',
        district: 'Pakyong',
        centerLat: 27.205,
        centerLng: 88.528,
        radiusKm: 5.0,
        affectedCorridor: '',
        recommendedAction: '',
        alternateRouteId: '',
        sourceAuthority: 'Sikkim State Disaster Management Authority (SSDMA)',
        expiresInHours: 24,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setFeedbackMsg({ type: 'error', text: error.message || 'Failed to broadcast alert' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await updateDisasterAlert(id, {
        status: 'resolved',
        recommendedAction: 'Hazard resolved. Road cleared for normal tourist traffic.',
      });
      setFeedbackMsg({ type: 'success', text: 'Alert marked as RESOLVED and broadcast updated.' });
      onAlertsChanged();
    } catch (err: unknown) {
      const error = err as Error;
      setFeedbackMsg({ type: 'error', text: error.message || 'Failed to update alert' });
    }
  };

  const handleDeleteAlert = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert from the broadcast?')) return;
    try {
      await deleteDisasterAlert(id);
      setFeedbackMsg({ type: 'success', text: 'Alert deleted from broadcast.' });
      onAlertsChanged();
    } catch (err: unknown) {
      const error = err as Error;
      setFeedbackMsg({ type: 'error', text: error.message || 'Failed to delete alert' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-[8px] bg-[#FFFFFF] border border-[#DADCE0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#0B3D91]" />
            <h3 className="text-[15px] font-medium text-[#202124]">
              SSDMA / BRO Disaster Broadcast Console
            </h3>
          </div>
          <p className="text-[12px] text-[#5F6368] mt-0.5">
            Publish real-time mountain hazard advisories, danger radius geofencing, and alternate bypass routes.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3.5 py-1.5 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[12px] font-medium transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isCreating ? 'Close Form' : 'Broadcast New Alert'}</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`p-3 rounded-[4px] text-[12px] font-medium flex items-center justify-between border ${
            feedbackMsg.type === 'success'
              ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]'
              : 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-[11px] underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Broadcast Creation Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#DADCE0] pb-3">
            <h4 className="text-[14px] font-medium text-[#202124]">
              Create Emergency Broadcast Advisory
            </h4>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#5F6368]">Quick Presets:</span>
              {SIKKIM_CORRIDOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-2 py-0.5 rounded-[4px] bg-[#F8F9FA] hover:bg-[#E8F0FE] text-[#0B3D91] border border-[#DADCE0] text-[11px] font-medium"
                >
                  {preset.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
            <div>
              <label className="block font-medium text-[#5F6368] mb-1">
                Advisory Headline *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Landslide on NH10 29th Mile"
                className="w-full h-10 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] focus:outline-none focus:border-[#0B3D91]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#5F6368] mb-1">
                Affected Corridor *
              </label>
              <input
                type="text"
                required
                value={formData.affectedCorridor}
                onChange={(e) => setFormData({ ...formData, affectedCorridor: e.target.value })}
                placeholder="e.g. NH10 Rangpo to Singtam"
                className="w-full h-10 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] focus:outline-none focus:border-[#0B3D91]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#5F6368] mb-1">
                Hazard Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DisasterType })}
                className="w-full h-10 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] focus:outline-none focus:border-[#0B3D91]"
              >
                <option value="landslide">Landslide / Rockfall</option>
                <option value="flash_flood">Teesta Flash Flood / GLOF</option>
                <option value="heavy_snowfall">Heavy Snowfall / Blizzard</option>
                <option value="road_closure">Road Closure / Maintenance</option>
                <option value="earthquake">Earthquake Tremor</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#5F6368] mb-1">
                Severity Level
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as DisasterSeverity })}
                className="w-full h-10 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] focus:outline-none focus:border-[#0B3D91]"
              >
                <option value="critical">Critical (Immediate Road Block)</option>
                <option value="high">High (4WD / Snow Chains Only)</option>
                <option value="moderate">Moderate (Expect 1-2 hr Delays)</option>
                <option value="low">Low (Precautionary Advisory)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-[#5F6368] mb-1">
                Recommended Action & Traveler Advisory
              </label>
              <input
                type="text"
                value={formData.recommendedAction}
                onChange={(e) => setFormData({ ...formData, recommendedAction: e.target.value })}
                placeholder="e.g. Take Pakyong - Rorathang bypass route..."
                className="w-full h-10 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] focus:outline-none focus:border-[#0B3D91]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#DADCE0]">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[#5F6368] text-[12px] font-medium hover:bg-[#F8F9FA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[12px] font-medium flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmitting...' : 'Broadcast Alert'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Active Broadcasts Management List */}
      <div className="space-y-2.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-3.5 rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] shadow-xs flex items-start justify-between gap-3 text-[13px]"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.2 rounded-full text-[10px] font-medium border ${
                    alert.severity === 'critical' || alert.severity === 'high'
                      ? 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]'
                      : 'bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]'
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="font-medium text-[#202124]">{alert.title}</span>
                <span className="text-[11px] text-[#5F6368]">({alert.district})</span>
              </div>
              <p className="text-[12px] text-[#5F6368]">{alert.affectedCorridor}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {alert.status === 'active' && (
                <button
                  onClick={() => handleResolveAlert(alert.id)}
                  className="px-2.5 py-1 rounded-[4px] border border-[#CEEAD6] bg-[#E6F4EA] text-[#137333] hover:bg-[#D2EBD9] text-[11px] font-medium"
                >
                  Mark Resolved
                </button>
              )}
              <button
                onClick={() => handleDeleteAlert(alert.id)}
                className="p-1 rounded-[4px] text-[#5F6368] hover:text-[#D93025] hover:bg-[#FCE8E6]"
                title="Delete alert"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
