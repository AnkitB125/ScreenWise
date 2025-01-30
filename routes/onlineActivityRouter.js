// routes
const express = require('express');
const router = express.Router();
const onlineActivityController = require('../controllers/onlineActivityController');

// Define offline activity routes
router.get('/online-activity', onlineActivityController.addOnlineActivity);
router.get('/list-onlineActivity', onlineActivityController.listOnlineActivityRecords);

module.exports = router;

