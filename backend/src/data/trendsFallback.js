/**
 * Used when MySQL has no tourism_trends row for the requested year (same shape as frontend `data/trends.ts`).
 */
function getTrendsFallback(year = new Date().getFullYear()) {
  const baseTourists = 5000000;
  const growthRate = 8.5;
  const totalTourists = Math.round(baseTourists * (1 + growthRate / 100));
  const domesticTourists = Math.round(totalTourists * 0.75);
  const internationalTourists = totalTourists - domesticTourists;

  return {
    period: `${year}`,
    totalTourists,
    domesticTourists,
    internationalTourists,
    growthRate,
    topDestinations: [
      { monumentId: 'amber-fort', name: 'Amber Fort', visitorCount: 1250000, growth: 12.5 },
      { monumentId: 'hawa-mahal', name: 'Hawa Mahal', visitorCount: 980000, growth: 9.2 },
      { monumentId: 'city-palace', name: 'City Palace', visitorCount: 850000, growth: 8.1 },
      { monumentId: 'jantar-mantar', name: 'Jantar Mantar', visitorCount: 720000, growth: 7.5 },
      { monumentId: 'nahargarh-fort', name: 'Nahargarh Fort', visitorCount: 450000, growth: 15.2 },
    ],
    peakSeasons: ['October', 'November', 'December', 'January', 'February', 'March'],
    underutilizedDestinations: ['Jal Mahal', 'Albert Hall Museum', 'Galtaji Temple', 'Sisodia Rani Garden'],
    demandGaps: [
      {
        district: 'Jaipur',
        category: 'hotels',
        description: 'High demand for mid-range hotels during peak season (Oct-Mar)',
        priority: 'high',
      },
      {
        district: 'Jaipur',
        category: 'transport',
        description: 'Need for better connectivity to Nahargarh Fort and Jal Mahal',
        priority: 'medium',
      },
      {
        district: 'Jaipur',
        category: 'infrastructure',
        description: 'Parking facilities insufficient at Amber Fort during weekends',
        priority: 'high',
      },
      {
        district: 'Jaipur',
        category: 'attractions',
        description: 'Jal Mahal viewing area needs expansion for better crowd management',
        priority: 'medium',
      },
    ],
  };
}

function getSeasonalFallback() {
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
        'Promote off-peak destinations',
      ],
    },
    {
      season: 'Moderate Season',
      months: ['April', 'May', 'September'],
      averageFootfall: 85000,
      peakDays: 25,
      recommendedActions: [
        'Targeted marketing campaigns',
        'Special festival packages',
        'Improve shoulder-season offers',
      ],
    },
    {
      season: 'Low Season',
      months: ['June', 'July', 'August'],
      averageFootfall: 45000,
      peakDays: 12,
      recommendedActions: [
        'Monsoon tourism promotion',
        'Indoor attraction focus',
        'Discounted hotel rates',
      ],
    },
  ];
}

function getEntryPointsFallback() {
  return [
    { location: 'Jaipur International Airport', domestic: 125000, international: 45000, total: 170000 },
    { location: 'Jaipur Railway Station', domestic: 280000, international: 12000, total: 292000 },
    { location: 'Sindhi Camp Bus Stand', domestic: 95000, international: 3000, total: 98000 },
  ];
}

module.exports = { getTrendsFallback, getSeasonalFallback, getEntryPointsFallback };
