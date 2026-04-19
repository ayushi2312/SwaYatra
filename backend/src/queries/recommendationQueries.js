const { getPool } = require('../config/database');

function mapRow(row) {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    nameHindi: row.name_hindi,
    nameFrench: row.name_french,
    description: {
      en: row.description_en,
      hi: row.description_hi,
      fr: row.description_fr,
    },
    location: row.location,
    rating: Number(row.rating),
    priceRange: row.price_range,
    verified: Boolean(row.verified),
    contact: row.contact || undefined,
  };
}

async function listRecommendations(type) {
  const pool = getPool();
  let sql = `SELECT * FROM recommendations`;
  const params = {};
  if (type) {
    sql += ` WHERE type = :type`;
    params.type = type;
  }
  sql += ` ORDER BY name`;
  const [rows] = await pool.query(sql, params);
  return rows.map(mapRow);
}

module.exports = { listRecommendations, mapRow };
