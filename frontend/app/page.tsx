'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import PlaceCard from '@/components/PlaceCard';
import ChatBotButton from '@/components/ChatBotButton';
import BookingModal from '@/components/BookingModal';
import PlaceDetailModal from '@/components/PlaceDetailModal';
import { getAllMonuments } from '@/data/monuments';
import { Monument } from '@/data/monuments';
import { isAuthenticated } from '@/utils/auth';
import { apiFetch } from '@/lib/api';
import { 
  Landmark, 
  Building2, 
  Mountain, 
  Camera, 
  MapPin,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

type Category = 'all' | 'monuments' | 'religious' | 'forts' | 'palaces' | 'hotels';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<Monument[]>(() => getAllMonuments());
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [language, setLanguage] = useState<'en' | 'hi' | 'fr'>('en');
  const [bookingPlace, setBookingPlace] = useState<Monument | null>(null);
  const [detailPlace, setDetailPlace] = useState<Monument | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch<{ monuments: Monument[] }>('/api/v1/monuments?city=jaipur');
        if (!cancelled && data.monuments?.length) {
          setPlaces(data.monuments);
        }
      } catch {
        /* keep bundled monuments */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const allPlaces = places;
  
  const categories = {
    all: allPlaces,
    monuments: allPlaces.filter(p => p.category === 'monument' || p.category === 'museum'),
    religious: allPlaces.filter(p => p.category === 'temple'),
    forts: allPlaces.filter(p => p.category === 'fort'),
    palaces: allPlaces.filter(p => p.category === 'palace'),
    hotels: [] // Hotels would come from a different data source
  };

  const displayedPlaces = categories[selectedCategory];

  const categoryButtons = [
    { id: 'all' as Category, label: language === 'hi' ? 'सभी' : language === 'fr' ? 'Tout' : 'All', icon: MapPin },
    { id: 'monuments' as Category, label: language === 'hi' ? 'स्मारक' : language === 'fr' ? 'Monuments' : 'Monuments', icon: Landmark },
    { id: 'religious' as Category, label: language === 'hi' ? 'धार्मिक स्थल' : language === 'fr' ? 'Religieux' : 'Religious', icon: Mountain },
    { id: 'forts' as Category, label: language === 'hi' ? 'किले' : language === 'fr' ? 'Forts' : 'Forts', icon: Building2 },
    { id: 'palaces' as Category, label: language === 'hi' ? 'महल' : language === 'fr' ? 'Palais' : 'Palaces', icon: Camera },
  ];

  // Container variants for staggered animation
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Item variants for 3D entry effect
  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      rotateX: -45, 
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/10 via-white to-green/10">
      <Header onCityPassClick={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-saffron animate-pulse" />
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
              {language === 'hi' ? 'स्व-यात्रा में आपका स्वागत है' : language === 'fr' ? 'Bienvenue sur SWA-YATRA' : 'Welcome to SWA-YATRA'}
            </h1>
            <Sparkles className="w-6 h-6 text-green animate-pulse" />
          </div>
          <p className="text-xl text-gray-600 mb-6 font-medium">
            {language === 'hi' 
              ? 'भारत की समृद्ध विरासत का अन्वेषण करें'
              : language === 'fr'
              ? 'Explorez le riche patrimoine de l\'Inde'
              : 'Explore India\'s Rich Heritage'}
          </p>
          
          {/* Language Selector */}
          <div className="flex justify-center gap-3 mb-8">
            {(['en', 'hi', 'fr'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
                  language === lang
                    ? 'bg-gradient-to-r from-saffron to-green text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                {lang === 'hi' ? 'हिंदी' : lang === 'fr' ? 'Français' : 'English'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            {categoryButtons.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-saffron to-green text-white shadow-xl ring-4 ring-saffron/20'
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${selectedCategory === cat.id ? 'text-white' : 'text-saffron'}`} />
                  <span>{cat.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Places Grid with 3D Animation */}
        <div className="mb-16 perspective-1000">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              {language === 'hi' 
                ? `${categoryButtons.find(c => c.id === selectedCategory)?.label} स्थान`
                : language === 'fr'
                ? `Lieux ${categoryButtons.find(c => c.id === selectedCategory)?.label}`
                : `${categoryButtons.find(c => c.id === selectedCategory)?.label} Places`
              }
            </h2>
            <div className="px-4 py-1.5 bg-gray-100 rounded-full text-sm font-bold text-gray-600 uppercase tracking-widest">
              {displayedPlaces.length} {language === 'hi' ? 'स्थान' : language === 'fr' ? 'lieux' : 'results'}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {displayedPlaces.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200"
              >
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-xl font-medium">
                  {language === 'hi' ? 'इस श्रेणी में कोई स्थान नहीं मिला' : language === 'fr' ? 'Aucun lieu dans cette catégorie' : 'No places found in this category'}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key={selectedCategory}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {displayedPlaces.map((place) => (
                  <motion.div 
                    key={place.id} 
                    variants={itemVariants}
                    className="h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <PlaceCard 
                      place={place} 
                      language={language} 
                      onBook={(p) => setBookingPlace(p)}
                      onDetails={(p) => setDetailPlace(p)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats Section */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="bg-white rounded-3xl shadow-2xl p-10 mb-12 border border-gray-100 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-saffron/10 transition-colors" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green/5 rounded-full -ml-32 -mb-32 blur-3xl group-hover:bg-green/10 transition-colors" />
          
          <h3 className="text-3xl font-black text-gray-900 mb-10 text-center tracking-tight">
            {language === 'hi' ? 'पर्यटन आंकड़े' : language === 'fr' ? 'Statistiques du Tourisme' : 'Tourism Statistics'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {[
              { icon: MapPin, value: `${allPlaces.length}+`, color: 'saffron', label: { en: 'Places', hi: 'स्थान', fr: 'Lieux' } },
              { icon: Clock, value: '24/7', color: 'green', label: { en: 'Support', hi: 'सहायता', fr: 'Support' } },
              { icon: TrendingUp, value: '1M+', color: 'blue-600', label: { en: 'Visitors', hi: 'आगंतुक', fr: 'Visiteurs' } },
              { icon: Building2, value: '500+', color: 'purple-600', label: { en: 'Hotels', hi: 'होटल', fr: 'Hôtels' } }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`w-20 h-20 bg-${stat.color === 'saffron' ? 'saffron' : stat.color === 'green' ? 'green' : 'blue-500'}/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-10 h-10 ${stat.color === 'saffron' ? 'text-saffron' : stat.color === 'green' ? 'text-green' : 'text-blue-600'}`} />
                </div>
                <div className="text-4xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  {stat.label[language as keyof typeof stat.label] || stat.label.en}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Place details */}
      {detailPlace && (
        <PlaceDetailModal
          place={detailPlace}
          language={language}
          onClose={() => setDetailPlace(null)}
          onBook={(p) => setBookingPlace(p)}
        />
      )}

      {/* Booking Modal */}
      {bookingPlace && (
        <BookingModal
          place={bookingPlace}
          onClose={() => setBookingPlace(null)}
          language={language}
        />
      )}

      {/* Floating Chat Bot Button */}
      <ChatBotButton />
      
      {/* 3D Helpers */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
