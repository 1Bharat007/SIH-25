import { OfflineFAQItem, SupportedLanguage } from '@sikkim-yatra/shared';

export const SIKKIM_OFFLINE_FAQS: OfflineFAQItem[] = [
  {
    id: 'faq-permit-north-sikkim',
    category: 'permits',
    keywords: [
      'permit',
      'pap',
      'gurudongmar',
      'yumthang',
      'zero point',
      'lachen',
      'lachung',
      'pass',
      'परमिट',
      'गुरुडोंगमार',
      'पास',
      'अनुमति पत्र',
    ],
    question: {
      en: 'Do I need a special permit to visit Gurudongmar Lake, Lachen, or Yumthang Valley in North Sikkim?',
      hi: 'क्या मुझे उत्तरी सिक्किम में गुरुडोंगमार झील, लाचेन या युमथांग घाटी जाने के लिए विशेष परमिट की आवश्यकता है?',
      ne: 'के मलाई उत्तर सिक्किमको गुरुडोङमार ताल, लाचेन वा युमथाङ उपत्यका जान विशेष परमिट चाहिन्छ?',
    },
    answer: {
      en: 'Yes. North Sikkim (including Gurudongmar Lake, Lachen, Lachung, and Zero Point) is a designated Protected Area. Indian citizens require a Protected Area Permit (PAP) issued through Sikkim Tourism or registered tour operators with valid Photo ID and 2 passport photos. Foreign nationals are permitted up to Yumthang Valley with a Restricted Area Permit (RAP) in groups of two or more, but cannot travel to Gurudongmar Lake due to border security regulations.',
      hi: 'हाँ। उत्तरी सिक्किम (गुरुडोंगमार झील, लाचेन, लाचुंग और ज़ीरो पॉइंट सहित) एक संरक्षित क्षेत्र है। भारतीय नागरिकों को वैध फोटो पहचान पत्र और 2 पासपोर्ट तस्वीरों के साथ सिक्किम पर्यटन विभाग या पंजीकृत टूर ऑपरेटरों के माध्यम से संरक्षित क्षेत्र परमिट (PAP) प्राप्त करना अनिवार्य है। विदेशी नागरिक युमथांग घाटी तक जा सकते हैं, लेकिन सीमा सुरक्षा नियमों के कारण गुरुडोंगमार झील की अनुमति नहीं है।',
      ne: 'हो। उत्तर सिक्किम (गुरुडोङमार ताल, लाचेन, लाचुङ र जिरो पोइन्ट) संरक्षित क्षेत्र हो। भारतीय नागरिकहरूलाई सिक्किम पर्यटन विभाग वा दर्ता भएका टुर अपरेटरमार्फत संरक्षित क्षेत्र परमिट (PAP) चाहिन्छ। विदेशी पर्यटकहरू युमथाङ उपत्यकासम्म जान सक्छन्, तर सीमा सुरक्षा नियमका कारण गुरुडोङमार ताल जान पाउँदैनन्।',
    },
    relatedCorridor: 'North Sikkim Highway (Chungthang - Lachen - Thangu)',
  },
  {
    id: 'faq-permit-tsomgo-nathula',
    category: 'permits',
    keywords: [
      'nathula',
      'tsomgo',
      'changu',
      'baba mandir',
      'permit',
      'नाथूला',
      'त्सोंगमो',
      'चांगु',
      'परमिट',
    ],
    question: {
      en: 'How can I get a permit for Nathu La Pass and Tsomgo (Changu) Lake?',
      hi: 'नाथू ला दर्रा और त्सोंगमो (चांगू) झील के लिए परमिट कैसे प्राप्त करें?',
      ne: 'नाथु ला भञ्ज्याङ र त्सोङ्गो (चाङ्गु) तालको परमिट कसरी पाउने?',
    },
    answer: {
      en: 'Permits for Tsomgo Lake and Baba Mandir can be obtained 1 day in advance through any Sikkim Tourism registered tour operator with a photo ID and passport photos. For Nathu La Pass (Indo-China border), permits are issued exclusively to Indian citizens and are closed on Mondays and Tuesdays. Applications should be submitted at least 24 hours prior to travel.',
      hi: 'त्सोंगमो झील और बाबा मंदिर के लिए परमिट यात्रा से 1 दिन पहले सिक्किम पर्यटन पंजीकृत टूर ऑपरेटरों के माध्यम से प्राप्त किया जा सकता है। नाथू ला दर्रा (भारत-चीन सीमा) का परमिट केवल भारतीय नागरिकों को दिया जाता है और यह सोमवार और मंगलवार को बंद रहता है। कम से कम 24 घंटे पहले आवेदन करना आवश्यक है।',
      ne: 'त्सोङ्गो ताल र बाबा मन्दिरको परमिट यात्राको १ दिन अगाडि नै सिक्किम पर्यटनमा दर्ता भएका टुर अपरेटरमार्फत लिन सकिन्छ। नाथु ला (भारत-चीन सीमा) को परमिट भारतीय नागरिकहरूका लागि मात्र जारी गरिन्छ र यो सोमबार तथा मंगलबार बन्द रहन्छ।',
    },
    relatedCorridor: 'JN Marg (Gangtok - Tsomgo - Nathula)',
  },
  {
    id: 'faq-ams-high-altitude',
    category: 'high_altitude_health',
    keywords: [
      'ams',
      'altitude',
      'oxygen',
      'sickness',
      'breathing',
      'headache',
      'ऊंचाई की बीमारी',
      'ऑक्सीजन',
      'लेक सिकनेस',
      'उचाइको समस्या',
    ],
    question: {
      en: 'How do I prevent Acute Mountain Sickness (AMS) at Gurudongmar Lake (17,800 ft)?',
      hi: 'गुरुडोंगमार झील (17,800 फीट) पर ऊंचाई की बीमारी (AMS) से कैसे बचें?',
      ne: 'गुरुडोङमार ताल (१७,८०० फिट) मा लेक लाग्ने (AMS) समस्याबाट कसरी बच्ने?',
    },
    answer: {
      en: 'Acclimatization is essential. Spend at least one night in Lachen (8,800 ft) before ascending. Drink plenty of water and ginger-garlic soup. Avoid alcohol and smoking. Do not run or exert yourself at high altitudes. If you experience severe headaches, nausea, or dizziness, notify your driver and descend immediately. Portable oxygen cans can be rented in Gangtok or Lachen.',
      hi: 'अनुकूलन (एक्लिमेटाइजेशन) बहुत ज़रूरी है। ऊपर चढ़ने से पहले लाचेन (8,800 फीट) में कम से कम एक रात बिताएं। भरपूर पानी और अदरक-लहसुन का सूप पिएं। शराब और धूम्रपान से बचें। अधिक ऊंचाई पर दौड़ें या भारी परिश्रम न करें। यदि सिरदर्द, मतली या चक्कर आए, तो तुरंत नीचे उतरें। गंगटोक या लाचेन से पोर्टेबल ऑक्सीजन सिलेंडर किराए पर ले सकते हैं।',
      ne: 'उचाइमा शरीरलाई अभ्यस्त बनाउनु आवश्यक छ। उचाइ चढ्नुअघि लाचेन (८,८०० फिट) मा कम्तीमा एक रात बिताउनुहोस्। प्रशस्त पानी र अदुवा-लसुनको झोल खानुहोस्। अत्यधिक उचाइमा नदौडिनुहोस्। टाउको दुख्ने, वाकवाकी लाग्ने भएमा तुरुन्तै तल ओर्लनुहोस्। गंगटोक वा लाचेनबाट अक्सिजन क्यान भाडामा लिन सकिन्छ।',
    },
    emergencyPriority: true,
  },
  {
    id: 'faq-monastery-etiquette',
    category: 'monastery_etiquette',
    keywords: [
      'monastery',
      'shoes',
      'photography',
      'prayer wheel',
      'rules',
      'rumtek',
      'मठ',
      'नियम',
      'जूते',
      'गुम्बा',
      'नियमहरू',
    ],
    question: {
      en: 'What are the essential etiquette rules when visiting monasteries in Sikkim?',
      hi: 'सिक्किम के मठों में जाते समय किन महत्वपूर्ण नियमों का पालन करना चाहिए?',
      ne: 'सिक्किमका गुम्बाहरूमा जाँदा पालना गर्नुपर्ने मुख्य नियमहरू के के हुन्?',
    },
    answer: {
      en: '1. Always circumambulate monasteries, stupas, and prayer wheels in a clockwise direction. 2. Remove shoes and hats before entering the main prayer hall. 3. Dress respectfully (cover shoulders and knees). 4. Photography is strictly prohibited inside the inner sanctums and altars. 5. Maintain silence and do not step over monks cushions or sacred texts.',
      hi: '1. हमेशा मठों, स्तूपों और प्रार्थना चक्रों की परिक्रमा दक्षिणावर्त (Clockwise) दिशा में करें। 2. मुख्य प्रार्थना कक्ष में प्रवेश करने से पहले जूते और टोपी उतारें। 3. शालीन वस्त्र पहनें (कंधे और घुटने ढके होने चाहिए)। 4. गर्भगृह और वेदी के अंदर फोटोग्राफी सख्त वर्जित है। 5. शांति बनाए रखें और भिक्षुओं के बैठने के आसनों पर पैर न रखें।',
      ne: '१. गुम्बा, चैत्य र मानेहरूलाई सधैं घडीको सुई घुम्ने दिशामा (Clockwise) परिक्रमा गर्नुहोस्। २. मुख्य प्रार्थना कक्षमा प्रवेश गर्नुअघि जुत्ता र टोपी खोल्नुहोस्। ३. मर्यादित पोशाक लगाउनुहोस्। ४. भित्री मन्दिर र वेदीभित्र फोटो खिच्न सख्त मनाही छ। ५. शान्त रहनुहोस् र लामा गुरुहरूको बस्ने आसनमाथि नहिंड्नुहोस्।',
    },
  },
  {
    id: 'faq-emergency-helplines',
    category: 'emergency',
    keywords: [
      'emergency',
      'police',
      'ambulance',
      'disaster',
      'helpline',
      'sos',
      'आपातकालीन',
      'पुलिस',
      'एम्बुलेंस',
      'आपतकालीन',
      'प्रहरी',
    ],
    question: {
      en: 'What are the 24x7 emergency helpline numbers in Sikkim?',
      hi: 'सिक्किम में 24x7 आपातकालीन हेल्पलाइन नंबर क्या हैं?',
      ne: 'सिक्किममा २४ सै घण्टा उपलब्ध हुने आपतकालीन नम्बरहरू के के हुन्?',
    },
    answer: {
      en: 'State Emergency Operation Centre (SSDMA): 1070 | Tourist Assistance Helpline: 1364 | National Emergency Police/Fire/Rescue: 112 | Medical Ambulance: 108 | Gangtok Sadar Police: +91 3592 202022 | STNM State Hospital Trauma Wing (Gangtok): +91 3592 202944 | North Sikkim Mangan Control: +91 3592 234244.',
      hi: 'राज्य आपदा नियंत्रण केंद्र (SSDMA): 1070 | पर्यटक सहायता हेल्पलाइन: 1364 | राष्ट्रीय आपातकालीन पुलिस/बचाव: 112 | एम्बुलेंस: 108 | गंगटोक सदर पुलिस: +91 3592 202022 | STNM अस्पताल ट्रॉमा सेंटर (गंगटोक): +91 3592 202944 | मंगन आपदा नियंत्रण: +91 3592 234244.',
      ne: 'राज्य विपद् व्यवस्थापन केन्द्र (SSDMA): १०७० | पर्यटक सहायता हेल्पलाइन: १३६४ | राष्ट्रिय आपतकालीन प्रहरी/उद्धार: ११२ | एम्बुलेन्स: १०८ | गान्तोक सदर प्रहरी: +९१ ३५९२ २०२९२२ | STNM अस्पताल ट्रमा सेन्टर: +९१ ३५९२ २०२९४४।',
    },
    emergencyPriority: true,
  },
  {
    id: 'faq-monsoon-landslides',
    category: 'weather_hazards',
    keywords: [
      'landslide',
      'nh10',
      'road blocked',
      'rain',
      'flood',
      'भूस्खलन',
      'सड़क बंद',
      'पहिरो',
      'बाटो बन्द',
    ],
    question: {
      en: 'What should I do if NH10 is blocked due to a landslide near 29th Mile / Rangpo?',
      hi: 'यदि 29th Mile / रंगपो के पास भूस्खलन के कारण NH10 अवरुद्ध हो जाए तो क्या करें?',
      ne: 'यदि २९ माइल / रङ्पो नजिकै पहिरोका कारण NH10 सडक बन्द भयो भने के गर्ने?',
    },
    answer: {
      en: 'Use the official Sikkim Yatra Alternate Detour Route: Pakyong - Rorathang - Reshi - Melli bypass. Avoid traveling near landslide active zones after sunset. Check the live Disaster Center tab in this app for real-time corridor clearance updates from the BRO (Border Roads Organisation) and Sikkim Police.',
      hi: 'सिक्किम यात्रा के आधिकारिक सुरक्षित वैकल्पिक मार्ग का उपयोग करें: पाक्योंग - रोरथांग - रेशी - मेल्ली बाईपास। सूर्यास्त के बाद भूस्खलन संभावित क्षेत्रों में यात्रा करने से बचें। बीआरओ (BRO) और सिक्किम पुलिस से वास्तविक समय की स्थिति के लिए इस ऐप के डिजास्टर सेंटर टैब को देखें।',
      ne: 'सिक्किम यात्राको आधिकारिक सुरक्षित वैकल्पिक मार्ग प्रयोग गर्नुहोस्: पाक्योंग - रोरथाङ - रेशी - मेल्ली बाइपास। सूर्यास्तपछि पहिरो जाने ठाउँहरूमा यात्रा नगर्नुहोस्। BRO र सिक्किम प्रहरीको ताजा जानकारीका लागि एपको डिजास्टर सेन्टर हेर्नुहोस्।',
    },
    relatedCorridor: 'NH10 Highway (Siliguri - Rangpo - Singtam)',
    emergencyPriority: true,
  },
  {
    id: 'faq-traditional-attire',
    category: 'culture_attire',
    keywords: [
      'attire',
      'dress',
      'bakhu',
      'kho',
      'dumvum',
      'daura suruwal',
      'कपड़े',
      'पोशाक',
      'बखू',
      'दौरा सुरुवाल',
    ],
    question: {
      en: 'What is the traditional attire of the Bhutia, Lepcha, and Nepali communities in Sikkim?',
      hi: 'सिक्किम के भूटिया, लेप्चा और नेपाली समुदायों की पारंपरिक पोशाक क्या है?',
      ne: 'सिक्किमका भोटिया, लेप्चा र नेपाली समुदायको परम्परागत पोशाक के हो?',
    },
    answer: {
      en: 'Bhutia: Women wear the Bakhu (Kho) silk robe with a Honju blouse and striped Pangden apron; men wear a long-sleeved Bakhu cinched with a Kera sash and Shambo fur hat. Lepcha: Women wear the handwoven Dumvum pinned with a silver brooch; men wear the striped Thokro-Dum cotton cloak. Nepali: Men wear the Daura Suruwal with 8 sacred ties, Dhaka Topi crown, and Patuka waistband; women wear the Gunyo Cholo with gold ornaments.',
      hi: 'भूटिया: महिलाएं होन्जू ब्लाउज और पंगडेन एप्रन के साथ रेशमी बाखू (खो) पहनती हैं; पुरुष केरा कमरबंद और शम्बो टोपी के साथ बाखू पहनते हैं। लेप्चा: महिलाएं दुमवुम और पुरुष थोकरो-दुम सूती लबादा पहनते हैं। नेपाली: पुरुष 8 पवित्र गांठों वाला दौरा सुरुवाल, ढाका टोपी और पटुका पहनते हैं; महिलाएं गुन्यू चोली पहनती हैं।',
      ne: 'भोटिया: महिलाहरू होन्जु र पाङ्देनसहित रेशमी बाखू (खो) लगाउँछन्; पुरुषहरू केरा पेटी र शाम्बो टोपीसहित बाखू लगाउँछन्। लेप्चा: महिलाहरू दुमभुम र पुरुषहरू थोक्रो-दुम लगाउँछन्। नेपाली: पुरुषहरू दौरा सुरुवाल, ढाका टोपी र पटुका लगाउँछन्; महिलाहरू गुन्यु चोली लगाउँछन्।',
    },
  },
  {
    id: 'faq-local-cuisine',
    category: 'culture_attire',
    keywords: [
      'food',
      'cuisine',
      'gundruk',
      'momo',
      'thukpa',
      'chhurpi',
      'खाना',
      'व्यंजन',
      'गुन्द्रुक',
    ],
    question: {
      en: 'What authentic local dishes should I try in Sikkim?',
      hi: 'सिक्किम में कौन से प्रामाणिक स्थानीय व्यंजनों का स्वाद लेना चाहिए?',
      ne: 'सिक्किममा चाख्नै पर्ने स्थानीय मौलिक परिकारहरू के के हुन्?',
    },
    answer: {
      en: 'Try Gundruk (fermented leafy greens soup), steaming Tibetan Momos and Thukpa noodle soup, Tingmo (steamed fluffy bread), Kinema (fermented soybean curry), Sel Roti (crispy traditional rice donut), and Chhurpi (Himalayan yak cheese cooked with wild mountain mushrooms or fiddlehead ferns).',
      hi: 'गुन्द्रुक (किण्वित पत्तेदार सब्जी का सूप), गरमा-गरम मोमो और थुकपा नूडल सूप, टिंगमो (भाप में पकी रोटी), किनेमा (सोयाबीन करी), सेल रोटी और छुरपी (याक पनीर जिसे जंगली मशरूम के साथ पकाया जाता है) का आनंद लें।',
      ne: 'गुन्द्रुकको झोल, तातो-तातो मोमो र थुक्पा, टिङ्मो, किनेमा तरकारी, सेल रोटी र स्थानीय निगुरो तथा च्याउसँग पकाइएको छुर्पी अवश्य चाख्नुहोस्।',
    },
  },
];

export function searchOfflineKB(
  query: string,
  preferredLanguage: SupportedLanguage = 'en'
): { item: OfflineFAQItem; confidence: number } | null {
  const q = query.toLowerCase().trim();
  let bestMatch: { item: OfflineFAQItem; confidence: number } | null = null;
  let highestScore = 0;

  for (const item of SIKKIM_OFFLINE_FAQS) {
    let score = 0;

    // Check keywords
    for (const kw of item.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += 3;
      }
    }

    // Check question in preferred language
    const langKey = preferredLanguage === 'hi' ? 'hi' : preferredLanguage === 'ne' ? 'ne' : 'en';
    const questionText = item.question[langKey].toLowerCase();
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    for (const w of words) {
      if (questionText.includes(w)) {
        score += 2;
      }
    }

    if (score > highestScore && score >= 3) {
      highestScore = score;
      bestMatch = { item, confidence: score };
    }
  }

  return bestMatch;
}
