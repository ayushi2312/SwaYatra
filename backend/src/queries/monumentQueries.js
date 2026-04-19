const { getPool } = require('../config/database');

function mapMonumentRow(row) {
  return {
    id: row.id,
    cityCode: row.city_code,
    name: row.name,
    nameHindi: row.name_hindi,
    nameFrench: row.name_french,
    location: row.location,
    coordinates: { lat: Number(row.lat), lng: Number(row.lng) },
    historicalInfo: {
      en: row.historical_info_en,
      hi: row.historical_info_hi,
      fr: row.historical_info_fr,
    },
    bestTime: row.best_time,
    crowdLevel: row.crowd_level,
    visitingHours: row.visiting_hours,
    safetyAdvisory: {
      en: row.safety_advisory_en,
      hi: row.safety_advisory_hi,
      fr: row.safety_advisory_fr,
    },
    category: row.category,
  };
}

async function listMonuments(cityCode) {
  const pool = getPool();
  let sql = `SELECT * FROM monuments`;
  const params = {};
  if (cityCode === 'delhi' || cityCode === 'jaipur') {
    sql += ` WHERE city_code = :city`;
    params.city = cityCode;
  }
  sql += ` ORDER BY name`;
  const [rows] = await pool.query(sql, params);
  return rows.map(mapMonumentRow);
}

async function getMonumentById(id) {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT * FROM monuments WHERE id = :id LIMIT 1`, { id });
  return rows[0] ? mapMonumentRow(rows[0]) : null;
}

module.exports = { listMonuments, getMonumentById, mapMonumentRow };
