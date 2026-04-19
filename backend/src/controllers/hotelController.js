const response = require('../utils/response');
const hotelQueries = require('../queries/hotelQueries');

async function list(req, res, next) {
  try {
    const district = req.query.district || 'Jaipur';
    const hotels = await hotelQueries.listHotelsByDistrict(district);
    return response.ok(res, { hotels });
  } catch (e) {
    return next(e);
  }
}

module.exports = { list };
