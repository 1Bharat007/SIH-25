import { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import {
  ApiResponse,
  ChatRequestPayload,
  ChatResponsePayload,
  OfflineFAQItem,
  SupportedLanguage,
} from '@sikkim-yatra/shared';
import { ENV } from '../config/env.js';
import { SIKKIM_OFFLINE_FAQS, searchOfflineKB } from '../data/chatbot-kb.js';
import { SIKKIM_PLACES_DATA } from '../data/sikkim-data.js';
import { DISASTER_ALERTS_STORE } from '../data/disaster-data.js';
import { calculateDistanceKm } from '../utils/geo.js';

let anthropicClient: Anthropic | null = null;
if (ENV.ANTHROPIC_API_KEY) {
  try {
    anthropicClient = new Anthropic({ apiKey: ENV.ANTHROPIC_API_KEY });
  } catch (err) {
    console.warn('[ChatController] Could not initialize Anthropic client:', err);
  }
}

export async function postChatMessage(
  req: Request<unknown, unknown, ChatRequestPayload>,
  res: Response<ApiResponse<ChatResponsePayload>>
): Promise<void> {
  const {
    message,
    conversationHistory = [],
    language = 'en',
    userLocation,
    selectedDistrict,
  } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    res.status(400).json({
      success: false,
      message: 'Message content is required',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // 1. Gather Grounded Local Context (Nearby Places, Active Road Hazards, Helplines)
  let nearestPlaceName: string | undefined;
  const nearbyPlaces: string[] = [];
  const activeAlerts: string[] = [];

  // Find active hazard alerts in Sikkim
  const activeHazards = DISASTER_ALERTS_STORE.filter((a) => a.status === 'active');
  for (const h of activeHazards) {
    activeAlerts.push(`${h.title} (${h.affectedCorridor}, Severity: ${h.severity})`);
  }


  // Find nearby places if coordinates are supplied
  if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
    const placesWithDist = SIKKIM_PLACES_DATA.map((p) => ({
      place: p,
      distanceKm: calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        p.latitude,
        p.longitude
      ),
    })).sort((a, b) => a.distanceKm - b.distanceKm);

    if (placesWithDist[0]) {
      nearestPlaceName = `${placesWithDist[0].place.name} (${placesWithDist[0].distanceKm.toFixed(1)} km away)`;
    }
    for (const item of placesWithDist.slice(0, 3)) {
      nearbyPlaces.push(`${item.place.name} in ${item.place.district} (${item.distanceKm.toFixed(1)} km)`);
    }
  }

  const languagePromptDirective =
    language === 'hi'
      ? 'Respond fluently in Hindi (हिन्दी) script. Use formal, respectful phrasing.'
      : language === 'ne'
      ? 'Respond fluently in Nepali (नेपाली) script. Use polite, natural Sikkimese Nepali phrasing.'
      : 'Respond in clear, professional English.';

  // 2. Try Calling Anthropic Claude API if Key is present
  if (anthropicClient && ENV.ANTHROPIC_API_KEY) {
    try {
      const systemPrompt = `You are "Sikkim Yatra AI", a dedicated, intelligent travel companion for visitors exploring the Himalayan state of Sikkim, India.
Your scope:
1. Provide accurate Sikkim travel logistics, road conditions, protected area permits (PAP/RAP), high-altitude health (AMS) precautions, and monastic culture (Karma Kagyu, Nyingma traditions).
2. Ground your advice in the traveler's current context:
   - Nearest known location: ${nearestPlaceName || selectedDistrict || 'General Sikkim Corridor'}
   - Nearby places: ${nearbyPlaces.length > 0 ? nearbyPlaces.join(', ') : 'Gangtok, Rumtek, Pelling, Lachen'}
   - Active road hazard alerts: ${activeAlerts.length > 0 ? activeAlerts.join(' | ') : 'No critical road closures currently active'}
   - 24x7 Helplines: SSDMA 1070 | Tourist Helpline 1364 | Police/Emergency 112 | Ambulance 108
3. Language instruction: ${languagePromptDirective}
4. Style guidelines: Professional, warm, highly informative, concise (2-4 paragraphs max). Do not use emojis in your response.`;

      // Build message array for Claude
      const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

      for (const h of conversationHistory.slice(-4)) {
        if (h.role === 'user' || h.role === 'assistant') {
          messages.push({ role: h.role, content: h.content });
        }
      }
      messages.push({ role: 'user', content: message });

      const claudeResponse = await anthropicClient.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.3,
        system: systemPrompt,
        messages,
      });

      const responseText =
        claudeResponse.content[0]?.type === 'text'
          ? claudeResponse.content[0].text
          : 'Thank you for exploring Sikkim. How else may I assist your journey?';

      const followUps = generateFollowUpSuggestions(message, language);

      res.status(200).json({
        success: true,
        message: 'Chat response generated successfully from Claude LLM',
        data: {
          reply: responseText,
          language,
          source: 'claude_llm',
          suggestedFollowUps: followUps,
          relevantPlaces: nearbyPlaces,
          relevantAlerts: activeAlerts,
          locationContextApplied: !!userLocation,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    } catch (llmError) {
      console.warn('[ChatController] Anthropic LLM error, engaging grounded offline fallback:', llmError);
    }
  }

  // 3. Grounded Fallback Engine (Offline Knowledge Retrieval + Dynamic Context)
  const kbMatch = searchOfflineKB(message, language);

  let replyText = '';
  const langKey = language === 'hi' ? 'hi' : language === 'ne' ? 'ne' : 'en';

  if (kbMatch) {
    replyText = kbMatch.item.answer[langKey];
  } else {
    // Dynamic synthesized grounded response
    if (language === 'hi') {
      replyText = `सिक्किम यात्रा में आपका स्वागत है। आपके प्रश्न "${message}" के लिए महत्वपूर्ण जानकारी:\n\nसिक्किम में यात्रा करते समय अपने निकटतम गंतव्य (${nearestPlaceName || 'गंगटोक क्षेत्र'}) के मौसम और मार्ग की स्थिति का ध्यान रखें। संरक्षित क्षेत्रों (गुरुडोंगमार, नाथू ला) के लिए वैध परमिट आवश्यक है।\n\nकिसी भी सहायता के लिए राज्य आपदा प्रबंधन हेल्पलाइन 1070 या पर्यटक हेल्पलाइन 1364 पर संपर्क करें।`;
    } else if (language === 'ne') {
      replyText = `सिक्किम यात्रामा स्वागत छ। तपाईंको प्रश्न "${message}" को सम्बन्धमा महत्वपूर्ण जानकारी:\n\nसिक्किम भ्रमण गर्दा आफ्नो नजिकको स्थान (${nearestPlaceName || 'गान्तोक क्षेत्र'}) को बाटो र मौसमको अवस्था बुझेर मात्र यात्रा गर्नुहोस्। संरक्षित क्षेत्रहरू (गुरुडोङमार, नाथु ला) को लागि अग्रिम परमिट आवश्यक पर्दछ।\n\nकुनै पनि आपतकालीन सहयोगका लागि हेल्पलाइन १०७० वा पर्यटक सहायता १३६४ मा सम्पर्क गर्नुहोस्।`;
    } else {
      replyText = `Welcome to Sikkim Yatra. Regarding your query about "${message}":\n\nWhen exploring Sikkim near ${nearestPlaceName || 'Gangtok and surrounding mountain corridors'}, please stay mindful of local road advisories. Protected Area Permits (PAP) are required for high-altitude destinations such as Gurudongmar Lake and Nathu La Pass.\n\nFor 24x7 emergency assistance, contact SSDMA at 1070 or Tourist Assistance at 1364.`;
    }
  }

  const followUps = generateFollowUpSuggestions(message, language);

  res.status(200).json({
    success: true,
    message: 'Chat response generated from grounded Sikkim knowledge engine',
    data: {
      reply: replyText,
      language,
      source: 'offline_kb',
      suggestedFollowUps: followUps,
      relevantPlaces: nearbyPlaces,
      relevantAlerts: activeAlerts,
      locationContextApplied: !!userLocation,
    },
    timestamp: new Date().toISOString(),
  });
}

export async function getOfflineKnowledgeBase(
  _req: Request,
  res: Response<ApiResponse<OfflineFAQItem[]>>
): Promise<void> {
  res.status(200).json({
    success: true,
    message: `Retrieved ${SIKKIM_OFFLINE_FAQS.length} offline FAQ items across English, Hindi, and Nepali`,
    data: SIKKIM_OFFLINE_FAQS,
    timestamp: new Date().toISOString(),
  });
}

function generateFollowUpSuggestions(query: string, language: SupportedLanguage): string[] {
  const q = query.toLowerCase();

  if (language === 'hi') {
    if (q.includes('परमिट') || q.includes('permit')) {
      return ['नाथू ला दर्रे का परमिट कैसे लें?', 'गुरुडोंगमार झील के नियम क्या हैं?', 'आपातकालीन हेल्पलाइन नंबर'];
    }
    if (q.includes('मठ') || q.includes('monastery')) {
      return ['रुमटेक मठ की परिक्रमा के नियम', 'पेमायंगत्से का इतिहास', 'पारंपरिक भूटिया पोशाक'];
    }
    return ['निकटतम अस्पताल और पुलिस चौकी', 'सिक्किम के प्रसिद्ध स्थानीय व्यंजन', 'ऊंचाई की बीमारी (AMS) से बचाव'];
  }

  if (language === 'ne') {
    if (q.includes('परमिट') || q.includes('permit')) {
      return ['नाथु ला को परमिट कसरी लिने?', 'गुरुडोङमार ताल जाने नियमहरू', '२४ सै घण्टा आपतकालीन नम्बर'];
    }
    if (q.includes('गुम्बा') || q.includes('मठ')) {
      return ['रुमटेक गुम्बाको इतिहास', 'पेमायाङ्चे गुम्बाका नियमहरू', 'परम्परागत नेपाली पोशाक'];
    }
    return ['नजिकैको अस्पताल र प्रहरी चौकी', 'सिक्किमका मुख्य स्थानीय परिकारहरू', 'उचाइमा लेक लाग्ने समस्याबाट बच्ने उपाय'];
  }

  // English Default
  if (q.includes('permit') || q.includes('pass')) {
    return ['How to get a Nathu La Pass permit?', 'Guidelines for Gurudongmar Lake', 'Emergency Helpline Numbers'];
  }
  if (q.includes('monastery') || q.includes('temple')) {
    return ['Monastery etiquette and dress rules', 'History of Rumtek Monastery', 'Traditional Sikkimese Attire'];
  }
  if (q.includes('emergency') || q.includes('hospital') || q.includes('sos')) {
    return ['24x7 State Helplines in Sikkim', 'Nearest hospital from Singtam', 'Safe alternate detour routes'];
  }

  return [
    'Do I need a permit for Gurudongmar Lake?',
    'How to prevent altitude sickness (AMS)?',
    'What traditional food should I try in Sikkim?',
  ];
}
