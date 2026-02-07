# Vercel Deployment Quick Fix

## Most Common Issue: Root Directory

Vercel needs to know where your React app is located.

### Solution: Set Root Directory in Vercel Dashboard

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Select your project

2. **Settings → General**
   - Find "Root Directory"
   - Click "Edit"
   - Enter: `dashboard`
   - Click "Save"

3. **Settings → Build & Development Settings**
   - Verify these settings:
     - **Framework Preset:** Create React App (or Other)
     - **Build Command:** `npm run build` (or `CI=false npm run build`)
     - **Output Directory:** `build`
     - **Install Command:** `npm install`

4. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment

## Alternative: Update vercel.json

If you set Root Directory to `dashboard`, update `vercel.json`:

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

## Check Build Logs

1. Go to Vercel Dashboard → Deployments
2. Click on the failed deployment
3. Check "Build Logs" tab
4. Look for specific error messages

## Common Errors

### Error: "cd: dashboard: No such file or directory"
**Fix:** Set Root Directory to `dashboard` in Vercel settings

### Error: "react-scripts: command not found"
**Fix:** Make sure `npm install` runs before build

### Error: "Module not found"
**Fix:** Check that all dependencies are in `dashboard/package.json`

### Error: Build succeeds but app is blank
**Fix:** Set `REACT_APP_API_URL` environment variable in Vercel

## Environment Variables

Don't forget to set:
- `REACT_APP_API_URL` = `https://your-railway-backend.railway.app/api`
