'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import FootfallDashboard from '@/components/FootfallDashboard';
import HotelAnalytics from '@/components/HotelAnalytics';
import TrendsDashboard from '@/components/TrendsDashboard';
import { BarChart3, Users, Building2, TrendingUp } from 'lucide-react';
import { isAuthenticated } from '@/utils/auth';

type TabType = 'footfall' | 'hotels' | 'trends';

export default function AnalyticsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('footfall');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron/10 via-white to-green/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/10 via-white to-green/10">
      <Header onCityPassClick={() => {}} />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tourism Intelligence Dashboard</h1>
          <p className="text-gray-600">Real-time analytics and insights for Rajasthan Tourism</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('footfall')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'footfall'
                  ? 'text-saffron border-b-2 border-saffron'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Footfall Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'hotels'
                  ? 'text-saffron border-b-2 border-saffron'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>Hotel Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'trends'
                  ? 'text-saffron border-b-2 border-saffron'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Trends & Insights</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'footfall' && <FootfallDashboard />}
          {activeTab === 'hotels' && <HotelAnalytics />}
          {activeTab === 'trends' && <TrendsDashboard />}
        </div>
      </main>
    </div>
  );
}

