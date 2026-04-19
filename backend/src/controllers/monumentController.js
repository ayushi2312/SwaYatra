const response = require('../utils/response');
const monumentQueries = require('../queries/monumentQueries');

async function list(req, res, next) {
  try {
    const city = (req.query.city || '').toLowerCase();
    let cityCode = null;
    if (city === 'delhi' || city === 'jaipur') {
      cityCode = city;
    }
    const monuments = await monumentQueries.listMonuments(cityCode);
    return response.ok(res, { monuments });
  } catch (e) {
    return next(e);
  }
}

async function getById(req, res, next) {
  try {
    const m = await monumentQueries.getMonumentById(req.params.id);
    if (!m) {
      return response.notFound(res, 'Monument not found');
    }
    return response.ok(res, { monument: m });
  } catch (e) {
    return next(e);
  }
}

module.exports = { list, getById };
