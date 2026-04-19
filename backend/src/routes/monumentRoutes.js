const express = require('express');
const monumentController = require('../controllers/monumentController');

const router = express.Router();

router.get('/', monumentController.list);
router.get('/:id', monumentController.getById);

module.exports = router;
