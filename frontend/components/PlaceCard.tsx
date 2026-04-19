'use client';

import { Clock, MapPin, Users } from 'lucide-react';
import { Monument } from '@/data/monuments';
import { useState } from 'react';

interface PlaceCardProps {
  place: Monument;
  language?: 'en' | 'hi' | 'fr';
  onBook: (place: Monument) => void;
  onDetails: (place: Monument) => void;
}

export default function PlaceCard({ place, language = 'en', onBook, onDetails }: PlaceCardProps) {
  const getImageUrl = (id: string, name: string) => {
    // Proper image mapping based on monument names
    const imageMap: Record<string, string> = {
      // Jaipur Monuments
      'hawa-mahal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/500px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
      'amber-fort': 'https://www.rajasthanplaces.com/wp-content/uploads/2024/07/Amer-Fort-Jaipur.webp',
      'city-palace': 'https://lp-cms-production.imgix.net/2025-04/shutterstock1263280048-crop.jpg?auto=format,compress&q=72&w=1440&h=810&fit=crop ',
      'jantar-mantar': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4J8DQyrNkRj6p1WS3gKUnux3-Yi7frkLDw&s',
      'nahargarh-fort': 'https://d3sftlgbtusmnv.cloudfront.net/blog/wp-content/uploads/2024/09/Nahargarh-fort-jaipur-cp-1-840x425.jpg',
      'jal-mahal': 'https://hindi.cdn.zeenews.com/hindi/sites/default/files/2025/02/26/3714708-1.jpg?im=FitAndFill=(800,600)',
      // Delhi Monuments
      'red-fort': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80',
      'qutub-minar': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80',
      'india-gate': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80',
      'lotus-temple': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80',
      'humayun-tomb': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80',
      'jama-masjid': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80',
      'akshardham': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80',
      'purana-qila': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80'
    };
    
    // Try to get by ID first, then by name
    if (imageMap[id]) {
      return imageMap[id];
    }
    
    // Fallback: search by name keywords
    const lowerName = name.toLowerCase();
    if (lowerName.includes('hawa') || lowerName.includes('palace of winds')) {
      return 'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&q=80';
    } else if (lowerName.includes('amber') || lowerName.includes('amer')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80';
    } else if (lowerName.includes('city palace')) {
      return 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80';
    } else if (lowerName.includes('jantar')) {
      return 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80';
    } else if (lowerName.includes('nahargarh')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80';
    } else if (lowerName.includes('jal mahal') || lowerName.includes('water palace')) {
      return 'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&q=80';
    } else if (lowerName.includes('red fort') || lowerName.includes('lal qila')) {
      return 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80';
    } else if (lowerName.includes('qutub') || lowerName.includes('qutb')) {
      return 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80';
    } else if (lowerName.includes('india gate')) {
      return 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80';
    } else if (lowerName.includes('lotus')) {
      return 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80';
    } else if (lowerName.includes('humayun')) {
      return 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80';
    } else if (lowerName.includes('jama masjid')) {
      return 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80';
    } else if (lowerName.includes('akshardham')) {
      return 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80';
    } else if (lowerName.includes('purana qila') || lowerName.includes('old fort')) {
      return 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80';
    }
    
    // Default fallback
    return 'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&q=80';
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(place.id, place.name)}
          alt={place.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&q=80';
          }}
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCrowdColor(place.crowdLevel)}`}>
            {place.crowdLevel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {language === 'hi' ? place.nameHindi : language === 'fr' ? place.nameFrench : place.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-saffron mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{place.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-green mt-0.5" />
            <span>{place.visitingHours}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-blue-500 mt-0.5" />
            <span>
              {language === 'hi' ? 'सर्वोत्तम समय: ' : language === 'fr' ? 'Meilleur moment: ' : 'Best Time: '}
              {place.bestTime}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
          {place.historicalInfo[language].substring(0, 100)}...
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onBook(place)}
            className="flex-1 py-2.5 bg-gradient-to-r from-saffron to-green text-white rounded-lg font-semibold hover:shadow-lg transition-shadow text-sm"
          >
            {language === 'hi' ? 'बुक करें' : language === 'fr' ? 'Réserver' : 'Book Now'}
          </button>
          <button
            type="button"
            onClick={() => onDetails(place)}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
          >
            {language === 'hi' ? 'विवरण' : language === 'fr' ? 'Détails' : 'Details'}
          </button>
        </div>
      </div>
    </div>
  );
}

