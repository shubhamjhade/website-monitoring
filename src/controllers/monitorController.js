// Monitor Controller — CRUD operations using in-memory storage
const { Monitors, Logs } = require('../services/storage');

// GET /api/monitors — Get all monitors for the authenticated user
const getAllMonitors = async (req, res) => {
    try {
        const monitors = Monitors.findAll(req.userId);
        res.json(monitors);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// POST /api/monitors — Create a new monitor
const createMonitor = async (req, res) => {
    try {
        const { name, url } = req.body;
        if (!name || !url) {
            return res.status(400).json({ error: 'Name and URL are required.' });
        }
        const monitor = Monitors.create({ name, url, userId: req.userId });
        res.status(201).json(monitor);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create monitor' });
    }
};

// DELETE /api/monitors/:id — Delete a monitor
const deleteMonitor = async (req, res) => {
    try {
        const monitor = Monitors.findById(req.params.id);
        if (!monitor) {
            return res.status(404).json({ error: 'Monitor not found' });
        }
        if (monitor.userId !== req.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        Monitors.delete(req.params.id);
        res.json({ message: 'Monitor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete monitor' });
    }
};

// GET /api/monitors/:id/incidents — Get latest AI incident report
const getLatestIncident = async (req, res) => {
    try {
        const incident = Logs.findLatestDown(req.params.id);
        if (!incident) {
            return res.json({ message: 'No recent incidents' });
        }
        res.json(incident);
    } catch (err) {
        console.error('Fetch Incident Error:', err);
        res.status(500).json({ error: 'Failed to fetch incidents' });
    }
};

// GET /api/monitors/:id — Get single monitor with recent logs
const getMonitorById = async (req, res) => {
    try {
        const monitor = Monitors.findById(req.params.id);
        if (!monitor) {
            return res.status(404).json({ error: 'Monitor not found' });
        }
        const recentLogs = Logs.findByMonitor(req.params.id, 100);
        res.json({ monitor, logs: recentLogs });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch monitor details' });
    }
};

module.exports = { getAllMonitors, createMonitor, deleteMonitor, getLatestIncident, getMonitorById };
