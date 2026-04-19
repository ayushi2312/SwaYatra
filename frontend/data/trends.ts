import { MonthlyTrend } from './footfall';

export interface TourismTrend {
  period: string;
  totalTourists: number;
  domesticTourists: number;
  internationalTourists: number;
  growthRate: number;
  topDestinations: TopDestination[];
  peakSeasons: string[];
  underutilizedDestinations: string[];
  demandGaps: DemandGap[];
}

export interface TopDestination {
  monumentId: string;
  name: string;
  visitorCount: number;
  growth: number;
}

export interface DemandGap {
  district: string;
  category: 'hotels' | 'transport' | 'infrastructure' | 'attractions';
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SeasonalAnalysis {
  season: string;
  months: string[];
  averageFootfall: number;
  peakDays: number;
  recommendedActions: string[];
}

export function getTourismTrends(year: number = new Date().getFullYear()): TourismTrend {
  const baseTourists = 5000000; // 5 million base
  const growthRate = 8.5; // 8.5% growth
  
  const totalTourists = Math.round(baseTourists * (1 + growthRate / 100));
  const domesticTourists = Math.round(totalTourists * 0.75);
  const internationalTourists = totalTourists - domesticTourists;

  const topDestinations: TopDestination[] = [
    { monumentId: 'amber-fort', name: 'Amber Fort', visitorCount: 1250000, growth: 12.5 },
    { monumentId: 'hawa-mahal', name: 'Hawa Mahal', visitorCount: 980000, growth: 9.2 },
    { monumentId: 'city-palace', name: 'City Palace', visitorCount: 850000, growth: 8.1 },
    { monumentId: 'jantar-mantar', name: 'Jantar Mantar', visitorCount: 720000, growth: 7.5 },
    { monumentId: 'nahargarh-fort', name: 'Nahargarh Fort', visitorCount: 450000, growth: 15.2 }
  ];

  const peakSeasons = ['October', 'November', 'December', 'January', 'February', 'March'];
  
  const underutilizedDestinations = [
    'Jal Mahal',
    'Albert Hall Museum',
    'Galtaji Temple',
    'Sisodia Rani Garden'
  ];

  const demandGaps: DemandGap[] = [
    {
      district: 'Jaipur',
      category: 'hotels',
      description: 'High demand for mid-range hotels during peak season (Oct-Mar)',
      priority: 'high'
    },
    {
      district: 'Jaipur',
      category: 'transport',
      description: 'Need for better connectivity to Nahargarh Fort and Jal Mahal',
      priority: 'medium'
    },
    {
      district: 'Jaipur',
      category: 'infrastructure',
      description: 'Parking facilities insufficient at Amber Fort during weekends',
      priority: 'high'
    },
    {
      district: 'Jaipur',
      category: 'attractions',
      description: 'Jal Mahal viewing area needs expansion for better crowd management',
      priority: 'medium'
    }
  ];

  return {
    period: `${year}`,
    totalTourists,
    domesticTourists,
    internationalTourists,
    growthRate,
    topDestinations,
    peakSeasons,
    underutilizedDestinations,
    demandGaps
  };
}

export function getSeasonalAnalysis(): SeasonalAnalysis[] {
  return [
    {
      season: 'Peak Season',
      months: ['October', 'November', 'December', 'January', 'February', 'March'],
      averageFootfall: 125000,
      peakDays: 45,
      recommendedActions: [
        'Increase hotel capacity',
        'Enhance transport services',
        'Implement crowd management systems',
        'Promote off-peak destinations'
      ]
    },
    {
      season: 'Moderate Season',
      months: ['April', 'May', 'September'],
      averageFootfall: 85000,
      peakDays: 25,
      recommendedActions: [
        'Promote seasonal festivals',
        'Offer package deals',
        'Focus on domestic tourism'
      ]
    },
    {
      season: 'Low Season',
      months: ['June', 'July', 'August'],
      averageFootfall: 45000,
      peakDays: 10,
      recommendedActions: [
        'Promote monsoon tourism',
        'Offer discounts and packages',
        'Focus on indoor attractions',
        'Develop monsoon-specific experiences'
      ]
    }
  ];
}

export function getTouristEntryPoints(): { location: string; domestic: number; international: number; total: number }[] {
  return [
    { location: 'Jaipur Airport', domestic: 125000, international: 45000, total: 170000 },
    { location: 'Jaipur Railway Station', domestic: 280000, international: 12000, total: 292000 },
    { location: 'Bus Stand', domestic: 195000, international: 5000, total: 200000 },
    { location: 'Highway Checkpoints', domestic: 85000, international: 3000, total: 88000 }
  ];
}

