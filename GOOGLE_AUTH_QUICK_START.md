## ⚡ Google Auth Quick Start

### 1️⃣ Update Google Cloud Console

Go to https://console.cloud.google.com and:
1. Click your project
2. Go to **Credentials** → **OAuth 2.0 Client IDs**
3. Click your web app credential
4. Update **Authorized redirect URIs** to:
   ```
   http://localhost:3001/api/v1/user/auth/google/callback
   ```
5. Click **Save**

### 2️⃣ Update Backend .env

```env
GOOGLE_CLIENT_ID=12149453548-vt0bacc880f4ng3so27nfi8s2qiqtt37.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/user/auth/google/callback
```

### 3️⃣ Start Backend

```bash
cd backend
npm run dev
```

### 4️⃣ Start Frontend

```bash
cd frontend
npm run dev
```

### 5️⃣ Test It!

1. Open http://localhost:3000/login
2. Click **"Continue with Google"**
3. Sign in with your Google account
4. You should be redirected to home page ✅

---

## 🔑 What Happens Behind the Scenes

```
[Frontend] Click Google Button
    ↓
[Backend] /api/v1/user/auth/google
    ↓
[Passport] Redirects to Google Login
    ↓
[Google] User authorizes app
    ↓
[Google] Redirects to callback URL with auth code
    ↓
[Backend] Exchanges code for token & creates/updates user
    ↓
[Backend] Generates JWT & redirects to frontend with token
    ↓
[Frontend] Stores token in localStorage
    ↓
[Frontend] User is logged in ✅
```

---

## 📋 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/user/auth/google` | GET | Start Google OAuth flow |
| `/api/v1/user/auth/google/callback` | GET | Handle Google callback |
| `/api/v1/user/google/login` | GET | Get authenticated user |

---

## ✨ Features

✅ Auto-create user on first Google login  
✅ Link Google to existing email accounts  
✅ JWT token generation for API calls  
✅ User profile photo from Google  
✅ Both candidate and recruiter roles supported  
✅ Secure session management  

---

## 🚨 Common Issues

### "Redirect URI mismatch"
→ Make sure callback URL in Google Cloud Console matches exactly

### "Cannot POST /api/v1/user/auth/google"
→ Check backend is running on port 3001

### "Token not saving"
→ Check browser's localStorage is enabled

### "User not created in database"
→ Check MongoDB connection and logs

