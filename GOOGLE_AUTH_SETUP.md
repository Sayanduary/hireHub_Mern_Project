## Google Authentication Setup Guide

### ✅ What's Been Implemented

#### **Backend Changes:**
1. **Installed Dependencies**
   - `passport` - Authentication middleware
   - `passport-google-oauth20` - Google OAuth strategy
   - `express-session` - Session management

2. **Updated User Model** (`backend/models/user.model.js`)
   - Added `googleId` field for Google unique identifier
   - Added `authProvider` field to track authentication method
   - Made `password` and `phoneNumber` optional (for Google auth users)

3. **Created Passport Configuration** (`backend/utils/passport.js`)
   - Google OAuth 2.0 strategy setup
   - Auto-creates or links Google accounts to existing users
   - Serialization/deserialization of user sessions

4. **Updated User Controller** (`backend/controllers/user.controller.js`)
   - Added `googleCallback()` - Handles post-auth redirect
   - Added `googleLogin()` - Returns user data and JWT token

5. **Updated User Routes** (`backend/routes/user.route.js`)
   - `/api/v1/user/auth/google` - Initiates Google login
   - `/api/v1/user/auth/google/callback` - Google OAuth callback
   - `/api/v1/user/google/login` - Get authenticated user data

6. **Updated Backend Index** (`backend/index.js`)
   - Added Express session middleware
   - Integrated Passport initialization
   - Configured session management for OAuth

#### **Frontend Changes:**
1. **Updated Login Component** (`frontend/src/components/auth/Login.jsx`)
   - Added Google Sign-In button with icon
   - Added `handleGoogleLogin()` function
   - Added visual divider between email and Google login

2. **Created Google Callback Component** (`frontend/src/components/auth/GoogleCallback.jsx`)
   - Handles OAuth callback from backend
   - Extracts token from URL
   - Stores token and redirects to home

3. **Updated App Routes** (`frontend/src/App.jsx`)
   - Added `/auth/google/callback` route

---

### 🔐 Google Credentials Already Configured

Your `.env` file already has Google credentials:
```
GOOGLE_CLIENT_ID=12149453548-vt0bacc880f4ng3so27nfi8s2qiqtt37.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

### ⚙️ Final Configuration Steps

#### 1. **Callback URL Update**
You need to update the callback URL in Google Cloud Console to match your backend port:

Current: `http://localhost:5000/api/auth/google/callback`
Update to: `http://localhost:3001/api/v1/user/auth/google/callback`

Steps:
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Select your project
- Go to Credentials > OAuth 2.0 Client ID
- Add authorized redirect URI: `http://localhost:3001/api/v1/user/auth/google/callback`
- Save

#### 2. **Update Backend .env**
```
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/user/auth/google/callback
```

#### 3. **Update Frontend Callback URL (Optional)**
If needed later for production, update in GoogleCallback.jsx:
```javascript
const response = await fetch(`http://localhost:3001/api/v1/user/profile`, {
```

---

### 🚀 How It Works

1. **User clicks "Continue with Google"** on login page
2. **Frontend redirects** to `/api/v1/user/auth/google`
3. **Passport** handles OAuth flow with Google
4. **Google redirects** to callback URL with auth code
5. **Backend validates** and creates/updates user in database
6. **JWT token generated** and passed in redirect URL
7. **Frontend stores token** and user is logged in

---

### 🧪 Testing Google Auth

1. Start your backend:
```bash
cd backend
npm run dev
```

2. Start your frontend:
```bash
cd frontend
npm run dev
```

3. Go to `http://localhost:3000/login`
4. Click "Continue with Google"
5. Sign in with your Google account
6. You should be redirected to home page as logged-in user

---

### 🐛 Troubleshooting

**Issue: "Redirect URI mismatch" error**
- Solution: Update the callback URL in Google Cloud Console to match exactly

**Issue: User not created after Google login**
- Solution: Check backend logs for errors in passport.js

**Issue: Token not persisting**
- Solution: Ensure localStorage is working in browser (check console)

**Issue: "Callback URL not matching" in Google OAuth**
- Solution: Make sure your backend is running on port 3001 or update GOOGLE_CALLBACK_URL in .env

---

### 📝 Next Steps (Optional Enhancements)

1. **Add role selection popup** - Ask user if they're candidate or recruiter on first Google login
2. **Auto-complete profile** - Fetch additional data from Google profile
3. **Facebook/GitHub auth** - Add more OAuth providers using similar approach
4. **Production URLs** - Update callback URLs for production deployment
5. **Refresh tokens** - Implement token refresh mechanism for better security

---

### 📂 Files Modified/Created

**Backend:**
- ✅ `backend/models/user.model.js` - Updated schema
- ✅ `backend/controllers/user.controller.js` - Added Google handlers
- ✅ `backend/routes/user.route.js` - Added Google routes
- ✅ `backend/utils/passport.js` - Created Passport config
- ✅ `backend/index.js` - Updated with Passport middleware
- ✅ `backend/.env` - Already configured

**Frontend:**
- ✅ `frontend/src/components/auth/Login.jsx` - Added Google button
- ✅ `frontend/src/components/auth/GoogleCallback.jsx` - Created callback handler
- ✅ `frontend/src/App.jsx` - Added route for callback
