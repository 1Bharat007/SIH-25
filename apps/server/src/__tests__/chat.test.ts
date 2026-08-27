import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SIKKIM_OFFLINE_FAQS, searchOfflineKB } from '../data/chatbot-kb.js';
import { calculateDistanceKm } from '../utils/geo.js';
import { SIKKIM_PLACES_DATA } from '../data/sikkim-data.js';


describe('AI Chat Companion - Multilingual Offline Knowledge Base', () => {
  it('should have complete multilingual FAQs in English, Hindi, and Nepali', () => {
    assert.ok(SIKKIM_OFFLINE_FAQS.length >= 6, 'Expected at least 6 FAQ items');

    for (const item of SIKKIM_OFFLINE_FAQS) {
      assert.ok(item.id && item.category);
      assert.ok(item.keywords.length > 0);
      assert.ok(item.question.en && item.answer.en, `English missing for ${item.id}`);
      assert.ok(item.question.hi && item.answer.hi, `Hindi missing for ${item.id}`);
      assert.ok(item.question.ne && item.answer.ne, `Nepali missing for ${item.id}`);
    }
  });

  it('should match permit questions in English, Hindi, and Nepali', () => {
    // English query
    const matchEn = searchOfflineKB('Do I need a permit for Gurudongmar Lake?', 'en');
    assert.ok(matchEn);
    assert.strictEqual(matchEn.item.id, 'faq-permit-north-sikkim');
    assert.ok(matchEn.item.answer.en.includes('Protected Area Permit'));

    // Hindi query
    const matchHi = searchOfflineKB('गुरुडोंगमार झील के लिए परमिट कैसे मिलेगा?', 'hi');
    assert.ok(matchHi);
    assert.strictEqual(matchHi.item.id, 'faq-permit-north-sikkim');
    assert.ok(matchHi.item.answer.hi.includes('संरक्षित क्षेत्र परमिट'));

    // Nepali query
    const matchNe = searchOfflineKB('गुरुडोङमार ताल जान परमिट चाहिन्छ?', 'ne');
    assert.ok(matchNe);
    assert.strictEqual(matchNe.item.id, 'faq-permit-north-sikkim');
    assert.ok(matchNe.item.answer.ne.includes('संरक्षित क्षेत्र परमिट'));
  });

  it('should match emergency helplines and AMS high altitude queries', () => {
    const amsMatch = searchOfflineKB('How to prevent altitude sickness and breathing issues?', 'en');
    assert.ok(amsMatch);
    assert.strictEqual(amsMatch.item.id, 'faq-ams-high-altitude');
    assert.strictEqual(amsMatch.item.emergencyPriority, true);

    const sosMatch = searchOfflineKB('पुलिस और एम्बुलेंस आपातकालीन हेल्पलाइन', 'hi');
    assert.ok(sosMatch);
    assert.strictEqual(sosMatch.item.id, 'faq-emergency-helplines');
    assert.ok(sosMatch.item.answer.hi.includes('1070'));
  });
});

describe('AI Chat Companion - Location Grounding & Proximity', () => {
  it('should compute nearest place accurately when coordinates near Gangtok are provided', () => {
    const userLat = 27.3389; // Gangtok MG Marg
    const userLon = 88.6065;

    const placesWithDist = SIKKIM_PLACES_DATA.map((p) => ({
      place: p,
      distanceKm: calculateDistanceKm(userLat, userLon, p.latitude, p.longitude),
    })).sort((a, b) => a.distanceKm - b.distanceKm);

    assert.ok(placesWithDist.length > 0);
    const closest = placesWithDist[0];
    assert.ok(closest && (closest.place.name.includes('MG Marg') || closest.distanceKm < 15));
  });
});

