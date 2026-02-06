# User Management & Tracking Updates

## What's New

### 1. **User Authentication System**
   - **Login/Registration Page**: The landing page is now a login/registration page
   - **User Accounts**: Users can create accounts with email and password
   - **Session Management**: Users stay logged in across browser sessions
   - **Multi-Device Support**: One login tracks usage across all devices

### 2. **Fixed Tracking Issues**
   - **User Linking**: Devices are now properly linked to user accounts
   - **Cross-Device Tracking**: Usage from all devices is aggregated per user
   - **Real-time Updates**: Data syncs every 10 seconds

### 3. **Monthly Usage View**
   - **This Month Option**: Added "This Month" period selector
   - **Daily Breakdown**: Monthly view shows daily usage breakdown
   - **Monthly API Endpoint**: `/api/usage/monthly` endpoint for monthly data

## How to Use

### For Users (Dashboard)

1. **First Time Setup**:
   - Visit your dashboard URL (Vercel/Railway)
   - You'll see the login page
   - Click "Sign Up" tab
   - Enter your email, password, name (optional), and age (optional)
   - Click "Sign Up"
   - You'll be automatically logged in

2. **Login**:
   - Enter your email and password
   - Click "Login"
   - Your dashboard will load with your usage data

3. **View Monthly Usage**:
   - In the Overview tab, select "This Month" from the period selector
   - See your daily breakdown for the current month

4. **Logout**:
   - Click your profile icon in the top right
   - Click "Logout"
   - You'll be returned to the login page

### For Browser Extension Setup

1. **Get Your User ID**:
   - Login to the dashboard
   - Open browser console (F12)
   - Type: `localStorage.getItem('userId')`
   - Copy the UUID that appears

2. **Configure Extension**:
   - Click the extension icon in your browser
   - Enter your API URL (e.g., `https://your-railway-backend.railway.app/api`)
   - Paste your User ID in the "User ID" field
   - Click "Save Settings"
   - Your device will now be linked to your account

3. **Track Usage**:
   - The extension automatically tracks AI usage
   - Data is sent to your backend every 5 minutes
   - All devices with the same User ID will aggregate data

## API Endpoints Added

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user/:userId` - Get user info

### Usage
- `GET /api/usage/monthly?userId=xxx&year=2024&month=1` - Get monthly breakdown

## Database Changes

### User Profiles Table
- Added `email` column (UNIQUE, required)
- Added `password` column (hashed with SHA-256)

### Devices Table
- `user_id` column now properly links devices to users
- Devices are automatically linked when usage is logged with userId

## Security Notes

- Passwords are hashed using SHA-256 (consider upgrading to bcrypt in production)
- User sessions are managed via localStorage (consider JWT tokens for production)
- Email validation is basic (consider email verification)

## Troubleshooting

### Issue: "Not tracking usage"
**Solution:**
1. Check browser extension is installed and configured
2. Verify User ID is set in extension popup
3. Check API URL is correct in extension
4. Verify backend is running and accessible
5. Check browser console for errors

### Issue: "Can't login"
**Solution:**
1. Make sure you've registered first (use Sign Up)
2. Check email and password are correct
3. Check backend is running
4. Check browser console for errors

### Issue: "Data not showing across devices"
**Solution:**
1. Make sure all devices have the same User ID in extension
2. Verify devices are linked: Check `/api/devices` endpoint
3. Make sure userId is being sent in usage logs

### Issue: "Monthly view shows no data"
**Solution:**
1. Make sure you have usage data for the current month
2. Check that devices are linked to your user account
3. Verify period selector is set to "This Month"

## Next Steps

1. **Deploy Updates**:
   - Deploy backend to Railway
   - Deploy frontend to Vercel
   - Set `REACT_APP_API_URL` environment variable in Vercel

2. **Test**:
   - Create a test account
   - Install browser extension
   - Configure with User ID
   - Use AI services and verify tracking

3. **Production Improvements** (Optional):
   - Add email verification
   - Use JWT tokens for sessions
   - Upgrade password hashing to bcrypt
   - Add password reset functionality
   - Add 2FA support

## Migration Notes

If you have existing data:
- Existing devices without userId will continue to work
- You can link existing devices to users via `/api/devices/:deviceId/link-user`
- Usage logs are preserved and will be associated with users once devices are linked
