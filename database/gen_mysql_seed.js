'use strict';
/**
 * Generates MySQL schema + INSERTs from compiled data modules (.tmp-sql-gen).
 * Run from repo root: node database/gen_mysql_seed.js
 * Prerequisite (from repo root):
 *   cd frontend && npx tsc data/monuments.ts data/hotels.ts data/recommendations.ts data/footfall.ts data/trends.ts --module commonjs --target es2020 --esModuleInterop --skipLibCheck --outDir .tmp-sql-gen
 */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const root = path.join(__dirname, '..');
const genDir = path.join(root, 'frontend', '.tmp-sql-gen');

const { delhiMonuments, jaipurMonuments } = require(path.join(genDir, 'monuments.js'));
const { jaipurHotels } = require(path.join(genDir, 'hotels.js'));
const { localFood, verifiedGuides, transportOptions } = require(path.join(genDir, 'recommendations.js'));
const { getTourismTrends, getSeasonalAnalysis, getTouristEntryPoints } = require(path.join(genDir, 'trends.js'));

function esc(s) {
  if (s == null) return 'NULL';
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "''") + "'";
}

function num(n) {
  if (n == null || Number.isNaN(n)) return 'NULL';
  return String(Number(n));
}

const lines = [];
function q(sql) {
  lines.push(sql);
}

