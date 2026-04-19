const { getPool } = require('../config/database');
const footfallSim = require('../services/footfallSimulator');

async function loadFootfallBaselines() {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT monument_id AS monumentId, base_total AS baseTotal, domestic_ratio AS domesticRatio
     FROM footfall_monument_baseline`);
  const map = {};
  for (const r of rows) {
    map[r.monumentId] = { base_total: r.baseTotal, domestic_ratio: r.domesticRatio };
  }
  return map;
}

/**
 * Latest reading per monument, or simulated snapshot using baselines.
 */
async function getRealtimeFootfallAll() {
  const pool = getPool();
  const baselines = await loadFootfallBaselines();
  const monumentIds = Object.keys(baselines).length
    ? Object.keys(baselines)
    : Object.keys(footfallSim.DEFAULT_BASES);

  const [latest] = await pool.query(
    `SELECT f1.* FROM footfall_realtime_reading f1
     INNER JOIN (
       SELECT monument_id, MAX(recorded_at) AS max_at
       FROM footfall_realtime_reading
       GROUP BY monument_id
     ) t ON t.monument_id = f1.monument_id AND t.max_at = f1.recorded_at`
  );

  const byId = {};
  for (const row of latest) {
    byId[row.monument_id] = row;
  }

  return monumentIds.map((id) => {
    const dbRow = byId[id];
    if (dbRow) {
      return {
        monumentId: dbRow.monument_id,
        monumentName: dbRow.monument_name,
        timestamp: new Date(dbRow.recorded_at).toISOString(),
        domesticCount: dbRow.domestic_count,
        internationalCount: dbRow.international_count,
        totalCount: dbRow.total_count,
        crowdLevel: dbRow.crowd_level,
        peakHour: Boolean(dbRow.peak_hour),
      };
    }
    return footfallSim.getRealTimeFootfall(id, baselines[id]);
  });
}

async function getDailyFootfallForMonument(monumentId) {
  const pool = getPool();
  const [mrows] = await pool.query(`SELECT name FROM monuments WHERE id = :id LIMIT 1`, { id: monumentId });
  const monumentName = mrows[0]?.name || footfallSim.MONUMENT_NAMES[monumentId] || monumentId;

  const [drows] = await pool.query(
    `SELECT d.* FROM footfall_daily d
     WHERE d.monument_id = :id
     ORDER BY d.date DESC LIMIT 1`,
    { id: monumentId }
  );

  if (!drows.length) {
    return footfallSim.getDailyFootfall(monumentId, monumentName);
  }

  const daily = drows[0];
  const [hours] = await pool.query(
    `SELECT hour, count, domestic, international FROM footfall_daily_hourly WHERE daily_id = :did ORDER BY hour`,
    { did: daily.id }
  );

  const hourlyBreakdown = hours.map((h) => ({
    hour: h.hour,
    count: h.count,
    domestic: h.domestic,
    international: h.international,
  }));

  const dateStr =
    daily.date instanceof Date ? daily.date.toISOString().slice(0, 10) : String(daily.date).slice(0, 10);

  return {
    date: dateStr,
    monumentId: daily.monument_id,
    monumentName: daily.monument_name,
    totalVisitors: daily.total_visitors,
    domesticVisitors: daily.domestic_visitors,
    internationalVisitors: daily.international_visitors,
    hourlyBreakdown,
  };
}

async function getTourismTrendsBundle(year) {
  const pool = getPool();
  const [trows] = await pool.query(
    `SELECT id, year, period, total_tourists AS totalTourists, domestic_tourists AS domesticTourists,
            international_tourists AS internationalTourists, growth_rate AS growthRate
     FROM tourism_trends WHERE year = :year LIMIT 1`,
    { year }
  );
  if (!trows.length) return null;

  const t = trows[0];
  const trendId = t.id;

  const [topDest] = await pool.query(
    `SELECT monument_id AS monumentId, name, visitor_count AS visitorCount, growth_rate AS growth
     FROM tourism_top_destinations WHERE trend_id = :tid ORDER BY visitor_count DESC`,
    { tid: trendId }
  );

  const [peak] = await pool.query(
    `SELECT month_name AS monthName FROM tourism_peak_seasons WHERE trend_id = :tid ORDER BY sort_order`,
    { tid: trendId }
  );

  const [under] = await pool.query(
    `SELECT destination_name AS name FROM tourism_underutilized WHERE trend_id = :tid ORDER BY sort_order`,
    { tid: trendId }
  );

  const [gaps] = await pool.query(
    `SELECT district, category, description, priority FROM tourism_demand_gaps WHERE trend_id = :tid`,
    { tid: trendId }
  );

  return {
    period: String(t.period),
    totalTourists: Number(t.totalTourists),
    domesticTourists: Number(t.domesticTourists),
    internationalTourists: Number(t.internationalTourists),
    growthRate: Number(t.growthRate),
    topDestinations: topDest.map((d) => ({
      monumentId: d.monumentId,
      name: d.name,
      visitorCount: d.visitorCount,
      growth: Number(d.growth),
    })),
    peakSeasons: peak.map((p) => p.monthName),
    underutilizedDestinations: under.map((u) => u.name),
    demandGaps: gaps.map((g) => ({
      district: g.district,
      category: g.category,
      description: g.description,
      priority: g.priority,
    })),
  };
}

async function getSeasonalAnalysisAll() {
  const pool = getPool();
  const [seasons] = await pool.query(
    `SELECT id, season, average_footfall AS averageFootfall, peak_days AS peakDays FROM seasonal_analysis ORDER BY id`
  );

  const out = [];
  for (const s of seasons) {
    const [months] = await pool.query(
      `SELECT month_name AS m FROM seasonal_analysis_months WHERE seasonal_id = :sid ORDER BY sort_order`,
      { sid: s.id }
    );
    const [actions] = await pool.query(
      `SELECT action_text AS a FROM seasonal_analysis_actions WHERE seasonal_id = :sid ORDER BY sort_order`,
      { sid: s.id }
    );
    out.push({
      season: s.season,
      months: months.map((x) => x.m),
      averageFootfall: s.averageFootfall,
      peakDays: s.peakDays,
      recommendedActions: actions.map((x) => x.a),
    });
  }
  return out;
}

async function getTouristEntryPointsAll() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT location, domestic, international, total FROM tourist_entry_points ORDER BY id`
  );
  return rows.map((r) => ({
    location: r.location,
    domestic: r.domestic,
    international: r.international,
    total: r.total,
  }));
}

module.exports = {
  getRealtimeFootfallAll,
  getDailyFootfallForMonument,
  getTourismTrendsBundle,
  getSeasonalAnalysisAll,
  getTouristEntryPointsAll,
};
