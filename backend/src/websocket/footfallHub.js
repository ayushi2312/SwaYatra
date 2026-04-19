const WebSocket = require('ws');

/**
 * Broadcasts footfall snapshots on a timer so dashboards can subscribe without polling.
 */
function attachFootfallHub(httpServer, getFootfallSnapshot) {
  const wss = new WebSocket.Server({ server: httpServer, path: '/ws/footfall' });

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'hello', message: 'swayatra-footfall-stream' }));
  });

  const intervalMs = Number(process.env.FOOTFALL_WS_INTERVAL_MS || 5000);
  /** Avoid spamming the console when MySQL is down (same error every tick). */
  let lastFootfallErrorMsg = '';
  let lastFootfallErrorLogAt = 0;
  const footfallErrorLogCooldownMs = Number(process.env.FOOTFALL_WS_ERROR_LOG_MS || 30000);

  const timer = setInterval(async () => {
    let footfall = [];
    try {
      footfall = await getFootfallSnapshot();
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      const now = Date.now();
      if (msg !== lastFootfallErrorMsg || now - lastFootfallErrorLogAt >= footfallErrorLogCooldownMs) {
        console.error('[websocket/footfall] snapshot error:', msg);
        lastFootfallErrorMsg = msg;
        lastFootfallErrorLogAt = now;
      }
    }
    const payload = JSON.stringify({ type: 'footfall', data: footfall, ts: Date.now() });
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }, intervalMs);

  return { wss, timer };
}

module.exports = { attachFootfallHub };
