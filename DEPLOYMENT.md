# Deployment Guide: Multi-URL LinkedIn Intelligence System

To ensure your application works on every URL and endpoint after deployment, follow these critical steps:

## 1. Firebase Authentication Domains
For "Sign in with LinkedIn" to work on any URL (e.g., your custom domain), you must allowlist it in the Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Go to **Authentication** > **Settings** > **Authorized domains**.
4. Click **Add domain** and enter your production URL (e.g., `yourapp.com`).

## 2. Go & SQL Backend
The project includes a production-ready Go backend and SQL schema:
- **Go Engine**: `main.go` - Contains the relational logic for intelligence extraction.
- **SQL Schema**: `schema.sql` - Complete structure for Users, Logs, and Preferences.
- **Migration**: To deploy to a real SQL server, run the queries in `schema.sql` first.

## 3. Persistent Endpoints
The Node.js server (`server.ts`) is configured with a Catch-all SPA fallback. This means every frontend route (Dashboard, Reports, Automation) will remain stable even after a page refresh on any deployed URL.

## 4. API Key Resolution
Ensure `GEMINI_API_KEY` is set in your environment variables for the Intelligence Agent to function across all endpoints.
