const jwt = require('jsonwebtoken');
const response = require('../utils/response');

function getBearerToken(req) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return null;
  return h.slice(7).trim();
}

/**
 * Attaches req.user = { id, email } when a valid JWT is present.
 * Does not send 401 if missing (use requireAuth for that).
 */
function optionalAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    req.user = { id: Number(payload.sub), email: payload.email };
  } catch {
    req.user = null;
  }
  next();
}

function requireAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return response.unauthorized(res, 'Missing or invalid Authorization header');
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    req.user = { id: Number(payload.sub), email: payload.email };
    return next();
  } catch {
    return response.unauthorized(res, 'Invalid or expired token');
  }
}

function signToken(user) {
  return jwt.sign(
    { sub: String(user.id), email: user.email },
    process.env.JWT_SECRET || 'dev-secret-change-me',
    { expiresIn: '7d' }
  );
}

module.exports = { optionalAuth, requireAuth, signToken, getBearerToken };
