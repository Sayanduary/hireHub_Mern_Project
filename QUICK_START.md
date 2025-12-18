# 🚀 Quick Start - Google Auth

## ⚡ Get Running in 3 Steps

### Step 1: Start Backend
```bash
cd backend
npm run dev
# ✅ Server running on http://localhost:3001
```

### Step 2: Start Frontend  
```bash
cd frontend
npm run dev
# ✅ App running on http://localhost:5173
```

### Step 3: Test Google Login
```
1. Go to http://localhost:5173/login
2. Click "Continue with Google"
3. Sign in with your Google account
4. ✅ You're logged in!
```

---

## 🔑 Credentials Already Configured

```env
GOOGLE_CLIENT_ID: 12149453548-vt0bacc880f4ng3so27nfi8s2qiqtt37.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET: 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
CALLBACK_URL: http://localhost:5000/api/auth/google/callback
```

---

## 📝 What Happens When You Sign In

1. Click "Continue with Google" on Login page
2. Redirected to Google sign-in
3. You sign in with Google
4. Google redirects back to our app with code
5. Backend exchanges code for Google profile data
6. Backend creates user in database (or links to existing)
7. Frontend receives JWT token
8. You're logged in! 🎉

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `backend/utils/passport.js` | Google OAuth strategy |
| `backend/controllers/user.controller.js` | Google login handlers |
| `backend/routes/user.route.js` | Google auth routes |
| `frontend/components/auth/Login.jsx` | Google button UI |
| `frontend/components/auth/GoogleCallback.jsx` | Callback handler |

---

## ✅ Checklist

- ✅ Google OAuth credentials added to .env
- ✅ Backend Passport strategy configured
- ✅ Frontend Google button added
- ✅ Callback route created
- ✅ User model updated for googleId
- ✅ Session middleware configured
- ✅ CORS properly configured
- ✅ Database connection verified

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check MongoDB connection in .env |
| Google button doesn't work | Verify .env variables are set |
| Login redirects to /login | Check browser console for errors |
| Token not saving | Check localStorage permissions |
| "Redirect URI mismatch" | Update GOOGLE_CALLBACK_URL in .env |

---

## 📚 Learn More

See `GOOGLE_AUTH_COMPLETE.md` for full documentation

---

**Happy Coding! 🚀**
