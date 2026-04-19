const express = require('express');
const { ping, getLastDatabaseError } = require('../config/database');
const response = require('../utils/response');

const authRoutes = require('./authRoutes');
const monumentRoutes = require('./monumentRoutes');
const bookingRoutes = require('./bookingRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const hotelRoutes = require('./hotelRoutes');
const analyticsRoutes = require('./analyticsRoutes');

const router = express.Router();

router.get('/health', async (req, res, next) => {
  try {
    const dbOk = await ping();
    const payload = {
      api: 'ok',
      database: dbOk ? 'connected' : 'disconnected',
      databaseCheckedAt: new Date().toISOString(),
    };
    if (!dbOk && getLastDatabaseError()) {
      payload.databaseError = getLastDatabaseError();
    }
    return response.ok(res, payload);
  } catch (e) {
    return response.ok(res, {
      api: 'ok',
      database: 'disconnected',
      databaseError: e.message,
    });
  }
});

router.use('/auth', authRoutes);
router.use('/monuments', monumentRoutes);
router.use('/bookings', bookingRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/hotels', hotelRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
