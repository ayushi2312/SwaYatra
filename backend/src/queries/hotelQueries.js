const { getPool } = require('../config/database');

function mapHotelRow(row) {
  return {
    id: row.id,
    name: row.name,
    district: row.district,
    location: row.location,
    rating: Number(row.rating),
    totalRooms: row.total_rooms,
    availableRooms: row.available_rooms,
    priceRange: row.price_range,
    category: row.category,
    coordinates: { lat: Number(row.lat), lng: Number(row.lng) },
    occupancyRate: Number(row.occupancy_rate),
    verified: Boolean(row.verified),
  };
}

async function listHotelsByDistrict(district) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM hotels WHERE district = :district ORDER BY name`,
    { district }
  );
  return rows.map(mapHotelRow);
}

async function getDistrictSummary(district) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT district, total_hotels AS totalHotels, total_rooms AS totalRooms,
            average_rating AS averageRating, average_occupancy AS averageOccupancy,
            price_count_budget AS priceCountBudget, price_count_mid_range AS priceCountMidRange,
            price_count_luxury AS priceCountLuxury, price_count_premium AS priceCountPremium
     FROM district_hotel_summary WHERE district = :district LIMIT 1`,
    { district }
  );
  const row = rows[0];
  if (!row) return null;
  return {
    district: row.district,
    totalHotels: row.totalHotels,
    totalRooms: row.totalRooms,
    averageRating: Number(row.averageRating),
    averageOccupancy: Number(row.averageOccupancy),
    priceDistribution: {
      budget: row.priceCountBudget,
      'mid-range': row.priceCountMidRange,
      luxury: row.priceCountLuxury,
      premium: row.priceCountPremium,
    },
  };
}

async function listHighDemandHotels(district, minOccupancy) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM hotels
     WHERE district = :district AND occupancy_rate >= :minOcc
     ORDER BY occupancy_rate DESC`,
    { district, minOcc: minOccupancy }
  );
  return rows.map(mapHotelRow);
}

async function listUnderutilizedHotels(district, maxOccupancy) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT * FROM hotels
     WHERE district = :district AND occupancy_rate < :maxOcc
     ORDER BY occupancy_rate ASC`,
    { district, maxOcc: maxOccupancy }
  );
  return rows.map(mapHotelRow);
}

module.exports = {
  listHotelsByDistrict,
  getDistrictSummary,
  listHighDemandHotels,
  listUnderutilizedHotels,
  mapHotelRow,
};
