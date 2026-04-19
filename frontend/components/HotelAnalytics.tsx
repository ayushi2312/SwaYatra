'use client';

import { useState, useEffect } from 'react';
import { Building2, Star, Bed, TrendingUp, MapPin } from 'lucide-react';
import {
  getDistrictHotelStats,
  getUnderutilizedHotels,
  getHighDemandHotels,
  DistrictHotelStats,
  Hotel,
} from '@/data/hotels';
import { apiFetch } from '@/lib/api';

export default function HotelAnalytics() {
  const [stats, setStats] = useState<DistrictHotelStats>(() => getDistrictHotelStats('Jaipur'));
  const [underutilized, setUnderutilized] = useState<Hotel[]>(() => getUnderutilizedHotels(60));
  const [highDemand, setHighDemand] = useState<Hotel[]>(() => getHighDemandHotels(80));
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const district = 'Jaipur';

    const updateData = async () => {
      try {
        const [summaryRes, highRes, lowRes] = await Promise.all([
          apiFetch<{ summary: DistrictHotelStats }>(
            `/api/v1/analytics/hotels/district/${encodeURIComponent(district)}/summary`
          ),
          apiFetch<{ hotels: Hotel[] }>(
            `/api/v1/analytics/hotels/high-demand?district=${encodeURIComponent(district)}&threshold=80`
          ),
          apiFetch<{ hotels: Hotel[] }>(
            `/api/v1/analytics/hotels/underutilized?district=${encodeURIComponent(district)}&threshold=60`
          ),
        ]);
        setStats(summaryRes.summary);
        setHighDemand(highRes.hotels);
        setUnderutilized(lowRes.hotels);
      } catch {
        setStats(getDistrictHotelStats(district));
        setHighDemand(getHighDemandHotels(80));
        setUnderutilized(getUnderutilizedHotels(60));
      }
      setLastUpdate(new Date());
    };

    updateData();
    const interval = setInterval(updateData, 10000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Hotel Infrastructure Analytics</h2>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isLive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
            >
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {isLive ? 'Pause' : 'Resume'}
            </button>
            <span className="text-xs text-gray-500">Updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-saffron/10 to-saffron/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Hotels</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHotels}</p>
              </div>
              <Building2 className="w-8 h-8 text-saffron" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green/10 to-green/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRooms.toLocaleString()}</p>
              </div>
              <Bed className="w-8 h-8 text-green" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(stats.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <Star className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Occupancy</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageOccupancy}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Range Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Budget</p>
              <p className="text-2xl font-bold text-gray-900">{stats.priceDistribution.budget}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Mid-Range</p>
              <p className="text-2xl font-bold text-gray-900">{stats.priceDistribution['mid-range']}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Luxury</p>
              <p className="text-2xl font-bold text-gray-900">{stats.priceDistribution.luxury}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Premium</p>
              <p className="text-2xl font-bold text-gray-900">{stats.priceDistribution.premium}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">High Demand Hotels (Occupancy &gt; 80%)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highDemand.map((hotel) => (
              <div key={hotel.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{hotel.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{hotel.location}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs font-medium">
                    {hotel.occupancyRate.toFixed(1)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                  <div>
                    <p className="text-gray-600">Rooms</p>
                    <p className="font-semibold">{hotel.totalRooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available</p>
                    <p className="font-semibold text-red-600">{hotel.availableRooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rating</p>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{hotel.rating}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Underutilized Hotels (Occupancy &lt; 60%)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {underutilized.map((hotel) => (
              <div key={hotel.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{hotel.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{hotel.location}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-medium">
                    {hotel.occupancyRate.toFixed(1)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                  <div>
                    <p className="text-gray-600">Rooms</p>
                    <p className="font-semibold">{hotel.totalRooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available</p>
                    <p className="font-semibold text-green-600">{hotel.availableRooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rating</p>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{hotel.rating}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-2">💡 Opportunity for promotion and marketing</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
