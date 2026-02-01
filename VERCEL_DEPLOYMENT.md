# Vercel Deployment Guide

## Issue: `react-scripts: command not found`

This error occurs because Vercel needs to install dependencies in the `dashboard` folder before building.

## Solution

### Option 1: Deploy Dashboard Only (Frontend)

**Recommended for Vercel** - Deploy just the React dashboard.

1. **In Vercel Dashboard:**
   - Root Directory: `dashboard`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

2. **Or use vercel.json** (already created):
   - The `vercel.json` file is configured for dashboard deployment
   - Vercel will automatically use it

### Option 2: Manual Vercel Configuration

When deploying in Vercel:

1. **Project Settings:**
   - **Root Directory:** `dashboard`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

2. **Environment Variables** (if needed):
   - `REACT_APP_API_URL` = Your backend API URL

### Option 3: Deploy Full Stack (Backend + Frontend)

For full-stack deployment, you need:

1. **Backend:** Deploy to Railway/Render/Heroku
2. **Frontend:** Deploy to Vercel (pointing to backend API)

**Steps:**
1. Deploy backend first (Railway/Render)
2. Get backend URL (e.g., `https://your-api.railway.app`)
3. Deploy frontend to Vercel:
   - Set `REACT_APP_API_URL` = `https://your-api.railway.app/api`
   - Root Directory: `dashboard`
   - Build Command: `npm run build`

## Quick Fix for Current Error

If you're getting the error, try this:

1. **Delete the current Vercel deployment**
2. **Redeploy with these settings:**
   - Root Directory: `dashboard`
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Or use CLI:**
```bash
cd dashboard
vercel --prod
```

## Alternative: Use Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to dashboard
cd dashboard

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name: ai-usage-tracker-dashboard
# - Directory: ./
# - Override settings? No
```

## Troubleshooting

### Error: `react-scripts: command not found`
**Fix:** Make sure Root Directory is set to `dashboard` in Vercel settings

### Error: `Cannot find module`
**Fix:** Ensure `npm install` runs in the `dashboard` folder

### Build succeeds but app doesn't work
**Fix:** Check that `REACT_APP_API_URL` is set correctly

## Recommended Architecture

**For Production:**
- **Frontend (Vercel):** React dashboard
- **Backend (Railway/Render):** Node.js API
- **Database:** SQLite (or migrate to PostgreSQL for production)

**Why?**
- Vercel is optimized for static sites/React apps
- Railway/Render better for Node.js backends with databases
- Better separation of concerns

## Next Steps

1. Deploy dashboard to Vercel (frontend only)
2. Deploy backend to Railway/Render
3. Connect them via environment variables
