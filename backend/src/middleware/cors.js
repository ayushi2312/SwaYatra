const cors = require('cors');

function createCorsMiddleware() {
  const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
  return cors({
    origin: [origin, /^http:\/\/localhost:\d+$/],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}

module.exports = { createCorsMiddleware };
