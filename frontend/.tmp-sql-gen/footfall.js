"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealTimeFootfall = getRealTimeFootfall;
exports.getDailyFootfall = getDailyFootfall;
exports.getMonthlyTrend = getMonthlyTrend;
exports.getAllMonumentsFootfall = getAllMonumentsFootfall;
// Simulated real-time footfall data
function getRealTimeFootfall(monumentId) {
    const baseCounts = {
        'hawa-mahal': { base: 450, domesticRatio: 0.75 },
        'amber-fort': { base: 680, domesticRatio: 0.70 },
        'city-palace': { base: 520, domesticRatio: 0.72 },
        'jantar-mantar': { base: 380, domesticRatio: 0.78 },
        'nahargarh-fort': { base: 290, domesticRatio: 0.80 },
        'jal-mahal': { base: 220, domesticRatio: 0.75 }
    };
    const base = baseCounts[monumentId] || { base: 300, domesticRatio: 0.75 };
    const hour = new Date().getHours();
    const isPeakHour = (hour >= 10 && hour <= 14) || (hour >= 16 && hour <= 18);
    // Simulate variation based on time
    const timeMultiplier = isPeakHour ? 1.4 : (hour < 9 || hour > 19 ? 0.3 : 0.8);
    const randomVariation = 0.8 + Math.random() * 0.4; // 80-120% variation
    const totalCount = Math.round(base.base * timeMultiplier * randomVariation);
    const domesticCount = Math.round(totalCount * base.domesticRatio);
    const internationalCount = totalCount - domesticCount;
    let crowdLevel;
    if (totalCount < 200)
        crowdLevel = 'low';
    else if (totalCount < 400)
        crowdLevel = 'medium';
    else if (totalCount < 600)
        crowdLevel = 'high';
    else
        crowdLevel = 'critical';
    return {
        monumentId,
        monumentName: getMonumentName(monumentId),
        timestamp: new Date().toISOString(),
        domesticCount,
        internationalCount,
        totalCount,
        crowdLevel,
        peakHour: isPeakHour
    };
}
function getMonumentName(id) {
    const names = {
        'hawa-mahal': 'Hawa Mahal',
        'amber-fort': 'Amber Fort',
        'city-palace': 'City Palace',
        'jantar-mantar': 'Jantar Mantar',
        'nahargarh-fort': 'Nahargarh Fort',
        'jal-mahal': 'Jal Mahal'
    };
    return names[id] || 'Unknown';
}
function getDailyFootfall(monumentId, date = new Date()) {
    const base = 300 + Math.random() * 500;
    const hourlyBreakdown = [];
    for (let hour = 8; hour <= 19; hour++) {
        const isPeak = (hour >= 10 && hour <= 14) || (hour >= 16 && hour <= 18);
        const multiplier = isPeak ? 1.5 : (hour < 9 || hour > 18 ? 0.2 : 0.9);
        const count = Math.round(base * multiplier * (0.8 + Math.random() * 0.4));
        const domestic = Math.round(count * 0.75);
        const international = count - domestic;
        hourlyBreakdown.push({ hour, count, domestic, international });
    }
    const totalVisitors = hourlyBreakdown.reduce((sum, h) => sum + h.count, 0);
    const domesticVisitors = hourlyBreakdown.reduce((sum, h) => sum + h.domestic, 0);
    const internationalVisitors = totalVisitors - domesticVisitors;
    return {
        date: date.toISOString().split('T')[0],
        monumentId,
        monumentName: getMonumentName(monumentId),
        totalVisitors,
        domesticVisitors,
        internationalVisitors,
        hourlyBreakdown
    };
}
function getMonthlyTrend(monumentId, year = new Date().getFullYear()) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    // Simulate seasonal patterns
    const seasonalMultipliers = [0.7, 0.8, 1.2, 1.5, 1.3, 0.9, 0.6, 0.7, 1.0, 1.4, 1.3, 1.1];
    return months.map((month, index) => {
        const baseFootfall = 8000 + Math.random() * 4000;
        const multiplier = seasonalMultipliers[index];
        const totalFootfall = Math.round(baseFootfall * multiplier);
        const domesticFootfall = Math.round(totalFootfall * 0.75);
        const internationalFootfall = totalFootfall - domesticFootfall;
        const daysInMonth = new Date(year, index + 1, 0).getDate();
        const averageDaily = Math.round(totalFootfall / daysInMonth);
        const peakDay = `${Math.floor(Math.random() * daysInMonth) + 1}`;
        const peakDayCount = Math.round(averageDaily * (1.5 + Math.random() * 0.5));
        return {
            month,
            year,
            totalFootfall,
            domesticFootfall,
            internationalFootfall,
            averageDaily,
            peakDay,
            peakDayCount
        };
    });
}
function getAllMonumentsFootfall() {
    const monumentIds = ['hawa-mahal', 'amber-fort', 'city-palace', 'jantar-mantar', 'nahargarh-fort', 'jal-mahal'];
    return monumentIds.map(id => getRealTimeFootfall(id));
}
