import { Monument } from './monuments';

export interface Recommendation {
  id: string;
  type: 'attraction' | 'food' | 'guide' | 'transport';
  name: string;
  nameHindi: string;
  nameFrench: string;
  description: {
    en: string;
    hi: string;
    fr: string;
  };
  location: string;
  rating: number;
  priceRange: 'budget' | 'moderate' | 'premium';
  verified: boolean;
  contact?: string;
}

export const localFood: Recommendation[] = [
  {
    id: 'laxmi-misthan',
    type: 'food',
    name: 'Laxmi Misthan Bhandar',
    nameHindi: 'लक्ष्मी मिष्ठान भंडार',
    nameFrench: 'Laxmi Misthan Bhandar',
    description: {
      en: 'Famous for traditional Rajasthani sweets and snacks. Try the pyaaz kachori and ghevar. Established in 1954.',
      hi: 'पारंपरिक राजस्थानी मिठाई और नमकीन के लिए प्रसिद्ध। प्याज कचौड़ी और घेवर आज़माएं।',
      fr: 'Célèbre pour les sucreries et snacks traditionnels du Rajasthan. Essayez le pyaaz kachori et ghevar.'
    },
    location: 'Johari Bazaar, Jaipur',
    rating: 4.5,
    priceRange: 'budget',
    verified: true,
    contact: '+91-141-2565844'
  },
  {
    id: 'chokhi-dhani',
    type: 'food',
    name: 'Chokhi Dhani',
    nameHindi: 'छोखी धानी',
    nameFrench: 'Chokhi Dhani',
    description: {
      en: 'Authentic Rajasthani village experience with traditional thali, folk performances, and cultural activities. Best for dinner experience.',
      hi: 'पारंपरिक थाली, लोक प्रदर्शन और सांस्कृतिक गतिविधियों के साथ प्रामाणिक राजस्थानी गांव का अनुभव।',
      fr: 'Expérience authentique de village rajasthani avec thali traditionnel, spectacles folkloriques et activités culturelles.'
    },
    location: 'Tonk Road, Jaipur',
    rating: 4.3,
    priceRange: 'moderate',
    verified: true,
    contact: '+91-141-5165000'
  },
  {
    id: 'rawat-mishthan',
    type: 'food',
    name: 'Rawat Mishthan Bhandar',
    nameHindi: 'रावत मिष्ठान भंडार',
    nameFrench: 'Rawat Mishthan Bhandar',
    description: {
      en: 'Iconic breakfast spot. Famous for pyaaz kachori, mawa kachori, and samosa. Must-visit for authentic local flavors.',
      hi: 'प्रतिष्ठित नाश्ता स्थल। प्याज कचौड़ी, मावा कचौड़ी और समोसा के लिए प्रसिद्ध।',
      fr: 'Point de petit-déjeuner emblématique. Célèbre pour pyaaz kachori, mawa kachori et samosa.'
    },
    location: 'Station Road, Jaipur',
    rating: 4.4,
    priceRange: 'budget',
    verified: true
  }
];

export const verifiedGuides: Recommendation[] = [
  {
    id: 'guide-rajesh',
    type: 'guide',
    name: 'Rajesh Kumar - Certified Heritage Guide',
    nameHindi: 'राजेश कुमार - प्रमाणित विरासत गाइड',
    nameFrench: 'Rajesh Kumar - Guide du Patrimoine Certifié',
    description: {
      en: '15+ years experience. Specializes in Jaipur heritage, architecture, and history. Fluent in English, Hindi. Government certified.',
      hi: '15+ वर्ष का अनुभव। जयपुर विरासत, वास्तुकला और इतिहास में विशेषज्ञ। अंग्रेजी, हिंदी में धाराप्रवाह।',
      fr: '15+ ans d\'expérience. Spécialisé dans le patrimoine, l\'architecture et l\'histoire de Jaipur. Certifié gouvernement.'
    },
    location: 'Jaipur',
    rating: 4.8,
    priceRange: 'moderate',
    verified: true,
    contact: '+91-98290-12345'
  },
  {
    id: 'guide-priya',
    type: 'guide',
    name: 'Priya Sharma - Cultural Tour Specialist',
    nameHindi: 'प्रिया शर्मा - सांस्कृतिक यात्रा विशेषज्ञ',
    nameFrench: 'Priya Sharma - Spécialiste des Visites Culturelles',
    description: {
      en: 'Expert in Rajasthani culture, traditions, and local insights. Great for family tours. Available for half-day and full-day tours.',
      hi: 'राजस्थानी संस्कृति, परंपराओं और स्थानीय अंतर्दृष्टि में विशेषज्ञ। परिवार के दौरे के लिए बढ़िया।',
      fr: 'Experte en culture rajasthani, traditions et aperçus locaux. Idéale pour les visites familiales.'
    },
    location: 'Jaipur',
    rating: 4.7,
    priceRange: 'moderate',
    verified: true,
    contact: '+91-98765-43210'
  }
];

