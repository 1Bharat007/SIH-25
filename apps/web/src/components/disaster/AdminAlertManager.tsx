'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Radio,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
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
  alerts: DisasterAlert[];
  onAlertsChanged: () => void;
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
  {
    name: 'Teesta River Basin (Singtam - Dikchu)',
    district: 'Gangtok' as SikkimDistrict,
    type: 'flash_flood' as DisasterType,
    severity: 'high' as DisasterSeverity,
    centerLat: 27.24,
    centerLng: 88.5,
    radiusKm: 8.0,
    affectedCorridor: 'Teesta Riverbank Lowlands & Dikchu-Singtam Riparian Strip',
    recommendedAction:
      'Stay 150m away from Teesta river banks and bridges. Evacuate immediately if muddy silt surges.',
    alternateRouteId: 'detour-nh10-pakyong-rorathang',
  },
];

export default function AdminAlertManager({
  alerts,
  onAlertsChanged,
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
        text: '🚨 Alert broadcasted successfully in real-time to all connected Sikkim travelers!',
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
      setFeedbackMsg({ type: 'success', text: '✅ Alert marked as RESOLVED and broadcast updated.' });
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white">SSDMA / BRO Disaster Broadcast Console</h3>
          </div>
          <p className="text-xs text-white/70 mt-1">
            Admin console for publishing real-time hazard advisories, danger radius geofencing, and alternate bypass routes.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 border border-red-400/40"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Close Broadcast Form' : 'Broadcast New Hazard Alert'}</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/80 border-red-500/50 text-red-200'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-white/60 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Broadcast Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-6 rounded-2xl bg-slate-900/90 border border-red-500/40 shadow-2xl backdrop-blur-xl space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Compose Emergency Broadcast Advisory
            </h4>
            <span className="text-[11px] text-red-400 font-semibold bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
              ⚡ Real-time WebSocket Push
            </span>
          </div>

          {/* Presets Strip */}
          <div>
            <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1.5">
              Quick Corridor Presets:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {SIKKIM_CORRIDOR_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="p-2 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-left transition-all hover:border-red-400"
                >
                  <div className="font-bold text-xs text-white truncate">{preset.name}</div>
                  <div className="text-[10px] text-white/50">{preset.district} • {preset.type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-white/70 block mb-1">
                Alert Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Severe Landslide on NH10 near 29th Mile"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs placeholder-white/40 focus:outline-none focus:border-red-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/70 block mb-1">
                Affected Mountain Corridor *
              </label>
              <input
                type="text"
                required
                value={formData.affectedCorridor}
                onChange={(e) => setFormData({ ...formData, affectedCorridor: e.target.value })}
                placeholder="e.g. NH10 Main Highway (Rangpo - Singtam)"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs placeholder-white/40 focus:outline-none focus:border-red-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-white/70 block mb-1">Hazard Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DisasterType })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/20 text-white text-xs focus:outline-none focus:border-red-400"
              >
                <option value="landslide">Landslide</option>
                <option value="flash_flood">Flash Flood / GLOF</option>
                <option value="earthquake">Earthquake</option>
                <option value="road_closure">Road Closure</option>
                <option value="heavy_snowfall">Heavy Snowfall</option>
                <option value="weather_warning">Weather Warning</option>
                <option value="general_advisory">General Advisory</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/70 block mb-1">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value as DisasterSeverity })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/20 text-white text-xs focus:outline-none focus:border-red-400"
              >
                <option value="critical">Critical (Red Alert)</option>
                <option value="high">High (Orange Warning)</option>
                <option value="moderate">Moderate (Yellow Advisory)</option>
                <option value="info">Info (Advisory)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/70 block mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value as SikkimDistrict })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/20 text-white text-xs focus:outline-none focus:border-red-400"
              >
                <option value="Gangtok">Gangtok</option>
                <option value="Mangan">Mangan (North)</option>
                <option value="Namchi">Namchi (South)</option>
                <option value="Gyalshing">Gyalshing (West)</option>
                <option value="Pakyong">Pakyong</option>
                <option value="Soreng">Soreng</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/70 block mb-1">
                Radius: <strong className="text-amber-400">{formData.radiusKm} km</strong>
              </label>
              <input
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={formData.radiusKm}
                onChange={(e) => setFormData({ ...formData, radiusKm: Number(e.target.value) })}
                className="w-full mt-2 accent-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-white/70 block mb-1">
                Latitude & Longitude (GPS Center)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.0001"
                  value={formData.centerLat}
                  onChange={(e) => setFormData({ ...formData, centerLat: Number(e.target.value) })}
                  className="w-1/2 px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-red-400"
                  placeholder="Lat"
                />
                <input
                  type="number"
                  step="0.0001"
                  value={formData.centerLng}
                  onChange={(e) => setFormData({ ...formData, centerLng: Number(e.target.value) })}
                  className="w-1/2 px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-red-400"
                  placeholder="Lng"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/70 block mb-1">
                Linked Alternate Detour Route ID (optional)
              </label>
              <input
                type="text"
                value={formData.alternateRouteId || ''}
                onChange={(e) => setFormData({ ...formData, alternateRouteId: e.target.value })}
                placeholder="e.g. detour-nh10-pakyong-rorathang"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-red-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-white/70 block mb-1">
              Detailed Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide information on blockage extent, machinery on site, or weather forecast..."
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-red-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-white/70 block mb-1">
              Recommended Traveler Safety Action
            </label>
            <input
              type="text"
              value={formData.recommendedAction}
              onChange={(e) => setFormData({ ...formData, recommendedAction: e.target.value })}
              placeholder="e.g. Divert via Pakyong - Rorathang bypass route immediately."
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-red-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Broadcasting...' : 'Broadcast to All Active Users'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Active Broadcasts Table / Cards */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            Live Broadcast Feed ({alerts.length} Total Hazards)
          </h4>
          <button
            onClick={() => onAlertsChanged()}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
            title="Refresh feed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                alert.status === 'active'
                  ? 'bg-black/30 border-white/10 text-white'
                  : 'bg-black/15 border-white/5 text-white/60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alert.status === 'active'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {alert.status.toUpperCase()}
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-white/90">
                      {alert.severity}
                    </span>

                    <span className="text-xs text-white/50">{alert.district} District</span>
                    <span className="text-xs text-white/40">• Radius: {alert.radiusKm} km</span>
                  </div>

                  <h5 className="font-bold text-sm text-white">{alert.title}</h5>
                  <p className="text-xs text-white/70 leading-relaxed">{alert.affectedCorridor}</p>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {alert.status === 'active' && (
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1 border border-emerald-400/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
