/**
 * Standard JSON responses for all API handlers.
 * Shape: { success, data?, message?, error? }
 */

function ok(res, data, message = 'OK') {
  return res.status(200).json({ success: true, data, message });
}

function created(res, data, message = 'Created') {
  return res.status(201).json({ success: true, data, message });
}

function fail(res, statusCode, error, message = null) {
  return res.status(statusCode).json({
    success: false,
    error,
    message: message != null ? message : error,
  });
}

function badRequest(res, error, message = null) {
  return fail(res, 400, error, message);
}

function unauthorized(res, error = 'Unauthorized') {
  return fail(res, 401, error);
}

function forbidden(res, error = 'Forbidden') {
  return fail(res, 403, error);
}

function notFound(res, error = 'Not found') {
  return fail(res, 404, error);
}

function serverError(res, err, log = console.error) {
  log(err);
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

module.exports = {
  ok,
  created,
  fail,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError,
};
