'use client';

import { ChatResponse } from '@/utils/responseGenerator';
import { Monument } from '@/data/monuments';
import { Recommendation } from '@/data/recommendations';
import { Clock, MapPin, Shield, Star, Verified, BarChart3, Users } from 'lucide-react';
import CityPass from './CityPass';

export default function ResponseDisplay({ response }: { response: ChatResponse }) {
  const { type, content, language, mode } = response;

  // Analytics mode - show structured analytics
  if (mode === 'analytics') {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 shadow-md border-l-4 border-blue-500">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">{content.title}</h3>
        </div>
        <div className="text-gray-700 whitespace-pre-line">{content.text}</div>
        {content.data && content.data.footfallData && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
            {content.data.footfallData.slice(0, 3).map((data: any) => (
              <div key={data.monumentId} className="bg-white rounded p-2 text-sm">
                <p className="font-semibold">{data.monumentName}</p>
                <p className="text-gray-600">Total: {data.totalCount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Tourist Assistant mode
  if (type === 'citypass' && content.data) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
        <CityPass onClose={() => {}} embedded />
      </div>
    );
  }

  if (type === 'monument' && content.data) {
    const monument = content.data as Monument;
    return (
      <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-saffron" />
          <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
        </div>
        <div className="text-gray-700 whitespace-pre-line mb-4">{content.text}</div>
      </div>
    );
  }

  if (type === 'recommendations' && content.data) {
    const { monuments, recommendations } = content.data;
    
    return (
      <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{content.title}</h3>
        {content.text && (
          <div className="text-gray-700 whitespace-pre-line mb-4">{content.text}</div>
        )}
        
        {monuments && monuments.length > 0 && (
          <div className="mt-4 space-y-3">
            {monuments.map((monument: Monument) => (
              <div key={monument.id} className="bg-gradient-to-r from-saffron/10 to-green/10 p-4 rounded-lg border-l-4 border-saffron">
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-saffron mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-lg">
                      {language === 'hi' ? monument.nameHindi : language === 'fr' ? monument.nameFrench : monument.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{monument.location}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>🕰️ {monument.bestTime}</span>
                      <span>👥 {monument.crowdLevel} crowd</span>
                      <span>🕐 {monument.visitingHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {recommendations && recommendations.length > 0 && (
          <div className="mt-4 space-y-3">
            {recommendations.map((rec: Recommendation) => (
              <div key={rec.id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-saffron">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-semibold text-gray-900">
                    {language === 'hi' ? rec.nameHindi : language === 'fr' ? rec.nameFrench : rec.name}
                  </div>
                  {rec.verified && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <Verified className="w-3 h-3" />
                      {language === 'hi' ? 'सत्यापित' : language === 'fr' ? 'Vérifié' : 'Verified'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {rec.description[language]}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{rec.rating}</span>
                  </div>
                  <span className="capitalize">{rec.priceRange}</span>
                  {rec.contact && <span>{rec.contact}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // General response (Tourist Assistant mode)
  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h3>
      <div className="text-gray-700 whitespace-pre-line">{content.text}</div>
    </div>
  );
}
