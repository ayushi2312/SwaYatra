SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS swayatra CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE swayatra;

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS seasonal_analysis_actions;
DROP TABLE IF EXISTS seasonal_analysis_months;
DROP TABLE IF EXISTS seasonal_analysis;
DROP TABLE IF EXISTS tourist_entry_points;
DROP TABLE IF EXISTS tourism_demand_gaps;
DROP TABLE IF EXISTS tourism_underutilized;
DROP TABLE IF EXISTS tourism_peak_seasons;
DROP TABLE IF EXISTS tourism_top_destinations;
DROP TABLE IF EXISTS tourism_trends;
DROP TABLE IF EXISTS footfall_daily_hourly;
DROP TABLE IF EXISTS footfall_daily;
DROP TABLE IF EXISTS footfall_monthly_trend;
DROP TABLE IF EXISTS footfall_realtime_reading;
DROP TABLE IF EXISTS footfall_monument_baseline;
DROP TABLE IF EXISTS district_hotel_summary;
DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS hotels;
DROP TABLE IF EXISTS monuments;

CREATE TABLE monuments (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bookings (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE recommendations (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE hotels (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tourism_trends (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  year INT NOT NULL COMMENT 'Matches getTourismTrends(year); period is string year',
  period VARCHAR(16) NOT NULL COMMENT 'Same as period in TS (string year)',
  total_tourists BIGINT UNSIGNED NOT NULL,
  domestic_tourists BIGINT UNSIGNED NOT NULL,
  international_tourists BIGINT UNSIGNED NOT NULL,
  growth_rate DECIMAL(5,2) NOT NULL COMMENT 'Percent e.g. 8.50',
  PRIMARY KEY (id),
  UNIQUE KEY uq_tourism_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tourism_top_destinations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  trend_id BIGINT UNSIGNED NOT NULL,
  monument_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  visitor_count INT UNSIGNED NOT NULL,
  growth_rate DECIMAL(5,2) NOT NULL COMMENT 'TS field growth',
  PRIMARY KEY (id),
  KEY fk_ttd_trend (trend_id),
  CONSTRAINT fk_ttd_trend FOREIGN KEY (trend_id) REFERENCES tourism_trends(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tourism_peak_seasons (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  trend_id BIGINT UNSIGNED NOT NULL,
  month_name VARCHAR(32) NOT NULL,
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY fk_tps_trend (trend_id),
  CONSTRAINT fk_tps_trend FOREIGN KEY (trend_id) REFERENCES tourism_trends(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tourism_underutilized (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  trend_id BIGINT UNSIGNED NOT NULL,
  destination_name VARCHAR(255) NOT NULL,
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY fk_tuu_trend (trend_id),
  CONSTRAINT fk_tuu_trend FOREIGN KEY (trend_id) REFERENCES tourism_trends(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tourism_demand_gaps (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  trend_id BIGINT UNSIGNED NOT NULL,
  district VARCHAR(128) NOT NULL,
  category ENUM('hotels','transport','infrastructure','attractions') NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('high','medium','low') NOT NULL,
  PRIMARY KEY (id),
  KEY fk_tdg_trend (trend_id),
  CONSTRAINT fk_tdg_trend FOREIGN KEY (trend_id) REFERENCES tourism_trends(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE seasonal_analysis (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  season VARCHAR(64) NOT NULL,
  average_footfall INT UNSIGNED NOT NULL,
  peak_days INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_season_name (season)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE seasonal_analysis_months (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  seasonal_id BIGINT UNSIGNED NOT NULL,
  month_name VARCHAR(32) NOT NULL,
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY fk_sam_season (seasonal_id),
  CONSTRAINT fk_sam_season FOREIGN KEY (seasonal_id) REFERENCES seasonal_analysis(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE seasonal_analysis_actions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  seasonal_id BIGINT UNSIGNED NOT NULL,
  action_text TEXT NOT NULL,
  sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY fk_saa_season (seasonal_id),
  CONSTRAINT fk_saa_season FOREIGN KEY (seasonal_id) REFERENCES seasonal_analysis(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tourist_entry_points (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  location VARCHAR(255) NOT NULL,
  domestic INT UNSIGNED NOT NULL,
  international INT UNSIGNED NOT NULL,
  total INT UNSIGNED NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE footfall_monument_baseline (
  monument_id VARCHAR(64) NOT NULL COMMENT 'Keys used in getRealTimeFootfall baseCounts',
  base_total INT UNSIGNED NOT NULL COMMENT 'base.base simulated visitor scale',
  domestic_ratio DECIMAL(4,3) NOT NULL COMMENT '0-1 fraction domestic',
  PRIMARY KEY (monument_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Time-series from footfall.ts (generated in app; no static seed — your API can INSERT)
CREATE TABLE footfall_realtime_reading (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE footfall_daily (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE footfall_daily_hourly (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  daily_id BIGINT UNSIGNED NOT NULL,
  hour TINYINT UNSIGNED NOT NULL COMMENT 'HourlyFootfall.hour 0-23',
  count INT UNSIGNED NOT NULL,
  domestic INT UNSIGNED NOT NULL,
  international INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY fk_fdh_daily (daily_id),
  CONSTRAINT fk_fdh_daily FOREIGN KEY (daily_id) REFERENCES footfall_daily(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE footfall_monthly_trend (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE district_hotel_summary (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========== SEED: monuments (delhiMonuments + jaipurMonuments) ==========
INSERT INTO monuments (id, city_code, name, name_hindi, name_french, location, lat, lng, historical_info_en, historical_info_hi, historical_info_fr, best_time, crowd_level, visiting_hours, safety_advisory_en, safety_advisory_hi, safety_advisory_fr, category) VALUES
('red-fort','delhi','Red Fort','लाल किला','Fort Rouge','Netaji Subhash Marg, Old Delhi',28.6562,77.241,'Built in 1639 by Mughal Emperor Shah Jahan, the Red Fort served as the main residence of Mughal emperors. It is a UNESCO World Heritage Site and a symbol of India''s rich history. The fort houses several museums and is famous for its red sandstone walls.','1639 में मुगल सम्राट शाहजहाँ द्वारा निर्मित, लाल किला मुगल सम्राटों का मुख्य निवास स्थान था। यह यूनेस्को विश्व धरोहर स्थल है और भारत के समृद्ध इतिहास का प्रतीक है।','Construit en 1639 par l''empereur moghol Shah Jahan, le Fort Rouge a servi de résidence principale aux empereurs moghols. C''est un site du patrimoine mondial de l''UNESCO.','Early morning (7-9 AM) or evening (4-6 PM)','high','9:30 AM - 4:30 PM (Closed on Mondays)','Wear comfortable shoes. Avoid peak hours. Photography allowed. Light and sound show available in evenings.','आरामदायक जूते पहनें। चरम घंटों से बचें। फोटोग्राफी की अनुमति है।','Portez des chaussures confortables. Évitez les heures de pointe. Photographie autorisée.','fort'),
('qutub-minar','delhi','Qutub Minar','कुतुब मीनार','Qutub Minar','Mehrauli, New Delhi',28.5245,77.1855,'Built in 1193 by Qutb-ud-din Aibak, Qutub Minar is a 73-meter tall minaret and a UNESCO World Heritage Site. It is the tallest brick minaret in the world and represents the beginning of Muslim rule in India.','1193 में कुतुब-उद-दीन ऐबक द्वारा निर्मित, कुतुब मीनार 73 मीटर ऊंची मीनार है और यूनेस्को विश्व धरोहर स्थल है। यह दुनिया की सबसे ऊंची ईंट की मीनार है।','Construit en 1193 par Qutb-ud-din Aibak, Qutub Minar est un minaret de 73 mètres de haut et un site du patrimoine mondial de l''UNESCO.','Early morning (8-10 AM)','high','7:00 AM - 5:00 PM','Entry to the minaret is restricted. Best viewed from the ground. Wear comfortable walking shoes.','मीनार में प्रवेश प्रतिबंधित है। जमीन से सबसे अच्छा दृश्य। आरामदायक चलने वाले जूते पहनें।','L''entrée au minaret est restreinte. Meilleure vue depuis le sol.','monument'),
('india-gate','delhi','India Gate','इंडिया गेट','Porte de l''Inde','Rajpath, New Delhi',28.6129,77.2295,'Built in 1931, India Gate is a war memorial dedicated to 70,000 Indian soldiers who died in World War I. Designed by Sir Edwin Lutyens, it stands 42 meters tall and is surrounded by lush green lawns.','1931 में निर्मित, इंडिया गेट प्रथम विश्व युद्ध में शहीद हुए 70,000 भारतीय सैनिकों को समर्पित एक युद्ध स्मारक है।','Construit en 1931, l''India Gate est un mémorial de guerre dédié aux 70 000 soldats indiens morts pendant la Première Guerre mondiale.','Evening (5-8 PM) for lighting','high','Open 24 hours','Very popular in evenings. Great for photography. Food vendors available nearby. Well-lit area.','शाम को बहुत लोकप्रिय। फोटोग्राफी के लिए बढ़िया। आस-पास खाने के विक्रेता उपलब्ध हैं।','Très populaire le soir. Idéal pour la photographie.','monument'),
('lotus-temple','delhi','Lotus Temple','कमल मंदिर','Temple du Lotus','Bahapur, Kalkaji, New Delhi',28.5535,77.2588,'Completed in 1986, the Lotus Temple is a Bahá''í House of Worship known for its flower-like architecture. It is one of the most visited buildings in the world, welcoming people of all faiths.','1986 में पूर्ण, कमल मंदिर अपनी फूल जैसी वास्तुकला के लिए जाना जाने वाला बहाई उपासना स्थल है।','Terminé en 1986, le Temple du Lotus est une Maison d''adoration bahá''íe connue pour son architecture en forme de fleur.','Morning (9-11 AM) or evening (4-6 PM)','medium','9:00 AM - 7:00 PM (Closed on Mondays)','Maintain silence inside. Remove shoes before entry. Photography allowed outside only.','अंदर शांति बनाए रखें। प्रवेश से पहले जूते उतारें। केवल बाहर फोटोग्राफी की अनुमति है।','Maintenez le silence à l''intérieur. Retirez les chaussures avant l''entrée.','temple'),
('humayun-tomb','delhi','Humayun''s Tomb','हुमायूं का मकबरा','Tombe de Humayun','Mathura Road, Nizamuddin, New Delhi',28.5933,77.2507,'Built in 1570, Humayun''s Tomb is the first garden-tomb in India and a UNESCO World Heritage Site. It inspired the design of the Taj Mahal. The tomb is set in a beautiful Mughal garden.','1570 में निर्मित, हुमायूं का मकबरा भारत में पहला बगीचा-मकबरा है और यूनेस्को विश्व धरोहर स्थल है। इसने ताज महल के डिजाइन को प्रेरित किया।','Construit en 1570, le Tombeau de Humayun est le premier tombeau-jardin en Inde et un site du patrimoine mondial de l''UNESCO.','Early morning (8-10 AM)','medium','6:00 AM - 6:00 PM','Beautiful gardens for photography. Wear comfortable shoes. Best visited in winter months.','फोटोग्राफी के लिए सुंदर बगीचे। आरामदायक जूते पहनें। सर्दियों के महीनों में सबसे अच्छा दौरा।','Beaux jardins pour la photographie. Portez des chaussures confortables.','monument'),
('jama-masjid','delhi','Jama Masjid','जामा मस्जिद','Jama Masjid','Chandni Chowk, Old Delhi',28.6507,77.2334,'Built in 1656 by Shah Jahan, Jama Masjid is one of the largest mosques in India. It can accommodate 25,000 worshippers. The mosque features three domes, two minarets, and is made of red sandstone and white marble.','1656 में शाहजहाँ द्वारा निर्मित, जामा मस्जिद भारत की सबसे बड़ी मस्जिदों में से एक है। यह 25,000 उपासकों को समायोजित कर सकती है।','Construite en 1656 par Shah Jahan, Jama Masjid est l''une des plus grandes mosquées d''Inde.','Early morning (6-8 AM) or evening (5-7 PM)','high','7:00 AM - 12:00 PM, 1:30 PM - 6:30 PM','Dress modestly. Remove shoes before entry. Non-Muslims can visit outside prayer times. Climb minaret for panoramic views.','विनम्र कपड़े पहनें। प्रवेश से पहले जूते उतारें। गैर-मुस्लिम प्रार्थना के समय के बाहर जा सकते हैं।','Habillez-vous modestement. Retirez les chaussures avant l''entrée.','temple'),
('akshardham','delhi','Akshardham Temple','अक्षरधाम मंदिर','Temple Akshardham','Noida Mor, Pandav Nagar, New Delhi',28.6127,77.2773,'Opened in 2005, Akshardham is a modern Hindu temple complex showcasing Indian culture, spirituality, and architecture. It features intricate carvings, exhibitions, and a musical fountain show.','2005 में खोला गया, अक्षरधाम एक आधुनिक हिंदू मंदिर परिसर है जो भारतीय संस्कृति, आध्यात्मिकता और वास्तुकला को प्रदर्शित करता है।','Ouvert en 2005, Akshardham est un complexe de temples hindous moderne présentant la culture, la spiritualité et l''architecture indiennes.','Morning (9-11 AM) or evening (4-6 PM)','high','9:30 AM - 6:30 PM (Closed on Mondays)','No photography or mobile phones allowed inside. Free entry. Musical fountain show in evenings. Allow 3-4 hours for complete visit.','अंदर फोटोग्राफी या मोबाइल फोन की अनुमति नहीं है। निःशुल्क प्रवेश।','Aucune photographie ou téléphone portable autorisé à l''intérieur. Entrée gratuite.','temple'),
('purana-qila','delhi','Purana Qila','पुराना किला','Purana Qila','Mathura Road, New Delhi',28.6092,77.2434,'Purana Qila (Old Fort) is one of the oldest forts in Delhi, believed to be the site of the ancient city of Indraprastha. The fort houses several historical structures and offers light and sound shows.','पुराना किला दिल्ली के सबसे पुराने किलों में से एक है, जिसे प्राचीन शहर इंद्रप्रस्थ का स्थान माना जाता है।','Purana Qila (Vieux Fort) est l''un des plus anciens forts de Delhi, considéré comme le site de l''ancienne ville d''Indraprastha.','Evening (5-7 PM) for light show','low','7:00 AM - 5:00 PM','Less crowded than other monuments. Good for photography. Light and sound show available.','अन्य स्मारकों की तुलना में कम भीड़। फोटोग्राफी के लिए अच्छा।','Moins fréquenté que les autres monuments. Bon pour la photographie.','fort');
INSERT INTO monuments (id, city_code, name, name_hindi, name_french, location, lat, lng, historical_info_en, historical_info_hi, historical_info_fr, best_time, crowd_level, visiting_hours, safety_advisory_en, safety_advisory_hi, safety_advisory_fr, category) VALUES
('hawa-mahal','jaipur','Hawa Mahal','हवा महल','Palais des Vents','Badi Choupad, Jaipur',26.9239,75.8267,'Built in 1799 by Maharaja Sawai Pratap Singh, this five-story palace features 953 small windows (jharokhas) designed for royal women to observe street festivals without being seen. The unique honeycomb structure allows cool air to flow through, giving it the name "Palace of Winds."','1799 में महाराजा सवाई प्रताप सिंह द्वारा निर्मित, यह पांच मंजिला महल 953 छोटी खिड़कियों (झरोखों) से सुसज्जित है, जो शाही महिलाओं के लिए बिना देखे गली के उत्सव देखने के लिए बनाई गई थीं।','Construit en 1799 par le Maharaja Sawai Pratap Singh, ce palais de cinq étages compte 953 petites fenêtres (jharokhas) conçues pour que les femmes royales puissent observer les festivals de rue sans être vues.','Early morning (7-9 AM) or late afternoon (4-6 PM)','high','9:00 AM - 4:30 PM','Wear comfortable shoes for climbing. Avoid peak hours (11 AM - 2 PM) for better experience.','चढ़ने के लिए आरामदायक जूते पहनें। बेहतर अनुभव के लिए चरम घंटों (11 AM - 2 PM) से बचें।','Portez des chaussures confortables pour monter. Évitez les heures de pointe (11h-14h) pour une meilleure expérience.','palace'),
('amber-fort','jaipur','Amber Fort','आमेर किला','Fort d''Amber','Amer, Jaipur',26.9855,75.8513,'A magnificent fort built in 1592 by Raja Man Singh I. The fort complex includes the Diwan-i-Aam, Diwan-i-Khas, Sheesh Mahal (Palace of Mirrors), and Sukh Niwas. It showcases a blend of Hindu and Mughal architecture.','1592 में राजा मान सिंह प्रथम द्वारा निर्मित एक भव्य किला। किला परिसर में दीवान-ए-आम, दीवान-ए-खास, शीश महल और सुख निवास शामिल हैं।','Un fort magnifique construit en 1592 par Raja Man Singh I. Le complexe du fort comprend le Diwan-i-Aam, Diwan-i-Khas, Sheesh Mahal et Sukh Niwas.','Early morning (8-10 AM)','high','8:00 AM - 6:00 PM','Elephant rides available but consider ethical alternatives. Wear comfortable walking shoes. Stay hydrated.','हाथी की सवारी उपलब्ध है लेकिन नैतिक विकल्पों पर विचार करें। आरामदायक चलने वाले जूते पहनें। हाइड्रेटेड रहें।','Balades à dos d''éléphant disponibles mais considérez des alternatives éthiques. Portez des chaussures de marche confortables.','fort'),
('city-palace','jaipur','City Palace','सिटी पैलेस','Palais de la Ville','Tulsi Marg, Jaipur',26.9258,75.8236,'Built between 1729-1732 by Maharaja Sawai Jai Singh II, the founder of Jaipur. The palace complex includes courtyards, gardens, and buildings. It houses museums with royal artifacts, weapons, and textiles.','1729-1732 में जयपुर के संस्थापक महाराजा सवाई जय सिंह द्वितीय द्वारा निर्मित। महल परिसर में आंगन, बगीचे और इमारतें शामिल हैं।','Construit entre 1729-1732 par le Maharaja Sawai Jai Singh II, fondateur de Jaipur. Le complexe du palais comprend des cours, des jardins et des bâtiments.','Morning (9-11 AM)','medium','9:30 AM - 5:00 PM','Photography allowed in most areas. Guided tours recommended for better understanding.','अधिकांश क्षेत्रों में फोटोग्राफी की अनुमति है। बेहतर समझ के लिए निर्देशित दौरे की सिफारिश की जाती है।','Photographie autorisée dans la plupart des zones. Visites guidées recommandées.','palace'),
('jantar-mantar','jaipur','Jantar Mantar','जंतर मंतर','Jantar Mantar','Gangori Bazaar, Jaipur',26.9247,75.8246,'An astronomical observatory built in 1734 by Maharaja Sawai Jai Singh II. It features 19 architectural astronomical instruments, including the world''s largest stone sundial. A UNESCO World Heritage Site.','1734 में महाराजा सवाई जय सिंह द्वितीय द्वारा निर्मित एक खगोलीय वेधशाला। इसमें 19 वास्तुशिल्प खगोलीय उपकरण शामिल हैं।','Un observatoire astronomique construit en 1734 par le Maharaja Sawai Jai Singh II. Il comprend 19 instruments astronomiques architecturaux.','Morning (9-11 AM) or late afternoon (4-5 PM)','medium','9:00 AM - 4:30 PM','Best visited with a guide to understand the astronomical instruments. Avoid midday sun.','खगोलीय उपकरणों को समझने के लिए गाइड के साथ सबसे अच्छा दौरा। दोपहर की धूप से बचें।','Meilleure visite avec un guide pour comprendre les instruments astronomiques.','museum'),
('nahargarh-fort','jaipur','Nahargarh Fort','नाहरगढ़ किला','Fort de Nahargarh','Krishna Nagar, Jaipur',26.9364,75.8153,'Built in 1734, this fort offers panoramic views of Jaipur. It was originally named Sudarshangarh but later renamed Nahargarh. The fort houses Madhavendra Bhawan, a palace with suites for the king and his queens.','1734 में निर्मित, यह किला जयपुर का मनोरम दृश्य प्रस्तुत करता है। मूल रूप से सुदर्शनगढ़ नामित, बाद में नाहरगढ़ नाम दिया गया।','Construit en 1734, ce fort offre une vue panoramique sur Jaipur. Il abrite Madhavendra Bhawan, un palais avec des suites pour le roi et ses reines.','Evening (5-7 PM) for sunset views','low','10:00 AM - 5:30 PM','Popular for sunset views. Arrive early to secure a good spot. Drive carefully on the winding road.','सूर्यास्त के दृश्यों के लिए लोकप्रिय। अच्छी जगह सुरक्षित करने के लिए जल्दी पहुंचें।','Populaire pour les vues sur le coucher du soleil. Arrivez tôt pour avoir une bonne place.','fort'),
('jal-mahal','jaipur','Jal Mahal','जल महल','Palais de l''Eau','Amer Road, Jaipur',26.9532,75.8467,'A palace built in the middle of Man Sagar Lake in 1799. The palace appears to float on water. Currently, entry inside is restricted, but the view from the banks is spectacular, especially during sunset.','1799 में मान सागर झील के बीच में बना एक महल। महल पानी पर तैरता हुआ दिखाई देता है।','Un palais construit au milieu du lac Man Sagar en 1799. Le palais semble flotter sur l''eau.','Early morning or evening for photography','low','Viewing from banks: All day','Best viewed from the banks. Entry inside currently restricted. Great for photography during golden hour.','किनारों से सबसे अच्छा दृश्य। अंदर प्रवेश वर्तमान में प्रतिबंधित है।','Meilleure vue depuis les rives. Entrée à l''intérieur actuellement restreinte.','palace');

-- ========== SEED: users (signup page fields) + demo login from login/page.tsx ==========
INSERT INTO users (email, password_hash, full_name, phone, user_type, address, aadhaar, passport_number, visa_number, country, nationality) VALUES ('demo@swayatra.in','$2b$10$CgR62vJ1Q57zkDQqa4s6P.nAhwB97x8qyQwZ.w8Zif2bRsxwHJPX2','Demo User','+919999999999','indian','Demo Address, Jaipur, Rajasthan 302001','123456789012',NULL,NULL,NULL,NULL);
SET @demo_user_id := LAST_INSERT_ID();
-- ========== SEED: bookings (utils/database.ts Booking shape + BookingModal) ==========
INSERT INTO bookings (id, user_id, place_id, place_name, visit_date, visit_time, visitors, contact_name, email, phone, amount, payment_status, payment_id, qr_code_payload, status, created_at) VALUES ('SWA-DEMO-SEED-001',@demo_user_id,'hawa-mahal','Hawa Mahal','2026-04-15','10:00',2,'Demo User','demo@swayatra.in','+919999999999',100.00,'completed','PAY-SEED-001','{"bookingId":"SWA-DEMO-SEED-001","placeId":"hawa-mahal","placeName":"Hawa Mahal","date":"2026-04-15","time":"10:00","visitors":2,"name":"Demo User","email":"demo@swayatra.in","amount":100,"paymentId":"PAY-SEED-001"}','confirmed','2026-04-01 10:00:00.000');

-- ========== SEED: recommendations (localFood + verifiedGuides + transportOptions) ==========
INSERT INTO recommendations (id, type, name, name_hindi, name_french, description_en, description_hi, description_fr, location, rating, price_range, verified, contact) VALUES
('laxmi-misthan','food','Laxmi Misthan Bhandar','लक्ष्मी मिष्ठान भंडार','Laxmi Misthan Bhandar','Famous for traditional Rajasthani sweets and snacks. Try the pyaaz kachori and ghevar. Established in 1954.','पारंपरिक राजस्थानी मिठाई और नमकीन के लिए प्रसिद्ध। प्याज कचौड़ी और घेवर आज़माएं।','Célèbre pour les sucreries et snacks traditionnels du Rajasthan. Essayez le pyaaz kachori et ghevar.','Johari Bazaar, Jaipur',4.5,'budget',1,'+91-141-2565844'),
('chokhi-dhani','food','Chokhi Dhani','छोखी धानी','Chokhi Dhani','Authentic Rajasthani village experience with traditional thali, folk performances, and cultural activities. Best for dinner experience.','पारंपरिक थाली, लोक प्रदर्शन और सांस्कृतिक गतिविधियों के साथ प्रामाणिक राजस्थानी गांव का अनुभव।','Expérience authentique de village rajasthani avec thali traditionnel, spectacles folkloriques et activités culturelles.','Tonk Road, Jaipur',4.3,'moderate',1,'+91-141-5165000'),
('rawat-mishthan','food','Rawat Mishthan Bhandar','रावत मिष्ठान भंडार','Rawat Mishthan Bhandar','Iconic breakfast spot. Famous for pyaaz kachori, mawa kachori, and samosa. Must-visit for authentic local flavors.','प्रतिष्ठित नाश्ता स्थल। प्याज कचौड़ी, मावा कचौड़ी और समोसा के लिए प्रसिद्ध।','Point de petit-déjeuner emblématique. Célèbre pour pyaaz kachori, mawa kachori et samosa.','Station Road, Jaipur',4.4,'budget',1,NULL),
('guide-rajesh','guide','Rajesh Kumar - Certified Heritage Guide','राजेश कुमार - प्रमाणित विरासत गाइड','Rajesh Kumar - Guide du Patrimoine Certifié','15+ years experience. Specializes in Jaipur heritage, architecture, and history. Fluent in English, Hindi. Government certified.','15+ वर्ष का अनुभव। जयपुर विरासत, वास्तुकला और इतिहास में विशेषज्ञ। अंग्रेजी, हिंदी में धाराप्रवाह।','15+ ans d''expérience. Spécialisé dans le patrimoine, l''architecture et l''histoire de Jaipur. Certifié gouvernement.','Jaipur',4.8,'moderate',1,'+91-98290-12345'),
('guide-priya','guide','Priya Sharma - Cultural Tour Specialist','प्रिया शर्मा - सांस्कृतिक यात्रा विशेषज्ञ','Priya Sharma - Spécialiste des Visites Culturelles','Expert in Rajasthani culture, traditions, and local insights. Great for family tours. Available for half-day and full-day tours.','राजस्थानी संस्कृति, परंपराओं और स्थानीय अंतर्दृष्टि में विशेषज्ञ। परिवार के दौरे के लिए बढ़िया।','Experte en culture rajasthani, traditions et aperçus locaux. Idéale pour les visites familiales.','Jaipur',4.7,'moderate',1,'+91-98765-43210'),
('auto-rickshaw','transport','Auto Rickshaw','ऑटो रिक्शा','Auto-rickshaw','Most economical for short distances. Always negotiate fare before boarding. Typical fare: ₹30-50 per km.','छोटी दूरी के लिए सबसे किफायती। चढ़ने से पहले हमेशा किराया तय करें।','Le plus économique pour les courtes distances. Toujours négocier le tarif avant de monter.','Available throughout Jaipur',4,'budget',1,NULL),
('ola-uber','transport','Ola / Uber','ओला / उबर','Ola / Uber','App-based cab service. Reliable, air-conditioned, and safe. Best for longer distances and airport transfers.','ऐप-आधारित कैब सेवा। विश्वसनीय, वातानुकूलित और सुरक्षित।','Service de taxi basé sur application. Fiable, climatisé et sûr.','Available throughout Jaipur',4.5,'moderate',1,NULL),
('heritage-walk','transport','Heritage Walk Tours','विरासत पैदल यात्रा','Visites à Pied du Patrimoine','Guided walking tours through old Jaipur. Explore narrow lanes, local markets, and hidden gems. Duration: 2-3 hours.','पुराने जयपुर के माध्यम से निर्देशित पैदल यात्रा। संकीर्ण गलियों, स्थानीय बाजारों का अन्वेषण करें।','Visites guidées à pied dans le vieux Jaipur. Explorez les ruelles étroites et les marchés locaux.','Old City, Jaipur',4.6,'moderate',1,NULL);

-- ========== SEED: hotels (jaipurHotels) ==========
INSERT INTO hotels (id, name, district, location, rating, total_rooms, available_rooms, price_range, category, lat, lng, occupancy_rate, verified) VALUES
('hotel-1','Rambagh Palace','Jaipur','Bhawani Singh Road',4.8,78,12,'premium','heritage',26.8962,75.8064,84.6,1),
('hotel-2','The Oberoi Rajvilas','Jaipur','Goner Road',4.9,71,8,'luxury','resort',26.9124,75.7873,88.7,1),
('hotel-3','ITC Rajputana','Jaipur','Palace Road',4.6,218,45,'luxury','hotel',26.9205,75.7873,79.4,1),
('hotel-4','Holiday Inn','Jaipur','Tonk Road',4.3,150,38,'mid-range','hotel',26.9124,75.7873,74.7,1),
('hotel-5','Hotel Clarks Amer','Jaipur','Jawahar Lal Nehru Marg',4.2,180,52,'mid-range','hotel',26.9124,75.7873,71.1,1),
('hotel-6','Umaid Bhawan Heritage Hotel','Jaipur','Durgapura',4.5,45,12,'mid-range','heritage',26.85,75.8,73.3,1),
('hotel-7','Treebo Trend','Jaipur','C-Scheme',4,60,25,'budget','hotel',26.9124,75.7873,58.3,1),
('hotel-8','FabHotel Prime','Jaipur','Malviya Nagar',4.1,85,32,'budget','hotel',26.9124,75.7873,62.4,1);

-- ========== SEED: tourism trends (getTourismTrends(2026)) ==========
INSERT INTO tourism_trends (year, period, total_tourists, domestic_tourists, international_tourists, growth_rate) VALUES (2026,'2026',5425000,4068750,1356250,8.5);
SET @trend_id := LAST_INSERT_ID();

INSERT INTO tourism_top_destinations (trend_id, monument_id, name, visitor_count, growth_rate) VALUES
(@trend_id,'amber-fort','Amber Fort',1250000,12.5),
(@trend_id,'hawa-mahal','Hawa Mahal',980000,9.2),
(@trend_id,'city-palace','City Palace',850000,8.1),
(@trend_id,'jantar-mantar','Jantar Mantar',720000,7.5),
(@trend_id,'nahargarh-fort','Nahargarh Fort',450000,15.2);

INSERT INTO tourism_peak_seasons (trend_id, month_name, sort_order) VALUES
(@trend_id,'October',0),
(@trend_id,'November',1),
(@trend_id,'December',2),
(@trend_id,'January',3),
(@trend_id,'February',4),
(@trend_id,'March',5);

INSERT INTO tourism_underutilized (trend_id, destination_name, sort_order) VALUES
(@trend_id,'Jal Mahal',0),
(@trend_id,'Albert Hall Museum',1),
(@trend_id,'Galtaji Temple',2),
(@trend_id,'Sisodia Rani Garden',3);

INSERT INTO tourism_demand_gaps (trend_id, district, category, description, priority) VALUES
(@trend_id,'Jaipur','hotels','High demand for mid-range hotels during peak season (Oct-Mar)','high'),
(@trend_id,'Jaipur','transport','Need for better connectivity to Nahargarh Fort and Jal Mahal','medium'),
(@trend_id,'Jaipur','infrastructure','Parking facilities insufficient at Amber Fort during weekends','high'),
(@trend_id,'Jaipur','attractions','Jal Mahal viewing area needs expansion for better crowd management','medium');

-- ========== SEED: seasonal_analysis (getSeasonalAnalysis) ==========
INSERT INTO seasonal_analysis (season, average_footfall, peak_days) VALUES ('Peak Season',125000,45);
SET @season_id := LAST_INSERT_ID();
INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,'October',0);
INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,'November',1);
INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,'December',2);
INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,'January',3);
INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,'February',4);
INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,'March',5);
INSERT INTO seasonal_analysis_actions (seasonal_id, action_text, sort_order) VALUES (@season_id,'Increase hotel capacity',0);
INSERT INTO seasonal_analysis_actions (seasonal_id, action_text, sort_order) VALUES (@season_id,'Enhance transport services',1);
INSERT INTO seasonal_analysis_actions (seasonal_id, action_text, sort_order) VALUES (@season_id,'Implement crowd management systems',2);
INSERT INTO seasonal_analysis_actions (seasonal_id, action_text, sort_order) VALUES (@season_id,'Promote off-peak destinations',3);
INSERT INTO seasonal_analysis (season, average_footfall, peak_days) VALUES ('Moderate Season',85000,25);
SET @season_id := LAST_INSERT_ID();
INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,'April',0);
INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,'May',1);
INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,'September',2);
INSERT INTO seasonal_analysis_actions (seasonal_id, action_text, sort_order) VALUES (@season_id,'Promote seasonal festivals',0);
INSERT INTO seasonal_analysis_actions (seasonal_id, action_text, sort_order) VALUES (@season_id,'Offer package deals',1);
INSERT INTO seasonal_analysis_actions (seasonal_id, action_text, sort_order) VALUES (@season_id,'Focus on domestic tourism',2);
INSERT INTO seasonal_analysis (season, average_footfall, peak_days) VALUES ('Low Season',45000,10);
SET @season_id := LAST_INSERT_ID();
INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,'June',0);
INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,'July',1);
INSERT INTO seasonal_analysis_months (seasonal_id, month_name, sort_order) VALUES (@season_id,'August',2);
INSERT INTO seasonal_analysis_actions (seasonal_id, action_text, sort_order) VALUES (@season_id,'Promote monsoon tourism',0);
INSERT INTO seasonal_analysis_actions (seasonal_id, action_text, sort_order) VALUES (@season_id,'Offer discounts and packages',1);
INSERT INTO seasonal_analysis_actions (seasonal_id, action_text, sort_order) VALUES (@season_id,'Focus on indoor attractions',2);
INSERT INTO seasonal_analysis_actions (seasonal_id, action_text, sort_order) VALUES (@season_id,'Develop monsoon-specific experiences',3);

-- ========== SEED: tourist_entry_points (getTouristEntryPoints) ==========
INSERT INTO tourist_entry_points (location, domestic, international, total) VALUES
('Jaipur Airport',125000,45000,170000),
('Jaipur Railway Station',280000,12000,292000),
('Bus Stand',195000,5000,200000),
('Highway Checkpoints',85000,3000,88000);

-- ========== SEED: footfall_monument_baseline (getRealTimeFootfall baseCounts in footfall.ts) ==========
INSERT INTO footfall_monument_baseline (monument_id, base_total, domestic_ratio) VALUES
('hawa-mahal',450,0.75),
('amber-fort',680,0.7),
('city-palace',520,0.72),
('jantar-mantar',380,0.78),
('nahargarh-fort',290,0.8),
('jal-mahal',220,0.75);

-- ========== SEED: district_hotel_summary (same logic as getDistrictHotelStats) ==========
INSERT INTO district_hotel_summary (district, total_hotels, total_rooms, average_rating, average_occupancy, price_count_budget, price_count_mid_range, price_count_luxury, price_count_premium) VALUES ('Jaipur',8,887,4.4,74.1,2,3,2,1);

SET FOREIGN_KEY_CHECKS = 1;