'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ChatMessage,
  SupportedLanguage,
  ChatResponsePayload,
} from '@sikkim-yatra/shared';
import { sendChatMessage, syncOfflineKB } from '../services/chat.service';

const LANG_STORAGE_KEY = 'sikkim_user_chat_lang';
const LANG_CHOSEN_FLAG = 'sikkim_chat_lang_prompted';
const CHAT_HISTORY_STORAGE_KEY = 'sikkim_chat_history_v1';

export function useAIChatCompanion() {
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>('en');
  const [hasPromptedLanguage, setHasPromptedLanguage] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Initialize Language, History & Offline KB sync on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Sync Offline Knowledge Base
    syncOfflineKB();

    // 2. Load stored language preference or show prompt
    const storedLang = localStorage.getItem(LANG_STORAGE_KEY) as SupportedLanguage | null;
    const prompted = localStorage.getItem(LANG_CHOSEN_FLAG);

    if (storedLang) {
      setPreferredLanguage(storedLang);
    }
    if (!prompted && !storedLang) {
      setHasPromptedLanguage(false);
    }

    // 3. Load or initialize message history
    const storedHistory = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch {
        // start clean
      }
    }

    // Initialize with welcome message
    const initialWelcome: ChatMessage = {
      id: 'welcome-msg',
      role: 'assistant',
      content: getWelcomeMessage(storedLang || 'en'),
      timestamp: new Date().toISOString(),
      language: storedLang || 'en',
      source: 'system_prompt',
      suggestedFollowUps: getInitialSuggestions(storedLang || 'en'),
    };
    setMessages([initialWelcome]);

    // 4. Request GPS Coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          // Default fallback near Gangtok
          setUserLocation({ latitude: 27.3389, longitude: 88.6065 });
        },
        { timeout: 8000 }
      );
    }
  }, []);

  // Save language selection
  const selectLanguage = useCallback((lang: SupportedLanguage) => {
    setPreferredLanguage(lang);
    setHasPromptedLanguage(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
      localStorage.setItem(LANG_CHOSEN_FLAG, 'true');
    }

    // Append system acknowledgment in newly chosen language
    const langSwitchNotice: ChatMessage = {
      id: `lang-switch-${Date.now()}`,
      role: 'assistant',
      content: getLanguageSwitchAck(lang),
      timestamp: new Date().toISOString(),
      language: lang,
      source: 'system_prompt',
      suggestedFollowUps: getInitialSuggestions(lang),
    };
    setMessages((prev) => [...prev, langSwitchNotice]);
  }, []);

  // Send Message
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date().toISOString(),
        language: preferredLanguage,
      };

      setMessages((prev) => {
        const next = [...prev, userMsg];
        if (typeof window !== 'undefined') {
          localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(next.slice(-20)));
        }
        return next;
      });

      setIsLoading(true);

      try {
        // Build recent conversation history
        const conversationHistory = messages.slice(-4).map((m) => ({
          role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.content,
        }));

        const response: ChatResponsePayload = await sendChatMessage({
          message: text.trim(),
          conversationHistory,
          language: preferredLanguage,
          userLocation: userLocation || undefined,
        });

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: response.reply,
          timestamp: new Date().toISOString(),
          language: response.language,
          source: response.source,
          suggestedFollowUps: response.suggestedFollowUps,
          referencedPlaces: response.relevantPlaces,
          referencedAlerts: response.relevantAlerts,
        };

        setMessages((prev) => {
          const next = [...prev, botMsg];
          if (typeof window !== 'undefined') {
            localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(next.slice(-20)));
          }
          return next;
        });
      } catch (err) {
        console.warn('[AIChatCompanion] Failed to send message:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, preferredLanguage, messages, userLocation]
  );

  const clearHistory = useCallback(() => {
    const freshWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: getWelcomeMessage(preferredLanguage),
      timestamp: new Date().toISOString(),
      language: preferredLanguage,
      source: 'system_prompt',
      suggestedFollowUps: getInitialSuggestions(preferredLanguage),
    };
    setMessages([freshWelcome]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CHAT_HISTORY_STORAGE_KEY);
    }
  }, [preferredLanguage]);

  return {
    messages,
    isLoading,
    preferredLanguage,
    selectLanguage,
    hasPromptedLanguage,
    isWidgetOpen,
    setIsWidgetOpen,
    sendMessage,
    clearHistory,
    userLocation,
  };
}

function getWelcomeMessage(lang: SupportedLanguage): string {
  if (lang === 'hi') {
    return 'नमस्ते! मैं सिक्किम यात्रा का एआई ट्रैवल साथी हूँ। मैं आपको सिक्किम के पर्यटन स्थलों, संरक्षित क्षेत्र परमिट (PAP), बौद्ध मठों के इतिहास, और आपातकालीन सुरक्षा सलाह में सहायता प्रदान कर सकता हूँ। आज आप क्या जानना चाहते हैं?';
  }
  if (lang === 'ne') {
    return 'नमस्ते! म सिक्किम यात्राको एआई ट्राभल कम्प्यानियन हुँ। म तपाईंलाई सिक्किमका पर्यटकीय स्थलहरू, परमिट नियम, गुम्बाको इतिहास, र आपतकालीन सुरक्षा मार्गदर्शनमा सहयोग गर्न सक्छु। आज म तपाईंलाई के मद्दत गर्न सक्छु?';
  }
  return 'Greetings! I am your Sikkim Yatra AI Travel Companion. I can assist you with mountain route logistics, Protected Area Permits (PAP), monastic heritage, weather hazards, and 24x7 emergency helplines. How can I help you today?';
}

function getLanguageSwitchAck(lang: SupportedLanguage): string {
  if (lang === 'hi') {
    return 'भाषा को हिन्दी (Hindi) में सेट कर दिया गया है। मैं अब आपके सभी प्रश्नों का उत्तर हिन्दी में दूंगा।';
  }
  if (lang === 'ne') {
    return 'भाषा नेपाली (Nepali) मा परिवर्तन गरिएको छ। म अब तपाईंका सबै प्रश्नहरूको उत्तर नेपालीमा दिनेछु।';
  }
  return 'Language set to English. All subsequent answers will be provided in English.';
}

function getInitialSuggestions(lang: SupportedLanguage): string[] {
  if (lang === 'hi') {
    return [
      'गुरुडोंगमार झील के लिए परमिट कैसे प्राप्त करें?',
      'रुमटेक मठ के परिक्रमा नियम क्या हैं?',
      'सिक्किम के आपातकालीन हेल्पलाइन नंबर',
    ];
  }
  if (lang === 'ne') {
    return [
      'गुरुडोङमार ताल जान परमिट नियम के छ?',
      'रुमटेक गुम्बाको इतिहास र नियमहरू',
      'सिक्किमका २४ सै घण्टा आपतकालीन नम्बरहरू',
    ];
  }
  return [
    'Do I need a permit for Gurudongmar Lake?',
    'What are the essential monastery etiquette rules?',
    'What are the 24x7 emergency helpline numbers in Sikkim?',
  ];
}
