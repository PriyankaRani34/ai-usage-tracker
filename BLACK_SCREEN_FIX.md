# Fix Black Screen on Vercel

## Issue: Black Screen When Launching Website

This usually happens because:
1. **Missing Environment Variable** - `REACT_APP_API_URL` not set in Vercel
2. **API Connection Failing** - App trying to connect to localhost instead of backend
3. **JavaScript Errors** - Check browser console for errors

## Quick Fix

### Step 1: Set Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Select your project

2. **Go to Settings → Environment Variables**

3. **Add Environment Variable:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-railway-backend.railway.app/api`
     - Replace `your-railway-backend.railway.app` with your actual Railway URL
   - **Environment:** Production, Preview, Development (select all)
   - Click "Save"

4. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - Or push a new commit to trigger auto-deploy

### Step 2: Verify Railway Backend is Running

1. **Check Railway Dashboard**
   - Make sure backend is deployed and running
   - Get the backend URL (e.g., `https://your-app.railway.app`)

2. **Test Backend URL**
   - Open: `https://your-railway-backend.railway.app/api/health`
   - Or: `https://your-railway-backend.railway.app/api/devices`
   - Should return JSON data (not error)

### Step 3: Check Browser Console

1. **Open your Vercel website**
2. **Open Browser Developer Tools** (F12 or Right-click → Inspect)
3. **Go to Console tab**
4. **Look for errors:**
   - CORS errors
   - Network errors
   - JavaScript errors

## Common Issues & Solutions

### Issue 1: "Failed to fetch" or CORS Error
**Solution:** Backend CORS is already configured, but verify:
- Backend URL is correct
- Backend is running
- CORS allows your Vercel domain

### Issue 2: "Cannot GET /" or 404
**Solution:** This is normal for React Router. Vercel needs a rewrite rule.

### Issue 3: Blank/Black Screen
**Solution:** 
1. Check browser console for errors
2. Verify environment variable is set
3. Verify backend is accessible
4. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Verify Setup

### Checklist:
- [ ] Railway backend is deployed and running
- [ ] Backend URL is accessible (test in browser)
- [ ] `REACT_APP_API_URL` is set in Vercel
- [ ] Environment variable includes `/api` at the end
- [ ] Vercel frontend is redeployed after setting env var
- [ ] Browser console shows no critical errors

## Testing

1. **Test Backend:**
   ```bash
   curl https://your-railway-backend.railway.app/api/devices
   ```
   Should return JSON array

2. **Test Frontend:**
   - Open Vercel URL
   - Open browser console (F12)
   - Check Network tab for API calls
   - Verify API calls go to Railway URL (not localhost)

## Still Not Working?

1. **Check Vercel Build Logs:**
   - Go to Deployments → Click on deployment
   - Check "Build Logs" for errors

2. **Check Railway Logs:**
   - Go to Railway Dashboard → Your service
   - Check "Logs" tab for errors

3. **Verify Environment Variable:**
   - In Vercel, make sure `REACT_APP_API_URL` is set correctly
   - Must start with `https://`
   - Must end with `/api`
   - Example: `https://your-app.railway.app/api`
