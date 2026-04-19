import { Monument, findMonumentByName, getNearbyMonuments, getAllMonuments } from '@/data/monuments';
import { getSmartRecommendations, Recommendation } from '@/data/recommendations';
import { Language } from './translations';
import { getRealTimeFootfall, getAllMonumentsFootfall } from '@/data/footfall';
import { getTourismTrends, getSeasonalAnalysis, getTouristEntryPoints } from '@/data/trends';
import { getDistrictHotelStats, getUnderutilizedHotels, getHighDemandHotels } from '@/data/hotels';

export interface ChatResponse {
  type: 'monument' | 'recommendations' | 'general' | 'citypass' | 'analytics';
  mode: 'tourist' | 'analytics';
  content: {
    title: string;
    text: string;
    data?: any;
  };
  language: Language;
}

// Detect which mode to use based on query
function detectMode(query: string): 'tourist' | 'analytics' {
  const lowerQuery = query.toLowerCase().trim();
  
  // Analytics keywords
  const analyticsKeywords = [
    'analytics', 'dashboard', 'footfall', 'trends', 'statistics', 'stats',
    'growth', 'seasonal', 'analysis', 'hotels demand', 'infrastructure',
    'government', 'planning', 'insights', 'data', 'report', 'metrics',
    'occupancy', 'visitor count', 'tourist count', 'entry points',
    'demand gap', 'underutilized', 'capacity', 'utilization'
  ];
  
  // Check if query contains analytics keywords
  const isAnalytics = analyticsKeywords.some(keyword => lowerQuery.includes(keyword));
  
  return isAnalytics ? 'analytics' : 'tourist';
}

