const express = require('express');
const hotelController = require('../controllers/hotelController');

const router = express.Router();

router.get('/', hotelController.list);

module.exports = router;
