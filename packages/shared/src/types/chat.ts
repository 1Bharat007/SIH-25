import { SikkimDistrict } from './tourism.js';

export type SupportedLanguage = 'en' | 'hi' | 'ne' | 'dz' | 'lep';

export type MessageRole = 'user' | 'assistant' | 'system';

export type ChatResponseSource =
  | 'claude_llm'
  | 'offline_kb'
  | 'emergency_dispatch'
  | 'system_prompt';

export interface LocationContext {
  latitude?: number;
  longitude?: number;
  district?: SikkimDistrict | string;
  nearestPlaceName?: string;
  nearbyPlaces?: string[];
  activeAlertCorridors?: string[];
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  language: SupportedLanguage;
  source?: ChatResponseSource;
  locationContext?: LocationContext;
  suggestedFollowUps?: string[];
  referencedPlaces?: string[];
  referencedAlerts?: string[];
}

export interface ChatRequestPayload {
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  language?: SupportedLanguage;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  selectedDistrict?: string;
}

export interface ChatResponsePayload {
  reply: string;
  language: SupportedLanguage;
  source: ChatResponseSource;
  suggestedFollowUps: string[];
  relevantPlaces?: string[];
  relevantAlerts?: string[];
  locationContextApplied?: boolean;
}

export interface OfflineFAQItem {
  id: string;
  category:
    | 'permits'
    | 'high_altitude_health'
    | 'monastery_etiquette'
    | 'emergency'
    | 'weather_hazards'
    | 'transport_routes'
    | 'culture_attire';
  keywords: string[];
  question: {
    en: string;
    hi: string;
    ne: string;
  };
  answer: {
    en: string;
    hi: string;
    ne: string;
  };
  emergencyPriority?: boolean;
  relatedCorridor?: string;
}
