// routes
const express = require('express');
const router = express.Router();
const logOfflineActivityController = require('../controllers/logOfflineActivityController');

// Define log offline activity routes
router.post('/log-offline-activity', logOfflineActivityController.addLogOfflineActivity);

module.exports = router;

