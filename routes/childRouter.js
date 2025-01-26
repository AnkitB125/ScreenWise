// routes/childRouter.js
const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController');

// Define child routes
router.get('/listChild', childController.listChildRecords);
router.post('/addChild', childController.addChild);

module.exports = router;