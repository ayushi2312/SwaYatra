const express = require('express');
const recommendationController = require('../controllers/recommendationController');

const router = express.Router();

router.get('/', recommendationController.list);

module.exports = router;
