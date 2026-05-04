const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');
const { authMiddleware } = require('../middleware/auth');

// All monitor routes require authentication
router.use(authMiddleware);

// Get all monitors for the user
router.get('/', monitorController.getAllMonitors);
// Create a new monitor
router.post('/', monitorController.createMonitor);
// Get a single monitor with logs
router.get('/:id', monitorController.getMonitorById);
// Delete a monitor
router.delete('/:id', monitorController.deleteMonitor);
// Get latest AI incident report
router.get('/:id/incidents', monitorController.getLatestIncident);

module.exports = router;