export function generateResponse(query: string, language: Language = 'en'): ChatResponse {
  const lowerQuery = query.toLowerCase().trim();
  const mode = detectMode(query);
  
  // ==================== ANALYTICS MODE ====================
  if (mode === 'analytics') {
    // Footfall analytics
    if (lowerQuery.includes('footfall') || lowerQuery.includes('visitor') || lowerQuery.includes('crowd')) {
      const footfallData = getAllMonumentsFootfall();
      const total = footfallData.reduce((sum, d) => sum + d.totalCount, 0);
      const domestic = footfallData.reduce((sum, d) => sum + d.domesticCount, 0);
      const international = footfallData.reduce((sum, d) => sum + d.internationalCount, 0);
      
      return {
        type: 'analytics',
        mode: 'analytics',
        content: {
          title: language === 'hi' ? 'पैरों की गिनती विश्लेषण' : language === 'fr' ? 'Analyse de l\'Affluence' : 'Footfall Analytics',
          text: language === 'hi'
            ? `📊 वास्तविक समय पैरों की गिनती:\n\nकुल आगंतुक: ${total.toLocaleString()}\nघरेलू: ${domestic.toLocaleString()} (${((domestic/total)*100).toFixed(1)}%)\nअंतर्राष्ट्रीय: ${international.toLocaleString()} (${((international/total)*100).toFixed(1)}%)\n\nसक्रिय स्थान: ${footfallData.length}`
            : language === 'fr'
            ? `📊 Affluence en temps réel:\n\nTotal visiteurs: ${total.toLocaleString()}\nDomestiques: ${domestic.toLocaleString()} (${((domestic/total)*100).toFixed(1)}%)\nInternationaux: ${international.toLocaleString()} (${((international/total)*100).toFixed(1)}%)\n\nLieux actifs: ${footfallData.length}`
            : `📊 Real-time Footfall:\n\nTotal Visitors: ${total.toLocaleString()}\nDomestic: ${domestic.toLocaleString()} (${((domestic/total)*100).toFixed(1)}%)\nInternational: ${international.toLocaleString()} (${((international/total)*100).toFixed(1)}%)\n\nActive Locations: ${footfallData.length}`,
          data: { footfallData }
        },
        language
      };
    }
    
    // Tourism trends
    if (lowerQuery.includes('trend') || lowerQuery.includes('growth') || lowerQuery.includes('statistic')) {
      const trends = getTourismTrends();
      
      return {
        type: 'analytics',
        mode: 'analytics',
        content: {
          title: language === 'hi' ? 'पर्यटन रुझान' : language === 'fr' ? 'Tendances du Tourisme' : 'Tourism Trends',
          text: language === 'hi'
            ? `📈 ${trends.period} पर्यटन रुझान:\n\nकुल पर्यटक: ${(trends.totalTourists/1000000).toFixed(2)}M\nघरेलू: ${(trends.domesticTourists/1000000).toFixed(2)}M (${((trends.domesticTourists/trends.totalTourists)*100).toFixed(1)}%)\nअंतर्राष्ट्रीय: ${(trends.internationalTourists/1000000).toFixed(2)}M\nवृद्धि दर: +${trends.growthRate}%`
            : language === 'fr'
            ? `📈 Tendances du tourisme ${trends.period}:\n\nTotal touristes: ${(trends.totalTourists/1000000).toFixed(2)}M\nDomestiques: ${(trends.domesticTourists/1000000).toFixed(2)}M (${((trends.domesticTourists/trends.totalTourists)*100).toFixed(1)}%)\nInternationaux: ${(trends.internationalTourists/1000000).toFixed(2)}M\nTaux de croissance: +${trends.growthRate}%`
            : `📈 ${trends.period} Tourism Trends:\n\nTotal Tourists: ${(trends.totalTourists/1000000).toFixed(2)}M\nDomestic: ${(trends.domesticTourists/1000000).toFixed(2)}M (${((trends.domesticTourists/trends.totalTourists)*100).toFixed(1)}%)\nInternational: ${(trends.internationalTourists/1000000).toFixed(2)}M\nGrowth Rate: +${trends.growthRate}%`,
          data: { trends }
        },
        language
      };
    }
    
    // Hotel analytics
    if (lowerQuery.includes('hotel') || lowerQuery.includes('accommodation') || lowerQuery.includes('occupancy')) {
      const stats = getDistrictHotelStats('Jaipur');
      const highDemand = getHighDemandHotels(80);
      const underutilized = getUnderutilizedHotels(60);
      
      return {
        type: 'analytics',
        mode: 'analytics',
        content: {
          title: language === 'hi' ? 'होटल विश्लेषण' : language === 'fr' ? 'Analyse des Hôtels' : 'Hotel Analytics',
          text: language === 'hi'
            ? `🏨 होटल बुनियादी ढांचा:\n\nकुल होटल: ${stats.totalHotels}\nकुल कमरे: ${stats.totalRooms.toLocaleString()}\nऔसत रेटिंग: ${stats.averageRating}\nऔसत अधिभोग: ${stats.averageOccupancy}%\n\n⚠️ उच्च मांग: ${highDemand.length} होटल (>80%)\n✅ अविकसित: ${underutilized.length} होटल (<60%)`
            : language === 'fr'
            ? `🏨 Infrastructure hôtelière:\n\nTotal hôtels: ${stats.totalHotels}\nTotal chambres: ${stats.totalRooms.toLocaleString()}\nNote moyenne: ${stats.averageRating}\nTaux d'occupation moyen: ${stats.averageOccupancy}%\n\n⚠️ Demande élevée: ${highDemand.length} hôtels (>80%)\n✅ Sous-utilisés: ${underutilized.length} hôtels (<60%)`
            : `🏨 Hotel Infrastructure:\n\nTotal Hotels: ${stats.totalHotels}\nTotal Rooms: ${stats.totalRooms.toLocaleString()}\nAverage Rating: ${stats.averageRating}\nAverage Occupancy: ${stats.averageOccupancy}%\n\n⚠️ High Demand: ${highDemand.length} hotels (>80%)\n✅ Underutilized: ${underutilized.length} hotels (<60%)`,
          data: { stats, highDemand, underutilized }
        },
        language
      };
    }
    
    // Default analytics response
    return {
      type: 'analytics',
      mode: 'analytics',
      content: {
        title: language === 'hi' ? 'विश्लेषण डैशबोर्ड' : language === 'fr' ? 'Tableau de Bord Analytique' : 'Analytics Dashboard',
        text: language === 'hi'
          ? 'विश्लेषण डैशबोर्ड तक पहुंचने के लिए, कृपया शीर्ष पर "Analytics" बटन पर क्लिक करें।\n\nआप पूछ सकते हैं:\n• पैरों की गिनती और भीड़ विश्लेषण\n• होटल बुनियादी ढांचा\n• पर्यटन रुझान और वृद्धि\n• मौसमी विश्लेषण'
          : language === 'fr'
          ? 'Pour accéder au tableau de bord analytique, veuillez cliquer sur le bouton "Analytics" en haut.\n\nVous pouvez demander:\n• Affluence et analyse de foule\n• Infrastructure hôtelière\n• Tendances et croissance du tourisme\n• Analyse saisonnière'
          : 'To access the analytics dashboard, please click the "Analytics" button at the top.\n\nYou can ask about:\n• Footfall and crowd analysis\n• Hotel infrastructure\n• Tourism trends and growth\n• Seasonal analysis',
        data: {}
      },
      language
    };
  }
  
  // ==================== TOURIST ASSISTANT MODE ====================
  
  // Detect city
  const isDelhi = lowerQuery.includes('delhi') || lowerQuery.includes('red fort') || 
                  lowerQuery.includes('qutub') || lowerQuery.includes('india gate') ||
                  lowerQuery.includes('lotus temple') || lowerQuery.includes('humayun') ||
                  lowerQuery.includes('jama masjid') || lowerQuery.includes('akshardham') ||
                  lowerQuery.includes('purana qila');
  const city = isDelhi ? 'delhi' : 'jaipur';
  
  // List all famous places
  if (lowerQuery.includes('famous places') || lowerQuery.includes('all places') || 
      lowerQuery.includes('famous monuments') || lowerQuery.includes('list monuments') ||
      (isDelhi && (lowerQuery.includes('places') || lowerQuery.includes('monuments')))) {
    
    const monuments = getAllMonuments(city);
    
    return {
      type: 'recommendations',
      mode: 'tourist',
      content: {
        title: language === 'hi' 
          ? (isDelhi ? 'दिल्ली के प्रसिद्ध स्थान' : 'जयपुर के प्रसिद्ध स्थान')
          : language === 'fr'
          ? (isDelhi ? 'Lieux Célèbres de Delhi' : 'Lieux Célèbres de Jaipur')
          : (isDelhi ? 'Famous Places in Delhi' : 'Famous Places in Jaipur'),
        text: monuments.map((m: Monument, idx: number) => 
          language === 'hi'
            ? `${idx + 1}. 📍 ${m.nameHindi}\n   ${m.location}\n   🕰️ ${m.bestTime}\n   👥 ${m.crowdLevel} crowd`
            : language === 'fr'
            ? `${idx + 1}. 📍 ${m.nameFrench}\n   ${m.location}\n   🕰️ ${m.bestTime}\n   👥 ${m.crowdLevel}`
            : `${idx + 1}. 📍 ${m.name}\n   ${m.location}\n   🕰️ ${m.bestTime}\n   👥 ${m.crowdLevel} crowd`
        ).join('\n\n'),
        data: { monuments }
      },
      language
    };
  }
  
  // Monument identification
  if (lowerQuery.includes('monument') || lowerQuery.includes('palace') || 
      lowerQuery.includes('fort') || lowerQuery.includes('temple') ||
      lowerQuery.includes('hawa mahal') || lowerQuery.includes('amber') ||
      lowerQuery.includes('city palace') || lowerQuery.includes('jantar mantar') ||
      lowerQuery.includes('nahargarh') || lowerQuery.includes('jal mahal') ||
      lowerQuery.includes('red fort') || lowerQuery.includes('qutub') ||
      lowerQuery.includes('india gate') || lowerQuery.includes('lotus') ||
      lowerQuery.includes('humayun') || lowerQuery.includes('jama masjid') ||
      lowerQuery.includes('akshardham') || lowerQuery.includes('purana qila')) {
    
    const monument = findMonumentByName(query, city);
    if (monument) {
      const footfall = getRealTimeFootfall(monument.id);
      
      return {
        type: 'monument',
        mode: 'tourist',
        content: {
          title: language === 'hi' ? monument.nameHindi : (language === 'fr' ? monument.nameFrench : monument.name),
          text: language === 'hi'
            ? `📍 ${monument.location}\n\n✨ ${monument.historicalInfo[language]}\n\n🕰️ सर्वोत्तम समय: ${monument.bestTime}\n🕰️ दर्शन के घंटे: ${monument.visitingHours}\n👥 वर्तमान भीड़: ${footfall.crowdLevel} (${footfall.totalCount} आगंतुक)\n\n⚠️ ${monument.safetyAdvisory[language]}`
            : language === 'fr'
            ? `📍 ${monument.location}\n\n✨ ${monument.historicalInfo[language]}\n\n🕰️ Meilleur moment: ${monument.bestTime}\n🕰️ Heures: ${monument.visitingHours}\n👥 Foule actuelle: ${footfall.crowdLevel} (${footfall.totalCount} visiteurs)\n\n⚠️ ${monument.safetyAdvisory[language]}`
            : `📍 ${monument.location}\n\n✨ ${monument.historicalInfo[language]}\n\n🕰️ Best Time: ${monument.bestTime}\n🕰️ Visiting Hours: ${monument.visitingHours}\n👥 Current Crowd: ${footfall.crowdLevel} (${footfall.totalCount} visitors)\n\n⚠️ ${monument.safetyAdvisory[language]}`,
          data: monument
        },
        language
      };
    }
  }
  
  // Nearby / What next / Suggest
  if (lowerQuery.includes('near') || lowerQuery.includes('nearby') || 
      lowerQuery.includes('what next') || lowerQuery.includes('suggest') ||
      lowerQuery.includes('recommend') || lowerQuery.includes('next') ||
      lowerQuery.includes('what should i visit')) {
    
    const recommendations = getSmartRecommendations(Date.now(), 'medium');
    const nearbyMonuments = getNearbyMonuments(26.9124, 75.7873, 3);
    
    return {
      type: 'recommendations',
      mode: 'tourist',
      content: {
        title: language === 'hi' ? 'सुझाव' : (language === 'fr' ? 'Suggestions' : 'Smart Recommendations'),
        text: language === 'hi'
          ? `➡️ आस-पास के आकर्षण:\n${nearbyMonuments.map(m => `\n📍 ${m.nameHindi}\n   ${m.location}\n   🕰️ ${m.bestTime}`).join('\n')}\n\n🍽️ स्थानीय भोजन:\n${recommendations.filter(r => r.type === 'food').slice(0, 2).map(r => `\n• ${r.nameHindi}\n  ${r.description[language]}`).join('\n')}`
          : language === 'fr'
          ? `➡️ Attractions à proximité:\n${nearbyMonuments.map(m => `\n📍 ${m.nameFrench}\n   ${m.location}\n   🕰️ ${m.bestTime}`).join('\n')}\n\n🍽️ Nourriture locale:\n${recommendations.filter(r => r.type === 'food').slice(0, 2).map(r => `\n• ${r.nameFrench}\n  ${r.description[language]}`).join('\n')}`
          : `➡️ Nearby Attractions:\n${nearbyMonuments.map(m => `\n📍 ${m.name}\n   ${m.location}\n   🕰️ ${m.bestTime}`).join('\n')}\n\n🍽️ Local Food:\n${recommendations.filter(r => r.type === 'food').slice(0, 2).map(r => `\n• ${r.name}\n  ${r.description[language]}`).join('\n')}`,
        data: {
          monuments: nearbyMonuments,
          recommendations
        }
      },
      language
    };
  }
  
  // Food recommendations
  if (lowerQuery.includes('food') || lowerQuery.includes('eat') || 
      lowerQuery.includes('restaurant') || lowerQuery.includes('thali') ||
      lowerQuery.includes('sweet') || lowerQuery.includes('kachori')) {
    
    const foodRecs = getSmartRecommendations(Date.now(), 'medium', 'food');
    
    return {
      type: 'recommendations',
      mode: 'tourist',
      content: {
        title: language === 'hi' ? 'स्थानीय भोजन' : (language === 'fr' ? 'Nourriture Locale' : 'Local Food'),
        text: language === 'hi'
          ? `🍽️ जयपुर की प्रामाणिक स्वाद:\n\n${foodRecs.map(r => `📍 ${r.nameHindi}\n   ${r.description[language]}\n   ⭐ ${r.rating}/5 | ${r.priceRange}\n   📍 ${r.location}`).join('\n\n')}`
          : language === 'fr'
          ? `🍽️ Délices authentiques de Jaipur:\n\n${foodRecs.map(r => `📍 ${r.nameFrench}\n   ${r.description[language]}\n   ⭐ ${r.rating}/5 | ${r.priceRange}\n   📍 ${r.location}`).join('\n\n')}`
          : `🍽️ Authentic Culinary Delights:\n\n${foodRecs.map(r => `📍 ${r.name}\n   ${r.description[language]}\n   ⭐ ${r.rating}/5 | ${r.priceRange}\n   📍 ${r.location}`).join('\n\n')}`,
        data: {
          recommendations: foodRecs
        }
      },
      language
    };
  }
  
  // City Pass
  if (lowerQuery.includes('pass') || lowerQuery.includes('city pass') || 
      lowerQuery.includes('qr') || lowerQuery.includes('ticket')) {
    
    return {
      type: 'citypass',
      mode: 'tourist',
      content: {
        title: language === 'hi' ? 'डिजिटल सिटी पास' : (language === 'fr' ? 'Passe Ville Numérique' : 'Digital City Pass'),
        text: language === 'hi'
          ? '🎫 एक QR कोड के साथ कई आकर्षणों तक पहुंचें।\n\nशीर्ष पर "City Pass" बटन पर क्लिक करें।'
          : language === 'fr'
          ? '🎫 Accédez à plusieurs attractions avec un seul code QR.\n\nCliquez sur le bouton "City Pass" en haut.'
          : '🎫 Access multiple attractions with a single QR code.\n\nClick the "City Pass" button at the top.',
        data: {
          passId: `SWA-${Date.now()}`,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      language
    };
  }
  
  // Guides
  if (lowerQuery.includes('guide') || lowerQuery.includes('tour guide')) {
    const guides = getSmartRecommendations(Date.now(), 'medium', 'guide');
    
    return {
      type: 'recommendations',
      mode: 'tourist',
      content: {
        title: language === 'hi' ? 'सत्यापित गाइड' : (language === 'fr' ? 'Guides Vérifiés' : 'Verified Guides'),
        text: language === 'hi'
          ? `👨‍🏫 सरकार द्वारा प्रमाणित गाइड:\n\n${guides.map(g => `📍 ${g.nameHindi}\n   ${g.description[language]}\n   ⭐ ${g.rating}/5 | 📞 ${g.contact || 'N/A'}`).join('\n\n')}`
          : language === 'fr'
          ? `👨‍🏫 Guides certifiés par le gouvernement:\n\n${guides.map(g => `📍 ${g.nameFrench}\n   ${g.description[language]}\n   ⭐ ${g.rating}/5 | 📞 ${g.contact || 'N/A'}`).join('\n\n')}`
          : `👨‍🏫 Government-Certified Guides:\n\n${guides.map(g => `📍 ${g.name}\n   ${g.description[language]}\n   ⭐ ${g.rating}/5 | 📞 ${g.contact || 'N/A'}`).join('\n\n')}`,
        data: {
          recommendations: guides
        }
      },
      language
    };
  }
  
  // Transport
  if (lowerQuery.includes('transport') || lowerQuery.includes('how to reach') ||
      lowerQuery.includes('cab') || lowerQuery.includes('auto')) {
    const transport = getSmartRecommendations(Date.now(), 'medium', 'transport');
    
    return {
      type: 'recommendations',
      mode: 'tourist',
      content: {
        title: language === 'hi' ? 'परिवहन विकल्प' : (language === 'fr' ? 'Options de Transport' : 'Transport Options'),
        text: language === 'hi'
          ? `🚗 जयपुर में यात्रा:\n\n${transport.map(t => `📍 ${t.nameHindi}\n   ${t.description[language]}\n   💰 ${t.priceRange}`).join('\n\n')}`
          : language === 'fr'
          ? `🚗 Transport à Jaipur:\n\n${transport.map(t => `📍 ${t.nameFrench}\n   ${t.description[language]}\n   💰 ${t.priceRange}`).join('\n\n')}`
          : `🚗 Transportation in Jaipur:\n\n${transport.map(t => `📍 ${t.name}\n   ${t.description[language]}\n   💰 ${t.priceRange}`).join('\n\n')}`,
        data: {
          recommendations: transport
        }
      },
      language
    };
  }
  
  // Default welcome message (Tourist Assistant mode)
  return {
    type: 'general',
    mode: 'tourist',
    content: {
      title: language === 'hi' ? 'स्वागत है' : (language === 'fr' ? 'Bienvenue' : 'Welcome'),
      text: language === 'hi'
        ? '👋 मैं SWA-YATRA हूँ, आपका स्मार्ट विरासत यात्रा गाइड।\n\nमैं आपकी मदद कर सकता हूँ:\n📍 स्मारकों के बारे में जानकारी\n🍽️ स्थानीय भोजन सुझाव\n👨‍🏫 सत्यापित गाइड\n🚗 परिवहन विकल्प\n🎫 डिजिटल सिटी पास\n\nआप क्या जानना चाहेंगे?'
        : language === 'fr'
        ? '👋 Je suis SWA-YATRA, votre guide de voyage du patrimoine intelligent.\n\nJe peux vous aider avec:\n📍 Informations sur les monuments\n🍽️ Recommandations de nourriture locale\n👨‍🏫 Guides vérifiés\n🚗 Options de transport\n🎫 Passe ville numérique\n\nQue souhaitez-vous savoir?'
        : '👋 I\'m SWA-YATRA, your smart heritage tour guide.\n\nI can help you with:\n📍 Monument information\n🍽️ Local food recommendations\n👨‍🏫 Verified guides\n🚗 Transport options\n🎫 Digital City Pass\n\nWhat would you like to know?',
      data: {}
    },
    language
  };
}
