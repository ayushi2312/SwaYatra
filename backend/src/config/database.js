const mysql = require('mysql2/promise');

let pool;

/** Updated by {@link verifyConnection}; read-only for other modules. */
let connectionState = {
  ok: false,
  lastError: null,
  lastChecked: null,
};

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'swayatra',
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
    });
  }
  return pool;
}

function isDatabaseConnected() {
  return connectionState.ok === true;
}

function getLastDatabaseError() {
  return connectionState.lastError;
}

/**
 * Runs `SELECT 1` through the pool. On failure, updates {@link connectionState} and returns false.
 */
async function ping() {
  try {
    const p = getPool();
    const [rows] = await p.query('SELECT 1 AS ok');
    const ok = rows[0]?.ok === 1;
    connectionState = {
      ok,
      lastError: null,
      lastChecked: new Date(),
    };
    return ok;
  } catch (err) {
    connectionState = {
      ok: false,
      lastError: err.message,
      lastChecked: new Date(),
    };
    return false;
  }
}

/**
 * Explicit startup check with clear console output so you know if MySQL is reachable.
 * Uses {@link ping} internally (try/catch lives there). Call once after `dotenv` loads.
 */
async function verifyConnection() {
  const host = process.env.MYSQL_HOST || '127.0.0.1';
  const port = process.env.MYSQL_PORT || '3306';
  const user = process.env.MYSQL_USER || 'root';
  const database = process.env.MYSQL_DATABASE || 'swayatra';
  const hasPassword =
    process.env.MYSQL_PASSWORD != null && String(process.env.MYSQL_PASSWORD).length > 0;

  const ok = await ping();
  if (ok) {
    console.log(`[database] Connected — ${user}@${host}:${port} / ${database}`);
    return true;
  }

  console.error('[database] Connection FAILED:', connectionState.lastError || 'unknown error');
  if (!hasPassword && user === 'root') {
    console.error(
      '[database] Hint: MySQL often needs a password. Set MYSQL_PASSWORD in backend/.env (copy from .env.example).'
    );
  } else {
    console.error(
      '[database] Hint: Check MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE in backend/.env'
    );
  }
  return false;
}

module.exports = {
  getPool,
  ping,
  verifyConnection,
  isDatabaseConnected,
  getLastDatabaseError,
};
