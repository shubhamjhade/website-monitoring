// Analytics Controller — Uptime and Latency calculations using in-memory storage
const { Logs } = require('../services/storage');

// GET /api/analytics/uptime/:monitorId — Calculate uptime percentage
const getUptime = async (req, res) => {
    try {
        const { monitorId } = req.params;
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const totalLogs = Logs.countByMonitor(monitorId, twentyFourHoursAgo);

        if (totalLogs === 0) {
            return res.json({ uptime: '100.00', message: 'Not enough data yet' });
        }

        const upLogs = Logs.countUpByMonitor(monitorId, twentyFourHoursAgo);
        const uptimePercentage = ((upLogs / totalLogs) * 100).toFixed(2);

        res.json({ uptime: uptimePercentage });
    } catch (error) {
        console.error('Uptime Calculation Error:', error);
        res.status(500).json({ error: 'Failed to calculate uptime' });
    }
};

// GET /api/analytics/latency/:monitorId — Get latency history for charts
const getLatencyHistory = async (req, res) => {
    try {
        const { monitorId } = req.params;

        const recentLogs = Logs.findByMonitor(monitorId, 50);

        // Reverse so it goes left-to-right (oldest to newest) on the chart
        const formattedData = recentLogs.reverse().map(log => ({
            time: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            latency: log.responseTime,
            status: log.status
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Latency Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch latency data' });
    }
};

module.exports = { getUptime, getLatencyHistory };
