'use client';

import { useState, useEffect, useRef } from 'react';
import { Users, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { getAllMonumentsFootfall, getDailyFootfall, FootfallData, DailyFootfall } from '@/data/footfall';
import { jaipurMonuments } from '@/data/monuments';
import { apiFetch, getWsFootfallUrl } from '@/lib/api';

export default function FootfallDashboard() {
  const [realTimeData, setRealTimeData] = useState<FootfallData[]>([]);
  const [selectedMonument, setSelectedMonument] = useState<string>('hawa-mahal');
  const [dailyData, setDailyData] = useState<DailyFootfall | null>(null);

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isLive) return;

    const load = async () => {
      try {
        const d = await apiFetch<{ footfall: FootfallData[] }>('/api/v1/analytics/footfall/realtime');
        setRealTimeData(d.footfall);
      } catch {
        setRealTimeData(getAllMonumentsFootfall());
      }
      setLastUpdate(new Date());
    };

    load();
    const interval = setInterval(load, 5000);

    try {
      const ws = new WebSocket(getWsFootfallUrl());
      wsRef.current = ws;
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data as string) as { type?: string; data?: FootfallData[] };
          if (msg.type === 'footfall' && Array.isArray(msg.data)) {
            setRealTimeData(msg.data);
            setLastUpdate(new Date());
          }
        } catch {
          /* ignore */
        }
      };
    } catch {
      /* HTTP polling only */
    }

    return () => {
      clearInterval(interval);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [isLive]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await apiFetch<{ daily: DailyFootfall }>(
          `/api/v1/analytics/footfall/daily?monumentId=${encodeURIComponent(selectedMonument)}`
        );
        if (!cancelled) {
          setDailyData(d.daily);
        }
      } catch {
        if (!cancelled) {
          setDailyData(getDailyFootfall(selectedMonument));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedMonument]);

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const totalVisitors = realTimeData.reduce((sum, d) => sum + d.totalCount, 0) || 1;
  const totalDomestic = realTimeData.reduce((sum, d) => sum + d.domesticCount, 0);
  const totalInternational = realTimeData.reduce((sum, d) => sum + d.internationalCount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Real-Time Footfall Monitoring</h2>
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
            <span className="text-xs text-gray-500">Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-saffron/10 to-saffron/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisitors.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-saffron" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green/10 to-green/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Domestic</p>
                <p className="text-2xl font-bold text-gray-900">{totalDomestic.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{((totalDomestic / totalVisitors) * 100).toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">International</p>
                <p className="text-2xl font-bold text-gray-900">{totalInternational.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{((totalInternational / totalVisitors) * 100).toFixed(1)}%</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Locations</p>
                <p className="text-2xl font-bold text-gray-900">{realTimeData.length}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Monument-wise Footfall</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {realTimeData.map((data) => (
              <div
                key={data.monumentId}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{data.monumentName}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCrowdColor(data.crowdLevel)}`}>
                    {data.crowdLevel.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold">{data.totalCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domestic:</span>
                    <span className="text-green-600">{data.domesticCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">International:</span>
                    <span className="text-blue-600">{data.internationalCount}</span>
                  </div>
                  {data.peakHour && (
                    <div className="flex items-center gap-1 text-orange-600 text-xs mt-2">
                      <AlertCircle className="w-3 h-3" />
                      <span>Peak Hour</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Daily Hourly Breakdown</h3>
          <select
            value={selectedMonument}
            onChange={(e) => setSelectedMonument(e.target.value)}
            className="mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
          >
            {jaipurMonuments.map((monument) => (
              <option key={monument.id} value={monument.id}>
                {monument.name}
              </option>
            ))}
          </select>

          {dailyData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total Visitors</p>
                  <p className="text-xl font-bold text-gray-900">{dailyData.totalVisitors.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Domestic</p>
                  <p className="text-xl font-bold text-green-600">{dailyData.domesticVisitors.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">International</p>
                  <p className="text-xl font-bold text-blue-600">{dailyData.internationalVisitors.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-xl font-bold text-gray-900">{new Date(dailyData.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Hourly Distribution</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {dailyData.hourlyBreakdown.map((hour) => (
                    <div key={hour.hour} className="bg-white rounded p-2 text-center">
                      <p className="text-xs text-gray-600">{hour.hour}:00</p>
                      <p className="text-sm font-semibold text-gray-900">{hour.count}</p>
                      <div className="flex justify-center gap-1 text-xs mt-1">
                        <span className="text-green-600">{hour.domestic}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-blue-600">{hour.international}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
