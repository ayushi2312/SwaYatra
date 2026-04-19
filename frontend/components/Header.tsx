'use client';

import { MapPin, QrCode, BarChart3, LogOut, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getUser, logout } from '@/utils/auth';

interface HeaderProps {
  onCityPassClick: () => void;
}

export default function Header({ onCityPassClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAnalytics = pathname === '/analytics';
  const user = getUser();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-saffron to-green rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SWA-YATRA</h1>
            <p className="text-xs text-gray-500">Official Tourism Guide</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Jaipur, Rajasthan</span>
          </div>
          
          <Link
            href={isAnalytics ? '/' : '/analytics'}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isAnalytics ? 'Tour Guide' : 'Analytics'}</span>
          </Link>
          
          {!isAnalytics && (
            <>
              <Link
                href="/bookings"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                <Calendar className="w-4 h-4" />
                <span>My Bookings</span>
              </Link>
              <button
                onClick={onCityPassClick}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-saffron to-green text-white rounded-lg hover:shadow-lg transition-shadow text-sm font-medium"
              >
                <QrCode className="w-4 h-4" />
                <span>City Pass</span>
              </button>
            </>
          )}
          
          {user && (
            <div className="flex items-center gap-2 pl-4 border-l border-gray-300">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user.name || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

