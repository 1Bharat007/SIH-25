import {
  ApiResponse,
  ChatRequestPayload,
  ChatResponsePayload,
  OfflineFAQItem,
  SupportedLanguage,
} from '@sikkim-yatra/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const OFFLINE_KB_STORAGE_KEY = 'sikkim_offline_faqs_v1';

export async function sendChatMessage(
  payload: ChatRequestPayload
): Promise<ChatResponsePayload> {
  try {
    const res = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned status: ${res.statusText}`);
    }

    const json: ApiResponse<ChatResponsePayload> = await res.json();
    if (!json.data) {
      throw new Error(json.message || 'No response data from chat API');
    }

    return json.data;
  } catch (error) {
    console.warn('[ChatService] Online fetch failed, utilizing local offline cache:', error);
    // Offline local fallback search
    return queryLocalOfflineKB(payload.message, payload.language || 'en');
  }
}

export async function syncOfflineKB(): Promise<OfflineFAQItem[]> {
  try {
    const res = await fetch(`${API_BASE}/chat/offline-kb`);
    if (res.ok) {
      const json: ApiResponse<OfflineFAQItem[]> = await res.json();
      if (json.data && Array.isArray(json.data)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(OFFLINE_KB_STORAGE_KEY, JSON.stringify(json.data));
        }
        return json.data;
      }
    }
  } catch {
    // Silent fail if offline
  }

  // Load from localStorage if present
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(OFFLINE_KB_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore JSON parse error
      }
    }
  }

  return [];
}

export function queryLocalOfflineKB(
  query: string,
  language: SupportedLanguage = 'en'
): ChatResponsePayload {
  let cachedFaqs: OfflineFAQItem[] = [];

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(OFFLINE_KB_STORAGE_KEY);
    if (cached) {
      try {
        cachedFaqs = JSON.parse(cached);
      } catch {
        cachedFaqs = [];
      }
    }
  }

  const q = query.toLowerCase().trim();
  const langKey = language === 'hi' ? 'hi' : language === 'ne' ? 'ne' : 'en';

  let bestMatch: OfflineFAQItem | null = null;
  let highestScore = 0;

  for (const item of cachedFaqs) {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw.toLowerCase())) score += 3;
    }
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    const questionText = (item.question[langKey] || item.question.en).toLowerCase();
    for (const w of words) {
      if (questionText.includes(w)) score += 2;
    }

    if (score > highestScore && score >= 3) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch) {
    const reply = bestMatch.answer[langKey] || bestMatch.answer.en;
    return {
      reply,
      language,
      source: 'offline_kb',
      suggestedFollowUps: [
        language === 'hi' ? 'आपातकालीन हेल्पलाइन नंबर' : language === 'ne' ? 'आपतकालीन सम्पर्क' : 'Emergency Helplines',
        language === 'hi' ? 'सुरक्षित वैकल्पिक मार्ग' : language === 'ne' ? 'सुरक्षित वैकल्पिक बाटो' : 'Safe Alternate Routes',
      ],
      locationContextApplied: false,
    };
  }

  // Default Offline Generic Notice
  if (language === 'hi') {
    return {
      reply: `आप वर्तमान में ऑफलाइन हैं। आपके प्रश्न "${query}" के लिए सामान्य मार्गदर्शन:\n\nसिक्किम के संरक्षित क्षेत्रों (गुरुडोंगमार, नाथू ला) के लिए अग्रिम परमिट आवश्यक है। आपातकालीन स्थिति में 1070 (आपदा प्रबंधन) या 112 (पुलिस) पर कॉल करें। ऑनलाइन होने पर अधिक विस्तृत जानकारी उपलब्ध होगी।`,
      language: 'hi',
      source: 'offline_kb',
      suggestedFollowUps: ['आपातकालीन हेल्पलाइन नंबर', 'ऊंचाई की बीमारी (AMS) से बचाव'],
    };
  }

  if (language === 'ne') {
    return {
      reply: `तपाईं हाल अफलाइन हुनुहुन्छ। तपाईंको प्रश्न "${query}" को लागि सामान्य जानकारी:\n\nसिक्किमका उच्च हिमाली क्षेत्रहरू (गुरुडोङमार, नाथु ला) को लागि अग्रिम परमिट आवश्यक छ। आपतकालीन सहयोगका लागि १०७० वा ११२ मा सम्पर्क गर्नुहोस्। अनलाइन भएपछि विस्तृत जानकारी उपलब्ध हुनेछ।`,
      language: 'ne',
      source: 'offline_kb',
      suggestedFollowUps: ['२४ सै घण्टा आपतकालीन नम्बर', 'उचाइमा लेक लाग्ने समस्याबाट बच्ने उपाय'],
    };
  }

  return {
    reply: `You are currently offline. General guidance regarding "${query}":\n\nProtected Area Permits (PAP) are required for North Sikkim and Nathu La Pass. For immediate emergencies, dial SSDMA at 1070 or Police at 112. Full live context will refresh when connectivity is restored.`,
    language: 'en',
    source: 'offline_kb',
    suggestedFollowUps: ['24x7 State Helplines in Sikkim', 'How to prevent altitude sickness (AMS)?'],
  };
}
