// routes
const express = require('express');
const router = express.Router();
const offlineActivityController = require('../controllers/offlineActivityController');

// Define offline activity routes
router.post('/offline-activity', offlineActivityController.addOfflineActivity);
router.get('/list-offlineActivity', offlineActivityController.listOfflineActivityRecords);

module.exports = router;

