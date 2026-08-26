'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DisasterAlert, WSAlertMessage } from '@sikkim-yatra/shared';
import { fetchDisasterAlerts } from '../services/disaster.service';

export type WSConnectionStatus = 'connected' | 'connecting' | 'polling_fallback' | 'disconnected';

export function useRealtimeAlerts() {
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<WSConnectionStatus>('connecting');
  const [latestMessage, setLatestMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initial and refresh loader via REST
  const refreshAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchDisasterAlerts();
      setAlerts(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.warn('[Alerts] Failed to fetch REST alerts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Play audio chime for urgent alerts if user interacted
  const triggerUrgentAlertSound = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }, []);

  // WebSocket Connection Logic
  const connectWebSocket = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Determine WS URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    let wsUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (!wsUrl) {
      const urlObj = new URL(apiUrl);
      const protocol = urlObj.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${protocol}//${urlObj.host}/ws/alerts`;
    }

    try {
      setConnectionStatus('connecting');
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('⚡ [WebSocket Client] Connected to Sikkim Yatra Disaster Alert Stream');
        setConnectionStatus('connected');

        // Setup Ping Heartbeat every 25 seconds
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'PING' }));
          }
        }, 25000);

        // Clear polling fallback if active
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg: WSAlertMessage = JSON.parse(event.data);

          if (msg.type === 'INITIAL_STATE' && msg.payload.alerts) {
            setAlerts(msg.payload.alerts);
            setLastUpdated(new Date());
            setIsLoading(false);
          } else if (msg.type === 'ALERT_CREATED' && msg.payload.alert) {
            const newAlert = msg.payload.alert;
            setAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)]);
            setLatestMessage(msg.payload.message || `🚨 New Hazard Broadcast: ${newAlert.title}`);
            setLastUpdated(new Date());

            if (newAlert.severity === 'critical' || newAlert.severity === 'high') {
              triggerUrgentAlertSound();
            }
          } else if (msg.type === 'ALERT_UPDATED' && msg.payload.alert) {
            const updated = msg.payload.alert;
            setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
            setLatestMessage(msg.payload.message || `⚠️ Hazard Updated: ${updated.title}`);
            setLastUpdated(new Date());
          } else if (msg.type === 'ALERT_RESOLVED' && msg.payload.alert) {
            const resolved = msg.payload.alert;
            setAlerts((prev) => prev.map((a) => (a.id === resolved.id ? resolved : a)));
            setLatestMessage(msg.payload.message || `✅ Hazard Resolved: ${resolved.title}`);
            setLastUpdated(new Date());
          } else if (msg.type === 'ALERT_DELETED' && msg.payload.alertId) {
            const id = msg.payload.alertId;
            setAlerts((prev) => prev.filter((a) => a.id !== id));
            setLastUpdated(new Date());
          }
        } catch (err) {
          console.error('[WebSocket Client] Failed to parse message:', err);
        }
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

        // Initiate Polling Fallback immediately
        if (!pollingIntervalRef.current) {
          setConnectionStatus('polling_fallback');
          pollingIntervalRef.current = setInterval(() => {
            refreshAlerts();
          }, 10000);
        }

        // Auto-reconnect WS in 5 seconds
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };

      ws.onerror = (err) => {
        console.warn('[WebSocket Client] Connection error:', err);
        ws.close();
      };
    } catch (err) {
      console.warn('[WebSocket Client] Error initializing connection:', err);
      setConnectionStatus('polling_fallback');
      if (!pollingIntervalRef.current) {
        pollingIntervalRef.current = setInterval(() => {
          refreshAlerts();
        }, 10000);
      }
    }
  }, [refreshAlerts, triggerUrgentAlertSound]);

  useEffect(() => {
    refreshAlerts();
    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [connectWebSocket, refreshAlerts]);

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical' || a.severity === 'high');

  return {
    alerts,
    activeAlerts,
    criticalAlerts,
    isLoading,
    connectionStatus,
    latestMessage,
    lastUpdated,
    refreshAlerts,
    dismissLatestMessage: () => setLatestMessage(null),
  };
}
