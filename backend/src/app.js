const express = require('express');
const { createCorsMiddleware } = require('./middleware/cors');
const { errorHandler } = require('./middleware/errorHandler');
const apiRoutes = require('./routes');

const app = express();

app.use(createCorsMiddleware());
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({ name: 'SWA-YATRA API', version: '1', docs: '/api/v1/health' });
});

app.use('/api/v1', apiRoutes);

app.use(errorHandler);

module.exports = { app };
