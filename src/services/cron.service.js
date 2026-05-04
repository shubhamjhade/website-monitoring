// Cron Service — Periodic website health checking using in-memory storage
const cron = require('node-cron');
const axios = require('axios');
const { Monitors, Logs } = require('./storage');
const { generateIncidentReport } = require('./ai.service');

const checkWebsite = async (monitor) => {
    const startTime = Date.now();
    let isUp = false;
    let statusCode = null;
    let errorDetails = null;
    let aiSummary = null;

    try {
        const response = await axios.get(monitor.url, { timeout: 10000 });
        isUp = response.status >= 200 && response.status < 300;
        statusCode = response.status;
    } catch (error) {
        isUp = false;
        statusCode = error.response ? error.response.status : 500;
        errorDetails = error.message;

        console.log(`❌ Alert: ${monitor.name} is DOWN! Status: ${statusCode}`);
        console.log(`🤖 Asking Gemini AI to analyze the failure...`);

        aiSummary = await generateIncidentReport(monitor.name, monitor.url, statusCode, errorDetails);

        console.log(`✅ AI Insight successfully generated!`);
    }

    const responseTime = Date.now() - startTime;

    Logs.create({
        monitorId: monitor._id,
        status: isUp ? 'UP' : 'DOWN',
        statusCode,
        responseTime,
        errorDetails,
        aiSummary
    });

    Monitors.update(monitor._id, {
        currentStatus: isUp ? 'UP' : 'DOWN',
        lastChecked: new Date().toISOString()
    });
};

const startMonitoring = () => {
    console.log('⏱️  Monitoring Service Started...');

    // Check every minute
    cron.schedule('* * * * *', async () => {
        try {
            const monitors = Monitors.findAllActive();
            if (monitors.length === 0) return;

            const pingPromises = monitors.map(monitor => checkWebsite(monitor));
            await Promise.allSettled(pingPromises);

            console.log(`✅ Checked ${monitors.length} websites at ${new Date().toLocaleTimeString()}`);
        } catch (error) {
            console.error('Error in monitoring cron job:', error);
        }
    });
};

module.exports = { startMonitoring };
