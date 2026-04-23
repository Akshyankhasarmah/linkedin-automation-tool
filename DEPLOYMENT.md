# Deployment Guide: Multi-URL LinkedIn Intelligence System

To ensure your application works on every URL and endpoint after deployment, follow these critical steps:

## 1. Firebase Authentication Domains
For "Sign in with LinkedIn" to work on your specific Vercel deployment, you **MUST** allowlist it in the Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Go to **Authentication** > **Settings** > **Authorized domains**.
4. Click **Add domain** and enter exactly: `lined-in-automation.vercel.app`
5. Also add: `localhost` (for your local development).
6. **For other devices in your network**: If you access the app via a local IP (e.g., `192.168.1.15:3000`), you must add that IP to the authorized domains list in Firebase.

## 2. Go & SQL Backend
The project includes a production-ready Go backend and SQL schema:
- **Go Engine**: `main.go` - Contains the relational logic for intelligence extraction.
- **SQL Schema**: `schema.sql` - Complete structure for Users, Logs, and Preferences.
- **Migration**: To deploy to a real SQL server, run the queries in `schema.sql` first.

## 3. Persistent Endpoints
The Node.js server (`server.ts`) is configured with a Catch-all SPA fallback. This means every frontend route (Dashboard, Reports, Automation) will remain stable even after a page refresh on any deployed URL.

## 4. API Key Resolution
Ensure `GEMINI_API_KEY` is set in your environment variables for the Intelligence Agent to function across all endpoints.

## 5. Vercel Deployment (Fixing "Black Screen")
If you are seeing a black screen when deploying to Vercel, it is likely because Vercel doesn't know how to handle the Single Page Application (SPA) routing.

### The Fix
1.  **SPA Routing**: I have added a `vercel.json` file to your project. This tells Vercel to redirect all URL requests to `index.html`.
2.  **Environment Variables**: You **MUST** add `GEMINI_API_KEY` in the Vercel Dashboard (**Settings** > **Environment Variables**).
3.  **Build Settings**:
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `dist`
4.  **Framework Preset**: Select "Vite" or "Other" in Vercel settings.
