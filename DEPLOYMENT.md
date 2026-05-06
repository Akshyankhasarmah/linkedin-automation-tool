# Deployment Guide: Multi-URL LinkedIn Intelligence System

To ensure your application works on every URL and endpoint after deployment, follow these critical steps:

## 1. Firebase Authentication Domains
For "Sign in with LinkedIn" to work, Firebase must TRUST the exact hostname of your website.

1.  Go to the [Firebase Console Authorized Domains Settings](https://console.firebase.google.com/project/gen-lang-client-0498947034/authentication/settings).
2.  Click **Add domain**.
3.  **CRITICAL**: Enter ONLY the hostname. Do NOT include `https://` or any slashes `/`.
    -   ✅ Correct: `lined-in-automation.vercel.app`
    -   ❌ Incorrect: `https://lined-in-automation.vercel.app/`
4.  If you are using a Vercel preview branch, look at the error message in the app; it will tell you the exact hostname to add (e.g., `lined-in-automation-abc.vercel.app`).

### Why it might still fail after adding it:
-   **Propagation Delay**: It can take up to **5 minutes** for Firebase to update its global security settings.
-   **Old Session**: Try opening the site in an **Incognito/Private window** to ensure the browser isn't using a cached security state.

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
