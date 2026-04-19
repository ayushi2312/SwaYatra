const express = require('express');
const bookingController = require('../controllers/bookingController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', optionalAuth, bookingController.create);
router.get('/', optionalAuth, bookingController.listMine);
router.get('/:id', optionalAuth, bookingController.getOne);
router.patch('/:id/cancel', optionalAuth, bookingController.cancel);

module.exports = router;
