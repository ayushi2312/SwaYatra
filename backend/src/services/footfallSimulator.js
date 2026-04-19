/**
 * Matches frontend `data/footfall.ts` logic when live DB readings are absent.
 * Uses `footfall_monument_baseline` counts from MySQL when provided.
 */

const DEFAULT_BASES = {
  'hawa-mahal': { base: 450, domesticRatio: 0.75 },
  'amber-fort': { base: 680, domesticRatio: 0.7 },
  'city-palace': { base: 520, domesticRatio: 0.72 },
  'jantar-mantar': { base: 380, domesticRatio: 0.78 },
  'nahargarh-fort': { base: 290, domesticRatio: 0.8 },
  'jal-mahal': { base: 220, domesticRatio: 0.75 },
};

const MONUMENT_NAMES = {
  'hawa-mahal': 'Hawa Mahal',
  'amber-fort': 'Amber Fort',
  'city-palace': 'City Palace',
  'jantar-mantar': 'Jantar Mantar',
  'nahargarh-fort': 'Nahargarh Fort',
  'jal-mahal': 'Jal Mahal',
};

function getRealTimeFootfall(monumentId, baselineRow) {
  const baseFromDb =
    baselineRow != null
      ? {
          base: Number(baselineRow.base_total),
          domesticRatio: Number(baselineRow.domestic_ratio),
        }
      : null;
  const base = baseFromDb || DEFAULT_BASES[monumentId] || { base: 300, domesticRatio: 0.75 };

  const hour = new Date().getHours();
  const isPeakHour = (hour >= 10 && hour <= 14) || (hour >= 16 && hour <= 18);
  const timeMultiplier = isPeakHour ? 1.4 : hour < 9 || hour > 19 ? 0.3 : 0.8;
  const randomVariation = 0.8 + Math.random() * 0.4;

  const totalCount = Math.round(base.base * timeMultiplier * randomVariation);
  const domesticCount = Math.round(totalCount * base.domesticRatio);
  const internationalCount = totalCount - domesticCount;

  let crowdLevel = 'low';
  if (totalCount < 200) crowdLevel = 'low';
  else if (totalCount < 400) crowdLevel = 'medium';
  else if (totalCount < 600) crowdLevel = 'high';
  else crowdLevel = 'critical';

  return {
    monumentId,
    monumentName: MONUMENT_NAMES[monumentId] || 'Unknown',
    timestamp: new Date().toISOString(),
    domesticCount,
    internationalCount,
    totalCount,
    crowdLevel,
    peakHour: isPeakHour,
  };
}

function getDailyFootfall(monumentId, monumentName, date = new Date()) {
  const base = 300 + Math.random() * 500;
  const hourlyBreakdown = [];

  for (let h = 8; h <= 19; h++) {
    const isPeak = (h >= 10 && h <= 14) || (h >= 16 && h <= 18);
    const multiplier = isPeak ? 1.5 : h < 9 || h > 18 ? 0.2 : 0.9;
    const count = Math.round(base * multiplier * (0.8 + Math.random() * 0.4));
    const domestic = Math.round(count * 0.75);
    const international = count - domestic;
    hourlyBreakdown.push({ hour: h, count, domestic, international });
  }

  const totalVisitors = hourlyBreakdown.reduce((sum, row) => sum + row.count, 0);
  const domesticVisitors = hourlyBreakdown.reduce((sum, row) => sum + row.domestic, 0);
  const internationalVisitors = totalVisitors - domesticVisitors;

  return {
    date: date.toISOString().split('T')[0],
    monumentId,
    monumentName,
    totalVisitors,
    domesticVisitors,
    internationalVisitors,
    hourlyBreakdown,
  };
}

module.exports = { getRealTimeFootfall, getDailyFootfall, DEFAULT_BASES, MONUMENT_NAMES };