q('SET NAMES utf8mb4;');
q('SET FOREIGN_KEY_CHECKS = 0;');
q('');
q('CREATE DATABASE IF NOT EXISTS swayatra CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
q('USE swayatra;');
q('');

q(`DROP TABLE IF EXISTS bookings;`);
q(`DROP TABLE IF EXISTS users;`);
q(`DROP TABLE IF EXISTS seasonal_analysis_actions;`);
q(`DROP TABLE IF EXISTS seasonal_analysis_months;`);
q(`DROP TABLE IF EXISTS seasonal_analysis;`);
q(`DROP TABLE IF EXISTS tourist_entry_points;`);
q(`DROP TABLE IF EXISTS tourism_demand_gaps;`);
q(`DROP TABLE IF EXISTS tourism_underutilized;`);
q(`DROP TABLE IF EXISTS tourism_peak_seasons;`);
q(`DROP TABLE IF EXISTS tourism_top_destinations;`);
q(`DROP TABLE IF EXISTS tourism_trends;`);
q(`DROP TABLE IF EXISTS footfall_daily_hourly;`);
q(`DROP TABLE IF EXISTS footfall_daily;`);
q(`DROP TABLE IF EXISTS footfall_monthly_trend;`);
q(`DROP TABLE IF EXISTS footfall_realtime_reading;`);
q(`DROP TABLE IF EXISTS footfall_monument_baseline;`);
q(`DROP TABLE IF EXISTS district_hotel_summary;`);
q(`DROP TABLE IF EXISTS recommendations;`);
q(`DROP TABLE IF EXISTS hotels;`);
q(`DROP TABLE IF EXISTS monuments;`);
q('');

q(`CREATE TABLE monuments (
  id VARCHAR(64) NOT NULL COMMENT 'Slug id from TS (e.g. hawa-mahal)',
  city_code ENUM('delhi','jaipur') NOT NULL COMMENT 'Which array: delhiMonuments vs jaipurMonuments',
  name VARCHAR(255) NOT NULL,
  name_hindi VARCHAR(512) NOT NULL COMMENT 'nameHindi',
  name_french VARCHAR(255) NOT NULL COMMENT 'nameFrench',
  location VARCHAR(512) NOT NULL,
  lat DECIMAL(10,7) NOT NULL COMMENT 'coordinates.lat',
  lng DECIMAL(10,7) NOT NULL COMMENT 'coordinates.lng',
  historical_info_en TEXT NOT NULL,
  historical_info_hi TEXT NOT NULL,
  historical_info_fr TEXT NOT NULL,
  best_time VARCHAR(255) NOT NULL COMMENT 'bestTime',
  crowd_level ENUM('low','medium','high') NOT NULL COMMENT 'Monument typical crowd (not same as real-time critical)',
  visiting_hours VARCHAR(255) NOT NULL,
  safety_advisory_en TEXT NOT NULL,
  safety_advisory_hi TEXT NOT NULL,
  safety_advisory_fr TEXT NOT NULL,
  category ENUM('fort','palace','temple','museum','market','garden','monument') NOT NULL,
  PRIMARY KEY (id),
  KEY idx_monuments_city (city_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL COMMENT 'Login email; unique',
  password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt/argon hash — matches signup password field',
  full_name VARCHAR(255) NOT NULL COMMENT 'signup name',
  phone VARCHAR(32) NOT NULL COMMENT 'signup phone',
  user_type ENUM('indian','foreigner') NOT NULL COMMENT 'signup userType',
  address TEXT NULL COMMENT 'Indian: full address',
  aadhaar VARCHAR(12) NULL COMMENT 'Indian: 12 digits only',
  passport_number VARCHAR(64) NULL COMMENT 'Foreigner',
  visa_number VARCHAR(64) NULL COMMENT 'Foreigner',
  country VARCHAR(128) NULL COMMENT 'Foreigner country of residence',
  nationality VARCHAR(128) NULL COMMENT 'Foreigner',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE bookings (
  id VARCHAR(80) NOT NULL COMMENT 'SWA-... id from generateBookingId()',
  user_id BIGINT UNSIGNED NULL COMMENT 'Logged-in user; NULL if guest checkout later',
  place_id VARCHAR(64) NOT NULL COMMENT 'Monument id (place.id)',
  place_name VARCHAR(255) NOT NULL COMMENT 'Denormalized place.name',
  visit_date DATE NOT NULL COMMENT 'BookingModal date',
  visit_time VARCHAR(16) NOT NULL COMMENT 'Slot e.g. 09:00',
  visitors INT UNSIGNED NOT NULL,
  contact_name VARCHAR(255) NOT NULL COMMENT 'Visitor lead name',
  email VARCHAR(255) NOT NULL COMMENT 'Contact email; my bookings filter',
  phone VARCHAR(32) NOT NULL,
  amount DECIMAL(10,2) NOT NULL COMMENT 'visitors * 50 from UI',
  payment_status ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  payment_id VARCHAR(128) NULL COMMENT 'PaymentGateway success id',
  qr_code_payload MEDIUMTEXT NULL COMMENT 'JSON string encoded in QR',
  status ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT 'bookingDate ISO equivalent',
  PRIMARY KEY (id),
  KEY idx_bookings_user (user_id),
  KEY idx_bookings_email (email),
  KEY idx_bookings_place (place_id),
  KEY idx_bookings_visit_date (visit_date),
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_bookings_place FOREIGN KEY (place_id) REFERENCES monuments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE recommendations (
  id VARCHAR(64) NOT NULL,
  type ENUM('attraction','food','guide','transport') NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_hindi VARCHAR(512) NOT NULL,
  name_french VARCHAR(255) NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  location VARCHAR(512) NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  price_range ENUM('budget','moderate','premium') NOT NULL,
  verified TINYINT(1) NOT NULL DEFAULT 0,
  contact VARCHAR(128) NULL COMMENT 'Optional phone from TS',
  PRIMARY KEY (id),
  KEY idx_rec_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE hotels (
  id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  district VARCHAR(128) NOT NULL,
  location VARCHAR(512) NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  total_rooms INT UNSIGNED NOT NULL,
  available_rooms INT UNSIGNED NOT NULL,
  price_range ENUM('budget','mid-range','luxury','premium') NOT NULL,
  category ENUM('hotel','resort','heritage','boutique') NOT NULL,
  lat DECIMAL(10,7) NOT NULL,
  lng DECIMAL(10,7) NOT NULL,
  occupancy_rate DECIMAL(5,1) NOT NULL COMMENT 'Percentage 0-100',
  verified TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_hotels_district (district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE tourism_trends (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  year INT NOT NULL COMMENT 'Matches getTourismTrends(year); period is string year',
  period VARCHAR(16) NOT NULL COMMENT 'Same as period in TS (string year)',
  total_tourists BIGINT UNSIGNED NOT NULL,
  domestic_tourists BIGINT UNSIGNED NOT NULL,
  international_tourists BIGINT UNSIGNED NOT NULL,
  growth_rate DECIMAL(5,2) NOT NULL COMMENT 'Percent e.g. 8.50',
  PRIMARY KEY (id),
  UNIQUE KEY uq_tourism_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE tourism_top_destinations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  trend_id BIGINT UNSIGNED NOT NULL,
  monument_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  visitor_count INT UNSIGNED NOT NULL,
  growth_rate DECIMAL(5,2) NOT NULL COMMENT 'TS field growth',
  PRIMARY KEY (id),
  KEY fk_ttd_trend (trend_id),
  CONSTRAINT fk_ttd_trend FOREIGN KEY (trend_id) REFERENCES tourism_trends(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE tourism_peak_seasons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  trend_id BIGINT UNSIGNED NOT NULL,
  month_name VARCHAR(32) NOT NULL,
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY fk_tps_trend (trend_id),
  CONSTRAINT fk_tps_trend FOREIGN KEY (trend_id) REFERENCES tourism_trends(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE tourism_underutilized (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  trend_id BIGINT UNSIGNED NOT NULL,
  destination_name VARCHAR(255) NOT NULL,
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY fk_tuu_trend (trend_id),
  CONSTRAINT fk_tuu_trend FOREIGN KEY (trend_id) REFERENCES tourism_trends(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE tourism_demand_gaps (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  trend_id BIGINT UNSIGNED NOT NULL,
  district VARCHAR(128) NOT NULL,
  category ENUM('hotels','transport','infrastructure','attractions') NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('high','medium','low') NOT NULL,
  PRIMARY KEY (id),
  KEY fk_tdg_trend (trend_id),
  CONSTRAINT fk_tdg_trend FOREIGN KEY (trend_id) REFERENCES tourism_trends(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE seasonal_analysis (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  season VARCHAR(64) NOT NULL,
  average_footfall INT UNSIGNED NOT NULL,
  peak_days INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_season_name (season)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE seasonal_analysis_months (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  seasonal_id BIGINT UNSIGNED NOT NULL,
  month_name VARCHAR(32) NOT NULL,
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY fk_sam_season (seasonal_id),
  CONSTRAINT fk_sam_season FOREIGN KEY (seasonal_id) REFERENCES seasonal_analysis(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE seasonal_analysis_actions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  seasonal_id BIGINT UNSIGNED NOT NULL,
  action_text TEXT NOT NULL,
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY fk_saa_season (seasonal_id),
  CONSTRAINT fk_saa_season FOREIGN KEY (seasonal_id) REFERENCES seasonal_analysis(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE tourist_entry_points (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  location VARCHAR(255) NOT NULL,
  domestic INT UNSIGNED NOT NULL,
  international INT UNSIGNED NOT NULL,
  total INT UNSIGNED NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE footfall_monument_baseline (
  monument_id VARCHAR(64) NOT NULL COMMENT 'Keys used in getRealTimeFootfall baseCounts',
  base_total INT UNSIGNED NOT NULL COMMENT 'base.base simulated visitor scale',
  domestic_ratio DECIMAL(4,3) NOT NULL COMMENT '0-1 fraction domestic',
  PRIMARY KEY (monument_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`-- Time-series from footfall.ts (generated in app; no static seed — your API can INSERT)`);
q(`CREATE TABLE footfall_realtime_reading (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  monument_id VARCHAR(64) NOT NULL,
  monument_name VARCHAR(255) NOT NULL,
  recorded_at DATETIME(3) NOT NULL COMMENT 'timestamp ISO from FootfallData',
  domestic_count INT UNSIGNED NOT NULL,
  international_count INT UNSIGNED NOT NULL,
  total_count INT UNSIGNED NOT NULL,
  crowd_level ENUM('low','medium','high','critical') NOT NULL,
  peak_hour TINYINT(1) NOT NULL COMMENT 'FootfallData.peakHour',
  PRIMARY KEY (id),
  KEY idx_frr_monument_time (monument_id, recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE footfall_daily (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  date DATE NOT NULL,
  monument_id VARCHAR(64) NOT NULL,
  monument_name VARCHAR(255) NOT NULL,
  total_visitors INT UNSIGNED NOT NULL,
  domestic_visitors INT UNSIGNED NOT NULL,
  international_visitors INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_daily_monument_date (monument_id, date),
  KEY idx_fd_monument (monument_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE footfall_daily_hourly (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  daily_id BIGINT UNSIGNED NOT NULL,
  hour TINYINT UNSIGNED NOT NULL COMMENT 'HourlyFootfall.hour 0-23',
  count INT UNSIGNED NOT NULL,
  domestic INT UNSIGNED NOT NULL,
  international INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY fk_fdh_daily (daily_id),
  CONSTRAINT fk_fdh_daily FOREIGN KEY (daily_id) REFERENCES footfall_daily(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE footfall_monthly_trend (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  monument_id VARCHAR(64) NOT NULL,
  month_name VARCHAR(32) NOT NULL,
  year INT NOT NULL,
  total_footfall INT UNSIGNED NOT NULL,
  domestic_footfall INT UNSIGNED NOT NULL,
  international_footfall INT UNSIGNED NOT NULL,
  average_daily INT UNSIGNED NOT NULL,
  peak_day VARCHAR(8) NOT NULL COMMENT 'MonthlyTrend.peakDay string day-of-month',
  peak_day_count INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY idx_fmt_monument_year (monument_id, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

q(`CREATE TABLE district_hotel_summary (
  district VARCHAR(128) NOT NULL,
  total_hotels INT UNSIGNED NOT NULL,
  total_rooms INT UNSIGNED NOT NULL,
  average_rating DECIMAL(3,1) NOT NULL,
  average_occupancy DECIMAL(5,1) NOT NULL,
  price_count_budget INT UNSIGNED NOT NULL,
  price_count_mid_range INT UNSIGNED NOT NULL,
  price_count_luxury INT UNSIGNED NOT NULL,
  price_count_premium INT UNSIGNED NOT NULL,
  PRIMARY KEY (district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
q('');

function insertMonuments(arr, city) {
  const vals = arr.map((m) => {
    return `(${esc(m.id)},${esc(city)},${esc(m.name)},${esc(m.nameHindi)},${esc(m.nameFrench)},${esc(m.location)},${num(m.coordinates.lat)},${num(m.coordinates.lng)},${esc(m.historicalInfo.en)},${esc(m.historicalInfo.hi)},${esc(m.historicalInfo.fr)},${esc(m.bestTime)},${esc(m.crowdLevel)},${esc(m.visitingHours)},${esc(m.safetyAdvisory.en)},${esc(m.safetyAdvisory.hi)},${esc(m.safetyAdvisory.fr)},${esc(m.category)})`;
  });
  q(`INSERT INTO monuments (id, city_code, name, name_hindi, name_french, location, lat, lng, historical_info_en, historical_info_hi, historical_info_fr, best_time, crowd_level, visiting_hours, safety_advisory_en, safety_advisory_hi, safety_advisory_fr, category) VALUES`);
  q(vals.join(',\n') + ';');
}

q('-- ========== SEED: monuments (delhiMonuments + jaipurMonuments) ==========');
insertMonuments(delhiMonuments, 'delhi');
insertMonuments(jaipurMonuments, 'jaipur');
q('');

const demoPasswordHash = bcrypt.hashSync('demo123', 10);
q('-- ========== SEED: users (signup page fields) + demo login from login/page.tsx ==========');
q(
  `INSERT INTO users (email, password_hash, full_name, phone, user_type, address, aadhaar, passport_number, visa_number, country, nationality) VALUES (${esc('demo@swayatra.in')},${esc(demoPasswordHash)},${esc('Demo User')},${esc('+919999999999')},'indian',${esc('Demo Address, Jaipur, Rajasthan 302001')},${esc('123456789012')},NULL,NULL,NULL,NULL);`
);
q(`SET @demo_user_id := LAST_INSERT_ID();`);

const demoBookingId = 'SWA-DEMO-SEED-001';
const demoQrPayload = JSON.stringify({
  bookingId: demoBookingId,
  placeId: 'hawa-mahal',
  placeName: 'Hawa Mahal',
  date: '2026-04-15',
  time: '10:00',
  visitors: 2,
  name: 'Demo User',
  email: 'demo@swayatra.in',
  amount: 100,
  paymentId: 'PAY-SEED-001',
});
q('-- ========== SEED: bookings (utils/database.ts Booking shape + BookingModal) ==========');
q(
  `INSERT INTO bookings (id, user_id, place_id, place_name, visit_date, visit_time, visitors, contact_name, email, phone, amount, payment_status, payment_id, qr_code_payload, status, created_at) VALUES (${esc(demoBookingId)},@demo_user_id,${esc('hawa-mahal')},${esc('Hawa Mahal')},'2026-04-15',${esc('10:00')},2,${esc('Demo User')},${esc('demo@swayatra.in')},${esc('+919999999999')},100.00,'completed',${esc('PAY-SEED-001')},${esc(demoQrPayload)},'confirmed','2026-04-01 10:00:00.000');`
);
q('');

function insertRecommendations(arr) {
  const vals = arr.map((r) => {
    const contact = r.contact != null ? esc(r.contact) : 'NULL';
    return `(${esc(r.id)},${esc(r.type)},${esc(r.name)},${esc(r.nameHindi)},${esc(r.nameFrench)},${esc(r.description.en)},${esc(r.description.hi)},${esc(r.description.fr)},${esc(r.location)},${num(r.rating)},${esc(r.priceRange)},${r.verified ? 1 : 0},${contact})`;
  });
  q(`INSERT INTO recommendations (id, type, name, name_hindi, name_french, description_en, description_hi, description_fr, location, rating, price_range, verified, contact) VALUES`);
  q(vals.join(',\n') + ';');
}

const allRec = [...localFood, ...verifiedGuides, ...transportOptions];
q('-- ========== SEED: recommendations (localFood + verifiedGuides + transportOptions) ==========');
insertRecommendations(allRec);
q('');

q('-- ========== SEED: hotels (jaipurHotels) ==========');
q(`INSERT INTO hotels (id, name, district, location, rating, total_rooms, available_rooms, price_range, category, lat, lng, occupancy_rate, verified) VALUES`);
q(
  jaipurHotels
    .map(
      (h) =>
        `(${esc(h.id)},${esc(h.name)},${esc(h.district)},${esc(h.location)},${num(h.rating)},${num(h.totalRooms)},${num(h.availableRooms)},${esc(h.priceRange)},${esc(h.category)},${num(h.coordinates.lat)},${num(h.coordinates.lng)},${num(h.occupancyRate)},${h.verified ? 1 : 0})`
    )
    .join(',\n') + ';'
);
q('');

const year = 2026;
const trend = getTourismTrends(year);
q('-- ========== SEED: tourism trends (getTourismTrends(' + year + ')) ==========');
q(`INSERT INTO tourism_trends (year, period, total_tourists, domestic_tourists, international_tourists, growth_rate) VALUES (${year},${esc(trend.period)},${num(trend.totalTourists)},${num(trend.domesticTourists)},${num(trend.internationalTourists)},${num(trend.growthRate)});`);
q(`SET @trend_id := LAST_INSERT_ID();`);
q('');

q(`INSERT INTO tourism_top_destinations (trend_id, monument_id, name, visitor_count, growth_rate) VALUES`);
q(
  trend.topDestinations
    .map(
      (d, i) =>
        `(@trend_id,${esc(d.monumentId)},${esc(d.name)},${num(d.visitorCount)},${num(d.growth)})`
    )
    .join(',\n') + ';'
);
q('');

q(`INSERT INTO tourism_peak_seasons (trend_id, month_name, sort_order) VALUES`);
q(
  trend.peakSeasons
    .map((m, i) => `(@trend_id,${esc(m)},${i})`)
    .join(',\n') + ';'
);
q('');

q(`INSERT INTO tourism_underutilized (trend_id, destination_name, sort_order) VALUES`);
q(
  trend.underutilizedDestinations
    .map((d, i) => `(@trend_id,${esc(d)},${i})`)
    .join(',\n') + ';'
);
q('');

q(`INSERT INTO tourism_demand_gaps (trend_id, district, category, description, priority) VALUES`);
q(
  trend.demandGaps
    .map(
      (g) =>
        `(@trend_id,${esc(g.district)},${esc(g.category)},${esc(g.description)},${esc(g.priority)})`
    )
    .join(',\n') + ';'
);
q('');

const seasons = getSeasonalAnalysis();
q('-- ========== SEED: seasonal_analysis (getSeasonalAnalysis) ==========');
for (const s of seasons) {
  q(`INSERT INTO seasonal_analysis (season, average_footfall, peak_days) VALUES (${esc(s.season)},${num(s.averageFootfall)},${num(s.peakDays)});`);
  q(`SET @season_id := LAST_INSERT_ID();`);
  s.months.forEach((month, i) => {
    q(`INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,${esc(month)},${i});`);
  });
  s.recommendedActions.forEach((a, i) => {
    q(`INSERT INTO seasonal_analysis_actions (seasonal_id, action_text, sort_order) VALUES (@season_id,${esc(a)},${i});`);
  });
}
q('');

q('-- ========== SEED: tourist_entry_points (getTouristEntryPoints) ==========');
q(`INSERT INTO tourist_entry_points (location, domestic, international, total) VALUES`);
q(
  getTouristEntryPoints()
    .map((e) => `(${esc(e.location)},${num(e.domestic)},${num(e.international)},${num(e.total)})`)
    .join(',\n') + ';'
);
q('');

const baselines = [
  ['hawa-mahal', 450, 0.75],
  ['amber-fort', 680, 0.7],
  ['city-palace', 520, 0.72],
  ['jantar-mantar', 380, 0.78],
  ['nahargarh-fort', 290, 0.8],
  ['jal-mahal', 220, 0.75],
];
q('-- ========== SEED: footfall_monument_baseline (getRealTimeFootfall baseCounts in footfall.ts) ==========');
q(`INSERT INTO footfall_monument_baseline (monument_id, base_total, domestic_ratio) VALUES`);
q(baselines.map((b) => `(${esc(b[0])},${num(b[1])},${num(b[2])})`).join(',\n') + ';');
q('');

const district = 'Jaipur';
const districtHotels = jaipurHotels.filter((h) => h.district === district);
const totalHotels = districtHotels.length;
const totalRooms = districtHotels.reduce((sum, h) => sum + h.totalRooms, 0);
const averageRating =
  Math.round((districtHotels.reduce((sum, h) => sum + h.rating, 0) / totalHotels) * 10) / 10;
const averageOccupancy =
  Math.round((districtHotels.reduce((sum, h) => sum + h.occupancyRate, 0) / totalHotels) * 10) / 10;
const pd = {
  budget: districtHotels.filter((h) => h.priceRange === 'budget').length,
  mid: districtHotels.filter((h) => h.priceRange === 'mid-range').length,
  luxury: districtHotels.filter((h) => h.priceRange === 'luxury').length,
  premium: districtHotels.filter((h) => h.priceRange === 'premium').length,
};

q('-- ========== SEED: district_hotel_summary (same logic as getDistrictHotelStats) ==========');
q(
  `INSERT INTO district_hotel_summary (district, total_hotels, total_rooms, average_rating, average_occupancy, price_count_budget, price_count_mid_range, price_count_luxury, price_count_premium) VALUES (${esc(district)},${num(totalHotels)},${num(totalRooms)},${num(averageRating)},${num(averageOccupancy)},${num(pd.budget)},${num(pd.mid)},${num(pd.luxury)},${num(pd.premium)});`
);

q('');
q('SET FOREIGN_KEY_CHECKS = 1;');

const outPath = path.join(__dirname, 'swayatra_schema_seed.sql');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('Wrote', outPath, 'lines', lines.length);
