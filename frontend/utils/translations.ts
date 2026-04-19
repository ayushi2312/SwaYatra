export type Language = 'en' | 'hi' | 'fr';

export const translations: Record<string, Record<Language, string>> = {
  'app.name': {
    en: 'SWA-YATRA',
    hi: 'स्व-यात्रा',
    fr: 'SWA-YATRA'
  },
  'app.tagline': {
    en: 'Smart Heritage Tour Guide',
    hi: 'स्मार्ट विरासत यात्रा गाइड',
    fr: 'Guide de Voyage du Patrimoine Intelligent'
  },
  'chat.placeholder': {
    en: 'Ask about monuments, nearby places, food, or anything about Jaipur...',
    hi: 'किलों, आस-पास की जगहों, भोजन या जयपुर के बारे में कुछ भी पूछें...',
    fr: 'Demandez sur les monuments, lieux à proximité, nourriture ou tout sur Jaipur...'
  },
  'chat.send': {
    en: 'Send',
    hi: 'भेजें',
    fr: 'Envoyer'
  },
  'citypass.title': {
    en: 'Digital City Pass',
    hi: 'डिजिटल सिटी पास',
    fr: 'Passe Ville Numérique'
  },
  'citypass.description': {
    en: 'One QR code for access to multiple attractions',
    hi: 'कई आकर्षणों तक पहुंच के लिए एक QR कोड',
    fr: 'Un code QR pour l\'accès à plusieurs attractions'
  },
  'recommendations.nearby': {
    en: 'Nearby Attractions',
    hi: 'आस-पास के आकर्षण',
    fr: 'Attractions à Proximité'
  },
  'recommendations.food': {
    en: 'Local Food Recommendations',
    hi: 'स्थानीय भोजन सिफारिशें',
    fr: 'Recommandations de Nourriture Locale'
  },
  'recommendations.guides': {
    en: 'Verified Guides',
    hi: 'सत्यापित गाइड',
    fr: 'Guides Vérifiés'
  },
  'recommendations.transport': {
    en: 'Transport Options',
    hi: 'परिवहन विकल्प',
    fr: 'Options de Transport'
  },
  'monument.bestTime': {
    en: 'Best Time to Visit',
    hi: 'यात्रा का सर्वोत्तम समय',
    fr: 'Meilleur Moment pour Visiter'
  },
  'monument.visitingHours': {
    en: 'Visiting Hours',
    hi: 'दर्शन के घंटे',
    fr: 'Heures de Visite'
  },
  'monument.safety': {
    en: 'Safety Advisory',
    hi: 'सुरक्षा सलाह',
    fr: 'Avis de Sécurité'
  },
  'verified': {
    en: '✓ Verified',
    hi: '✓ सत्यापित',
    fr: '✓ Vérifié'
  }
};

export function translate(key: string, lang: Language): string {
  return translations[key]?.[lang] || translations[key]?.['en'] || key;
}

