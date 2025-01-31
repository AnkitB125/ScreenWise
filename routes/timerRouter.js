// routes
const express = require('express');
const router = express.Router();
const timerController = require('../controllers/timerController');

// Define timer route
router.post('/timer', timerController.timer);

module.exports = router;
