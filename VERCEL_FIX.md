# Vercel Deployment Fix

## Issue: `cd: dashboard: No such file or directory`

This happens because Vercel needs the **Root Directory** set to `dashboard` in project settings.

## Solution: Set Root Directory in Vercel Dashboard

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Select your project** (ai-usage-tracker)

3. **Go to Settings → General**

4. **Find "Root Directory"**
   - Click "Edit"
   - Enter: `dashboard`
   - Click "Save"

5. **Go to Settings → Build & Development Settings**
   - Verify:
     - **Build Command:** `npm run build` (or `CI=false npm run build`)
     - **Output Directory:** `build`
     - **Install Command:** `npm install`

6. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - Or push a new commit to trigger auto-deploy

## Alternative: Use Vercel CLI

If dashboard settings don't work, use CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to dashboard folder
cd dashboard

# Deploy
vercel --prod
```

This will automatically detect it's a React app and configure correctly.

## Why This Happens

Vercel by default uses the repository root. Since your React app is in the `dashboard` subfolder, you need to tell Vercel to use that as the root directory.

## Updated vercel.json

I've updated `vercel.json` to work when Root Directory is set to `dashboard`. The commands now assume you're already in the dashboard folder.
