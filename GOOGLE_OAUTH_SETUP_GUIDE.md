# Google OAuth Setup Guide

## Problem

You're seeing this error when trying to sign in:
```
[auth][error] CallbackRouteError
[auth][details]: {
  "error": "invalid_client",
  "error_description": "Unauthorized",
  "provider": "google"
}
```

This means your Google OAuth credentials are missing or incorrect.

## Solution

### Step 1: Create Environment File

I've created `.env.local` from the template. Now you need to fill in your Google OAuth credentials.

### Step 2: Get Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Select or create a project

2. **Enable Google+ API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "People API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Configure:
     - **Name:** Krawl Development (or any name)
     - **Authorized JavaScript origins:**
       - `http://localhost:3000`
     - **Authorized redirect URIs:**
       - `http://localhost:3000/api/auth/callback/google`
   - Click "Create"
   - **Copy the Client ID and Client Secret**

### Step 3: Configure Environment Variables

Edit `frontend/.env.local` and add your credentials:

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# NextAuth.js Secret (generate a random string)
# Run: openssl rand -base64 32
AUTH_SECRET=your-generated-secret-here
NEXTAUTH_SECRET=your-generated-secret-here  # Can be same as AUTH_SECRET

# NextAuth.js URL
NEXTAUTH_URL=http://localhost:3000

# Backend API URL (if backend is running)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Step 4: Generate AUTH_SECRET

Run this command to generate a secure secret:

```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use OpenSSL (if installed)
openssl rand -base64 32
```

Copy the output and paste it as `AUTH_SECRET` and `NEXTAUTH_SECRET` in `.env.local`.

### Step 5: Restart Development Server

After updating `.env.local`:

1. **Stop the dev server** (Ctrl+C)
2. **Restart it:**
   ```bash
   cd frontend
   npm run dev
   ```

### Step 6: Test Sign-In

1. Go to `http://localhost:3000/auth/sign-in`
2. Click "Sign in with Google"
3. You should be redirected to Google's consent screen
4. After signing in, **new users will be redirected to `/onboarding`** ✅

## Important Notes

### Redirect URI Must Match Exactly

The redirect URI in Google Cloud Console **must exactly match**:
```
http://localhost:3000/api/auth/callback/google
```

**Common mistakes:**
- ❌ Missing `/api/auth/callback/google` path
- ❌ Using `https://` instead of `http://` (for localhost)
- ❌ Trailing slash: `http://localhost:3000/` (should be no trailing slash)

### For Production

When deploying to production, you'll need to:
1. Add production redirect URI to Google Cloud Console:
   - `https://yourdomain.com/api/auth/callback/google`
2. Update `.env.local` (or production env vars):
   - `NEXTAUTH_URL=https://yourdomain.com`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (can use same or create separate OAuth client)

## Troubleshooting

### Still Getting "invalid_client" Error?

1. **Verify credentials are correct:**
   - Check `.env.local` has correct Client ID and Secret
   - Make sure there are no extra spaces or quotes

2. **Check redirect URI:**
   - Go to Google Cloud Console > Credentials
   - Verify redirect URI is exactly: `http://localhost:3000/api/auth/callback/google`

3. **Restart dev server:**
   - Environment variables are loaded at startup
   - Must restart after changing `.env.local`

4. **Check console logs:**
   - Look for `[NextAuth] Configuration Error` messages
   - These will tell you which variables are missing

### Backend Connection Issues

If you see errors about backend API:
- Make sure backend is running on `http://localhost:8080`
- Or update `NEXT_PUBLIC_API_URL` in `.env.local`

## Once Fixed

After fixing the OAuth configuration:

1. **New users** signing in will automatically see the onboarding flow ✅
2. **Existing users** will go directly to the app
3. You can also manually visit `/onboarding` to see the flow

---

**Need Help?** Check the error message in the browser console or terminal for specific details about what's missing.










