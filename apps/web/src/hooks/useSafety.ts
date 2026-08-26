'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  SOSDispatchPayload,
  SOSDispatchResult,
  TrustedContact,
  SafetyRoutesFilterParams,
} from '@sikkim-yatra/shared';
import { safetyService } from '../services/safety.service';

const TRUSTED_CONTACTS_KEY = 'sikkim_yatra_trusted_contacts';

export const DEFAULT_SAMPLE_CONTACTS: TrustedContact[] = [
  {
    id: 'contact-1',
    name: 'Tashi Namgyal (Brother / Sikkim Guide)',
    relationship: 'Family',
    phone: '+91 98320 11223',
    email: 'tashi.guide@sikkim.org',
    isPrimary: true,
    notifyViaSms: true,
    notifyViaWhatsapp: true,
  },
  {
    id: 'contact-2',
    name: 'Priya Sharma (Emergency Contact)',
    relationship: 'Spouse / Parent',
    phone: '+91 98765 43210',
    email: 'priya.sharma@example.com',
    isPrimary: false,
    notifyViaSms: true,
    notifyViaWhatsapp: true,
  },
];

// Hook for managing Trusted Personal Contacts with LocalStorage Persistence
export function useTrustedContacts() {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TRUSTED_CONTACTS_KEY);
      if (stored) {
        setContacts(JSON.parse(stored));
      } else {
        setContacts(DEFAULT_SAMPLE_CONTACTS);
        localStorage.setItem(TRUSTED_CONTACTS_KEY, JSON.stringify(DEFAULT_SAMPLE_CONTACTS));
      }
    } catch {
      setContacts(DEFAULT_SAMPLE_CONTACTS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveContacts = useCallback((newContacts: TrustedContact[]) => {
    setContacts(newContacts);
    try {
      localStorage.setItem(TRUSTED_CONTACTS_KEY, JSON.stringify(newContacts));
    } catch {
      // Ignore local storage write error
    }
  }, []);

  const addContact = useCallback(
    (contact: Omit<TrustedContact, 'id'>) => {
      const newContact: TrustedContact = {
        ...contact,
        id: `contact_${Date.now().toString(36)}`,
      };
      const updated = [...contacts, newContact];
      saveContacts(updated);
      return newContact;
    },
    [contacts, saveContacts]
  );

  const updateContact = useCallback(
    (id: string, updates: Partial<TrustedContact>) => {
      const updated = contacts.map(c => (c.id === id ? { ...c, ...updates } : c));
      saveContacts(updated);
    },
    [contacts, saveContacts]
  );

  const deleteContact = useCallback(
    (id: string) => {
      const updated = contacts.filter(c => c.id !== id);
      saveContacts(updated);
    },
    [contacts, saveContacts]
  );

  const setPrimaryContact = useCallback(
    (id: string) => {
      const updated = contacts.map(c => ({
        ...c,
        isPrimary: c.id === id,
      }));
      saveContacts(updated);
    },
    [contacts, saveContacts]
  );

  return {
    contacts,
    isLoaded,
    addContact,
    updateContact,
    deleteContact,
    setPrimaryContact,
  };
}

// Hook for live GPS and battery telemetry acquisition
export function useUserGeolocation() {
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
    altitudeMeters?: number;
    accuracyMeters?: number;
  }>({
    latitude: 27.3314, // Default to Gangtok
    longitude: 88.6138,
    altitudeMeters: 1650,
    accuracyMeters: 15,
  });

  const [batteryLevel, setBatteryLevel] = useState<number | undefined>(undefined);
  const [gpsStatus, setGpsStatus] = useState<
    'idle' | 'acquiring' | 'ready' | 'simulated' | 'error'
  >('idle');
  const [gpsError, setGpsError] = useState<string | null>(null);

  const refreshLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus('simulated');
      return;
    }

    setGpsStatus('acquiring');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoordinates({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          altitudeMeters: pos.coords.altitude ? Math.round(pos.coords.altitude) : undefined,
          accuracyMeters: Math.round(pos.coords.accuracy),
        });
        setGpsStatus('ready');
        setGpsError(null);
      },
      () => {
        setGpsStatus('simulated');
        setGpsError('GPS simulated in Sikkim Gangtok Center');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );

    // Battery check if supported
    if ('getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ level: number }> })
        .getBattery()
        .then(battery => {
          setBatteryLevel(Math.round(battery.level * 100));
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  return {
    coordinates,
    batteryLevel,
    gpsStatus,
    gpsError,
    refreshLocation,
  };
}

// React Query Hook for nearest police and hospital lookup
export function useNearestEmergencyQuery(lat: number, lng: number) {
  return useQuery({
    queryKey: ['nearest-emergency', lat, lng],
    queryFn: () => safetyService.getNearestEmergency(lat, lng),
    staleTime: 1000 * 60 * 2, // 2 mins
  });
}

// React Query Hook for data-driven safety routes
export function useSafetyRoutesQuery(params: SafetyRoutesFilterParams = {}) {
  return useQuery({
    queryKey: ['safety-routes', params],
    queryFn: () => safetyService.getSafetyRoutes(params),
    staleTime: 1000 * 60 * 5,
  });
}

// React Query Mutation Hook for dispatching SOS
export function useSOSMutation() {
  return useMutation<SOSDispatchResult, Error, SOSDispatchPayload>({
    mutationFn: payload => safetyService.dispatchSOS(payload),
  });
}
