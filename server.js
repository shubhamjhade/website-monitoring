require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { startMonitoring } = require('./src/services/cron.service');

const app = express();
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/monitors', require('./src/routes/monitorRoutes'));
app.use('/api/analytics', require('./src/routes/analyticsRoutes'));

// Quick Check endpoint (no auth needed) — for the landing page
const axios = require('axios');
const { generateIncidentReport } = require('./src/services/ai.service');

app.post('/api/quick-check', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const startTime = Date.now();
    let result = {
        url,
        status: 'UP',
        statusCode: null,
        responseTime: null,
        headers: {},
        serverInfo: {},
        sslInfo: null,
        errorDetails: null,
        aiSolution: null,
        checkedAt: new Date().toISOString()
    };

    try {
        const response = await axios.get(url, {
            timeout: 15000,
            validateStatus: () => true,
            headers: { 'User-Agent': 'SynthMonitor/1.0' }
        });

        result.statusCode = response.status;
        result.responseTime = Date.now() - startTime;
        result.status = response.status >= 200 && response.status < 400 ? 'UP' : 'DOWN';

        // Extract useful headers
        const h = response.headers;
        result.headers = {
            server: h['server'] || 'Unknown',
            contentType: h['content-type'] || 'Unknown',
            poweredBy: h['x-powered-by'] || null,
            cacheControl: h['cache-control'] || null,
            contentEncoding: h['content-encoding'] || null,
            contentLength: h['content-length'] || null
        };

        result.serverInfo = {
            protocol: url.startsWith('https') ? 'HTTPS' : 'HTTP',
            isSecure: url.startsWith('https'),
            redirected: response.request?.res?.responseUrl !== url,
            finalUrl: response.request?.res?.responseUrl || url
        };

        // If status is bad, get AI solution
        if (result.status === 'DOWN') {
            result.errorDetails = `HTTP ${response.status} error`;
            try {
                result.aiSolution = await generateIncidentReport(
                    'Quick Check', url, response.status, result.errorDetails
                );
            } catch (e) {
                result.aiSolution = 'AI analysis unavailable at this time.';
            }
        }
    } catch (error) {
        result.status = 'DOWN';
        result.responseTime = Date.now() - startTime;
        result.statusCode = error.response?.status || 0;
        result.errorDetails = error.message;

        // Get AI solution for errors
        try {
            result.aiSolution = await generateIncidentReport(
                'Quick Check', url, result.statusCode, error.message
            );
        } catch (e) {
            result.aiSolution = 'AI analysis unavailable at this time.';
        }
    }

    res.json(result);
});

// Serve static frontend in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('{*path}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// Start monitoring cron
startMonitoring();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
});
