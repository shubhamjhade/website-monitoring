const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/analytics/uptime/:monitorId
router.get('/uptime/:monitorId', analyticsController.getUptime);

// GET /api/analytics/latency/:monitorId
router.get('/latency/:monitorId', analyticsController.getLatencyHistory);

module.exports = router;
