const cors = require('cors');

function createCorsMiddleware() {
  const origin = process.env.FRONTEND_ORIGIN || 'https://swa-yatra.com';
  return cors({
    origin: [origin, /^http:\/\/localhost:\d+$/, /^https:\/\/localhost:\d+$/],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}

module.exports = { createCorsMiddleware };
