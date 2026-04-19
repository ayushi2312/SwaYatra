const express = require('express');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.get('/footfall/realtime', analyticsController.footfallRealtime);
router.get('/footfall/daily', analyticsController.footfallDaily);
router.get('/hotels/district/:district/summary', analyticsController.hotelDistrictSummary);
router.get('/hotels/high-demand', analyticsController.hotelHighDemand);
router.get('/hotels/underutilized', analyticsController.hotelUnderutilized);
router.get('/trends', analyticsController.trends);
router.get('/seasonal', analyticsController.seasonal);
router.get('/entry-points', analyticsController.entryPoints);

module.exports = router;
