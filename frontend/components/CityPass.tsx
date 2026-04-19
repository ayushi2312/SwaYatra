'use client';

import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle } from 'lucide-react';

interface CityPassProps {
  onClose: () => void;
  embedded?: boolean;
}

export default function CityPass({ onClose, embedded = false }: CityPassProps) {
  const passId = `SWA-${Date.now()}`;
  const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

  const qrData = JSON.stringify({
    passId,
    type: 'city-pass',
    city: 'Jaipur',
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    attractions: ['Hawa Mahal', 'Amber Fort', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort']
  });

  if (embedded) {
    return (
      <div className="bg-gradient-to-br from-saffron/10 to-green/10 rounded-lg p-4 border border-saffron">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Digital City Pass</h3>
        <div className="flex gap-4 items-start">
          <div className="bg-white p-3 rounded-lg">
            <QRCodeSVG value={qrData} size={120} />
          </div>
          <div className="flex-1">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Pass ID: </span>
                <span className="text-gray-600">{passId}</span>
              </div>
              <div>
                <span className="font-semibold">Valid Until: </span>
                <span className="text-gray-600">{validUntil}</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 mt-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs">Access to 5+ major attractions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Digital City Pass</h2>
          <p className="text-gray-600 text-sm">One QR code for multiple attractions</p>
        </div>
        
        <div className="bg-gradient-to-br from-saffron/10 to-green/10 rounded-lg p-6 mb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG value={qrData} size={200} />
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-center">
            <div>
              <span className="font-semibold text-gray-700">Pass ID: </span>
              <span className="text-gray-600">{passId}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Valid Until: </span>
              <span className="text-gray-600">{validUntil}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Included Attractions:</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>✓ Hawa Mahal</li>
            <li>✓ Amber Fort</li>
            <li>✓ City Palace</li>
            <li>✓ Jantar Mantar</li>
            <li>✓ Nahargarh Fort</li>
          </ul>
        </div>
        
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-5 h-5" />
          <span>Verified by Rajasthan Tourism</span>
        </div>
      </div>
    </div>
  );
}