export const transportOptions: Recommendation[] = [
  {
    id: 'auto-rickshaw',
    type: 'transport',
    name: 'Auto Rickshaw',
    nameHindi: 'ऑटो रिक्शा',
    nameFrench: 'Auto-rickshaw',
    description: {
      en: 'Most economical for short distances. Always negotiate fare before boarding. Typical fare: ₹30-50 per km.',
      hi: 'छोटी दूरी के लिए सबसे किफायती। चढ़ने से पहले हमेशा किराया तय करें।',
      fr: 'Le plus économique pour les courtes distances. Toujours négocier le tarif avant de monter.'
    },
    location: 'Available throughout Jaipur',
    rating: 4.0,
    priceRange: 'budget',
    verified: true
  },
  {
    id: 'ola-uber',
    type: 'transport',
    name: 'Ola / Uber',
    nameHindi: 'ओला / उबर',
    nameFrench: 'Ola / Uber',
    description: {
      en: 'App-based cab service. Reliable, air-conditioned, and safe. Best for longer distances and airport transfers.',
      hi: 'ऐप-आधारित कैब सेवा। विश्वसनीय, वातानुकूलित और सुरक्षित।',
      fr: 'Service de taxi basé sur application. Fiable, climatisé et sûr.'
    },
    location: 'Available throughout Jaipur',
    rating: 4.5,
    priceRange: 'moderate',
    verified: true
  },
  {
    id: 'heritage-walk',
    type: 'transport',
    name: 'Heritage Walk Tours',
    nameHindi: 'विरासत पैदल यात्रा',
    nameFrench: 'Visites à Pied du Patrimoine',
    description: {
      en: 'Guided walking tours through old Jaipur. Explore narrow lanes, local markets, and hidden gems. Duration: 2-3 hours.',
      hi: 'पुराने जयपुर के माध्यम से निर्देशित पैदल यात्रा। संकीर्ण गलियों, स्थानीय बाजारों का अन्वेषण करें।',
      fr: 'Visites guidées à pied dans le vieux Jaipur. Explorez les ruelles étroites et les marchés locaux.'
    },
    location: 'Old City, Jaipur',
    rating: 4.6,
    priceRange: 'moderate',
    verified: true
  }
];

export function getSmartRecommendations(
  currentTime: number,
  crowdPreference: 'low' | 'medium' | 'high' = 'medium',
  category?: 'attraction' | 'food' | 'guide' | 'transport'
): Recommendation[] {
  const hour = new Date(currentTime).getHours();
  
  // Time-based recommendations
  let recommendations: Recommendation[] = [];
  
  if (category === 'food' || !category) {
    if (hour >= 7 && hour < 11) {
      recommendations.push(...localFood.filter(f => f.id === 'rawat-mishthan'));
    } else if (hour >= 12 && hour < 15) {
      recommendations.push(...localFood.filter(f => f.id === 'laxmi-misthan'));
    } else if (hour >= 18) {
      recommendations.push(...localFood.filter(f => f.id === 'chokhi-dhani'));
    }
  }
  
  if (category === 'guide' || !category) {
    recommendations.push(...verifiedGuides);
  }
  
  if (category === 'transport' || !category) {
    recommendations.push(...transportOptions);
  }
  
  // Filter by crowd preference
  // For now, return all recommendations
  return recommendations.slice(0, 3);
}

