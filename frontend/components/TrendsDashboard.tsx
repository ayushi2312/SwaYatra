'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, MapPin, AlertCircle, Calendar, Users } from 'lucide-react';
import {
  getTourismTrends,
  getSeasonalAnalysis,
  getTouristEntryPoints,
  TourismTrend,
  SeasonalAnalysis,
} from '@/data/trends';
import { apiFetch } from '@/lib/api';

type EntryPoint = { location: string; domestic: number; international: number; total: number };

export default function TrendsDashboard() {
  const year = new Date().getFullYear();
  const [trends, setTrends] = useState<TourismTrend>(() => getTourismTrends(year));
  const [seasonal, setSeasonal] = useState<SeasonalAnalysis[]>(() => getSeasonalAnalysis());
  const [entryPoints, setEntryPoints] = useState<ReturnType<typeof getTouristEntryPoints>>(() =>
    getTouristEntryPoints()
  );
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const updateData = async () => {
      try {
        const [tRes, sRes, eRes] = await Promise.all([
          apiFetch<{ trends: TourismTrend }>(`/api/v1/analytics/trends?year=${year}`),
          apiFetch<{ seasonal: SeasonalAnalysis[] }>('/api/v1/analytics/seasonal'),
          apiFetch<{ entryPoints: EntryPoint[] }>('/api/v1/analytics/entry-points'),
        ]);
        setTrends(tRes.trends);
        setSeasonal(sRes.seasonal);
        setEntryPoints(eRes.entryPoints);
      } catch {
        setTrends(getTourismTrends(year));
        setSeasonal(getSeasonalAnalysis());
        setEntryPoints(getTouristEntryPoints());
      }
      setLastUpdate(new Date());
    };

    updateData();
    const interval = setInterval(updateData, 15000);

    return () => clearInterval(interval);
  }, [isLive, year]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Tourism Trends & Insights</h2>
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
                <p className="text-sm text-gray-600">Total Tourists ({trends.period})</p>
                <p className="text-2xl font-bold text-gray-900">{(trends.totalTourists / 1000000).toFixed(2)}M</p>
              </div>
              <Users className="w-8 h-8 text-saffron" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green/10 to-green/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Domestic</p>
                <p className="text-2xl font-bold text-gray-900">{(trends.domesticTourists / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-gray-500">{((trends.domesticTourists / trends.totalTourists) * 100).toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">International</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(trends.internationalTourists / 1000000).toFixed(2)}M
                </p>
                <p className="text-xs text-gray-500">
                  {((trends.internationalTourists / trends.totalTourists) * 100).toFixed(1)}%
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">+{trends.growthRate}%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Positive trend
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Destinations</h3>
          <div className="space-y-2">
            {trends.topDestinations.map((dest, idx) => (
              <div key={dest.monumentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-saffron rounded-full flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{dest.name}</p>
                    <p className="text-sm text-gray-600">{dest.visitorCount.toLocaleString()} visitors</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">+{dest.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tourist Entry Points</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entryPoints.map((point) => (
              <div key={point.location} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-saffron" />
                  <h4 className="font-semibold text-gray-900">{point.location}</h4>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="font-semibold">{point.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Domestic</p>
                    <p className="font-semibold text-green-600">{point.domestic.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">International</p>
                    <p className="font-semibold text-blue-600">{point.international.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Identified Demand Gaps</h3>
          <div className="space-y-3">
            {trends.demandGaps.map((gap, idx) => (
              <div key={idx} className="border-l-4 border-orange-400 bg-orange-50 rounded p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-gray-900">{gap.category.toUpperCase()}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          gap.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : gap.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {gap.priority} priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{gap.description}</p>
                    <p className="text-xs text-gray-500 mt-1">District: {gap.district}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Seasonal Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {seasonal.map((s) => (
            <div key={s.season} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-saffron" />
                <h3 className="font-semibold text-gray-900">{s.season}</h3>
              </div>
              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-xs text-gray-600">Months</p>
                  <p className="text-sm font-medium text-gray-900">{s.months.join(', ')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg Daily Footfall</p>
                  <p className="text-lg font-bold text-gray-900">{s.averageFootfall.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Peak Days</p>
                  <p className="text-sm font-medium text-gray-900">{s.peakDays} days</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">Recommended Actions:</p>
                <ul className="space-y-1">
                  {s.recommendedActions.map((action, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-saffron">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Underutilized Destinations</h2>
        <p className="text-gray-600 mb-4">These destinations have potential for increased promotion and development:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trends.underutilizedDestinations.map((dest) => (
            <div key={dest} className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">{dest}</p>
              <p className="text-xs text-gray-600 mt-1">Promotion opportunity</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
