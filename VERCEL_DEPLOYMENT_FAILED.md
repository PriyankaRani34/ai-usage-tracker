# Vercel Deployment Failed - Fix Guide

## Common Issues & Solutions

### Issue 1: Root Directory Not Set
**Error:** `cd: dashboard: No such file or directory` or build fails

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → General
2. Set **Root Directory** to: `dashboard`
3. Save and redeploy

### Issue 2: Build Command Fails
**Error:** `react-scripts: command not found` or npm errors

**Solution:**
If Root Directory is set to `dashboard`, update vercel.json:
```json
{
  "buildCommand": "npm install && CI=false npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install"
}
```

### Issue 3: Missing Environment Variables
**Error:** Build succeeds but app shows blank/error

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add: `REACT_APP_API_URL` = `https://your-railway-backend.railway.app/api`
3. Redeploy

## Quick Fix Steps

### Option A: Set Root Directory in Vercel (Recommended)

1. **Vercel Dashboard:**
   - Settings → General → Root Directory: `dashboard`
   - Settings → Build & Development Settings:
     - Build Command: `npm run build` (or `CI=false npm run build`)
     - Output Directory: `build`
     - Install Command: `npm install`

2. **Redeploy**

### Option B: Update vercel.json for Root Directory

If Root Directory is set to `dashboard`, simplify vercel.json:

```json
{
  "version": 2,
  "buildCommand": "npm install && CI=false npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option C: Deploy from dashboard folder using CLI

```bash
cd dashboard
npm install -g vercel
vercel --prod
```

## Check Build Logs

1. Go to Vercel Dashboard → Deployments
2. Click on the failed deployment
3. Check "Build Logs" for specific error
4. Common errors:
   - Missing dependencies → Add to package.json
   - Build errors → Check React code for syntax errors
   - Path issues → Verify Root Directory setting

## Current Configuration

Your `vercel.json` assumes Root Directory is NOT set to `dashboard`.
If you set Root Directory to `dashboard`, simplify the commands.

## Next Steps

1. Check Vercel build logs for specific error
2. Verify Root Directory setting
3. Update vercel.json if needed
4. Set `REACT_APP_API_URL` environment variable
5. Redeploy
