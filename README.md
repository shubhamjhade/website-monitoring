# 🌐 Website Monitoring

AI-Powered Website Monitoring with a stunning 3D Dashboard UI.

## Features

- **3D Animated Dashboard** — Immersive CSS 3D visualizations with real-time status
- **Website Health Monitoring** — Automatic periodic checks with cron scheduling
- **AI-Powered Diagnostics** — Google Gemini AI analyzes downtime incidents and provides root cause analysis
- **Real-time Analytics** — Uptime percentages, latency history, and response time tracking
- **Authentication** — Secure JWT-based login and registration
- **Responsive Design** — Premium glassmorphism UI that works on all devices

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, CSS 3D Transforms
- **Backend**: Node.js, Express 5
- **AI**: Google Gemini 1.5 Flash
- **Storage**: In-memory with JSON persistence
- **Deployment**: Google Cloud Run

## Quick Start

```bash
npm install
npm run build-client
npm start
```

## Environment Variables

```
PORT=8080
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

## Deployment

Deployed on Google Cloud Run:
```bash
gcloud run deploy website-monitoring --source . --region us-central1 --allow-unauthenticated
```
