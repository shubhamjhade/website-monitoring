// AI Service — Gemini Integration for incident analysis
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateIncidentReport = async (monitorName, url, statusCode, errorMsg) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
        You are a Senior DevOps Engineer analyzing a production incident. 
        A website monitor just detected an outage.
        
        Details:
        - App Name: ${monitorName}
        - URL: ${url}
        - HTTP Status Code: ${statusCode}
        - Raw Error: ${errorMsg}

        Provide a concise, 3-part incident summary for the dashboard:
        1. "Suspected Cause": A 1-sentence explanation of what this error code usually means.
        2. "Impact": What the user is likely experiencing right now.
        3. "Action Plan": 2-3 immediate technical steps the developer should take to fix it.
        
        Keep it professional, brief, and format it clearly with section headers.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('❌ Gemini API Error:', error.message);
        return 'AI Analysis failed. Please check server logs manually.';
    }
};

module.exports = { generateIncidentReport };
