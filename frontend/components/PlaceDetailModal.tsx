'use client';

import { X, MapPin, Clock, Users, Landmark, Shield } from 'lucide-react';
import { Monument } from '@/data/monuments';

interface PlaceDetailModalProps {
  place: Monument;
  language?: 'en' | 'hi' | 'fr';
  onClose: () => void;
  onBook?: (place: Monument) => void;
}

export default function PlaceDetailModal({
  place,
  language = 'en',
  onClose,
  onBook,
}: PlaceDetailModalProps) {
  const title =
    language === 'hi' ? place.nameHindi : language === 'fr' ? place.nameFrench : place.name;
  const history = place.historicalInfo[language];
  const safety = place.safetyAdvisory[language];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 p-5 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{place.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          <div className="flex items-start gap-2 text-gray-700">
            <MapPin className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
            <span>{place.location}</span>
          </div>

          <div className="flex items-start gap-2 text-gray-700">
            <Clock className="w-5 h-5 text-green shrink-0 mt-0.5" />
            <span>{place.visitingHours}</span>
          </div>

          <div className="flex items-start gap-2 text-gray-700">
            <Users className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <span>
              {language === 'hi' ? 'सर्वोत्तम समय: ' : language === 'fr' ? 'Meilleur moment : ' : 'Best time: '}
              {place.bestTime}
            </span>
          </div>

          <div className="flex items-start gap-2 text-gray-700">
            <Landmark className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <span className="capitalize">{place.category}</span>
            <span className="text-gray-400">·</span>
            <span className="uppercase text-xs font-semibold tracking-wide text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
              {place.crowdLevel} crowd
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {language === 'hi' ? 'इतिहास' : language === 'fr' ? 'Histoire' : 'History'}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{history}</p>
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-100 p-4">
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-2">
              <Shield className="w-4 h-4" />
              {language === 'hi' ? 'सुरक्षा सलाह' : language === 'fr' ? 'Conseils de sécurité' : 'Safety advisory'}
            </div>
            <p className="text-sm text-amber-950 leading-relaxed whitespace-pre-wrap">{safety}</p>
          </div>

          <p className="text-xs text-gray-500">
            {language === 'hi' ? 'निर्देशांक: ' : language === 'fr' ? 'Coordonnées : ' : 'Coordinates: '}
            {place.coordinates.lat.toFixed(5)}, {place.coordinates.lng.toFixed(5)}
          </p>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200"
          >
            {language === 'hi' ? 'बंद करें' : language === 'fr' ? 'Fermer' : 'Close'}
          </button>
          {onBook && (
            <button
              type="button"
              onClick={() => {
                onBook(place);
                onClose();
              }}
              className="flex-1 py-3 bg-gradient-to-r from-saffron to-green text-white rounded-lg font-semibold hover:shadow-lg"
            >
              {language === 'hi' ? 'बुक करें' : language === 'fr' ? 'Réserver' : 'Book now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
