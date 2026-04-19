const response = require('../utils/response');

/**
 * Express error-handling middleware (4 args).
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  return response.serverError(res, err);
}

module.exports = { errorHandler };
