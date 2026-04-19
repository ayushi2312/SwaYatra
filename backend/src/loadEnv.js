const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

/**
 * Load env from the `backend/` folder (not from cwd), so it works when you run:
 *   `nodemon src/server.js` from `backend/src`
 *
 * Order: `.env.example` first (defaults), then `.env` with override (secrets / overrides).
 * If neither file exists, falls back to default dotenv cwd behaviour.
 */
function loadEnv() {
  const backendRoot = path.join(__dirname, '..');
  const envPath = path.join(backendRoot, '.env');
  const examplePath = path.join(backendRoot, '.env.example');

  if (fs.existsSync(examplePath)) {
    dotenv.config({ path: examplePath });
  }
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
  }

  if (!fs.existsSync(examplePath) && !fs.existsSync(envPath)) {
    dotenv.config();
  }
}

module.exports = { loadEnv };
