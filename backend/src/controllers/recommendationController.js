const response = require('../utils/response');
const recommendationQueries = require('../queries/recommendationQueries');

async function list(req, res, next) {
  try {
    const type = req.query.type || null;
    const recommendations = await recommendationQueries.listRecommendations(type);
    return response.ok(res, { recommendations });
  } catch (e) {
    return next(e);
  }
}

module.exports = { list };
