const { loadEnv } = require('./loadEnv');
loadEnv();

const http = require('http');
const { app } = require('./app');
const { attachFootfallHub } = require('./websocket/footfallHub');
const analyticsQueries = require('./queries/analyticsQueries');
const { verifyConnection } = require('./config/database');

const port = Number(process.env.PORT || 4000);
const server = http.createServer(app);

const { timer: footfallTimer } = attachFootfallHub(server, () => analyticsQueries.getRealtimeFootfallAll());

server.listen(port, async () => {
  console.log(`SWA-YATRA backend http://localhost:${port}`);
  console.log(`WebSocket footfall ws://localhost:${port}/ws/footfall`);
  try {
    await verifyConnection();
  } catch (e) {
    console.error('[database] verifyConnection threw unexpectedly:', e.message);
  }
});

function shutdown() {
  clearInterval(footfallTimer);
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
