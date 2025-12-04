# Authentication Troubleshooting Guide

## Current Issue: AccessDenied Error

### Problem
You're seeing `AccessDenied` error after successfully authenticating with Google OAuth.

### Root Cause
The **backend server is not running**. The authentication flow works like this:

1. ✅ **Google OAuth** - User authenticates with Google (this works)
2. ❌ **Backend Token Exchange** - Frontend tries to exchange Google token with backend API (this fails)
3. ❌ **AccessDenied** - NextAuth.js rejects sign-in because backend exchange failed

### Solution: Start the Backend Server

The backend must be running on `http://localhost:8080` for authentication to work.

#### Step 1: Navigate to Backend Directory

```powershell
cd d:\project-krawl\backend
```

#### Step 2: Start the Backend Server

**Option A: Using Maven (Recommended)**
```powershell
mvn spring-boot:run
```

**Option B: Using Java directly (if you have a built JAR)**
```powershell
java -jar target/krawl-*.jar
```

#### Step 3: Verify Backend is Running

Open a new terminal and test:
```powershell
curl http://localhost:8080/actuator/health
```

Or visit in browser: `http://localhost:8080/actuator/health`

You should see a response like:
```json
{"status":"UP"}
```

#### Step 4: Try Sign-In Again

Once the backend is running:
1. Go to `http://localhost:3000/auth/sign-in`
2. Click "Sign in with Google"
3. Complete Google authentication
4. **New users will be redirected to `/onboarding`** ✅
5. **Existing users will go to the home page** ✅

---

## Complete Authentication Flow

Here's how the full flow works:

```
1. User clicks "Sign in with Google"
   ↓
2. NextAuth.js redirects to Google OAuth
   ↓
3. User authenticates with Google ✅
   ↓
4. Google redirects back to: /api/auth/callback/google
   ↓
5. NextAuth.js signIn callback runs:
   - Calls backend: POST http://localhost:8080/api/auth/google
   - Sends Google access token
   - Backend validates token and creates/updates user
   - Backend returns JWT + user info + isNewUser flag
   ↓
6. If isNewUser === true:
   → Redirect to /onboarding ✅
   ↓
7. If isNewUser === false:
   → Redirect to home page ✅
```

---

## Common Issues

### Issue 1: Backend Not Running

**Symptoms:**
- `AccessDenied` error
- Network error in browser console
- "Unable to connect to the remote server"

**Solution:**
- Start the backend server (see above)

---

### Issue 2: Backend Running on Different Port

**Symptoms:**
- Backend is running but authentication still fails
- Check your `.env.local` file

**Solution:**
Update `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:YOUR_PORT
```

Then restart the frontend dev server.

---

### Issue 3: Database Connection Issues

**Symptoms:**
- Backend starts but crashes
- Database connection errors in backend logs

**Solution:**
1. Make sure PostgreSQL is running
2. Check `backend/src/main/resources/application.properties` or `application.yml`
3. Verify database credentials are correct

---

### Issue 4: Google OAuth Configuration

**Symptoms:**
- `invalid_client` error
- `Configuration` error

**Solution:**
1. Check `frontend/.env.local` has correct:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `AUTH_SECRET` or `NEXTAUTH_SECRET`
2. Verify redirect URI in Google Cloud Console:
   - `http://localhost:3000/api/auth/callback/google`
3. Restart frontend dev server after changing `.env.local`

---

## Quick Checklist

Before trying to sign in, verify:

- [ ] Backend server is running on `http://localhost:8080`
- [ ] Frontend dev server is running on `http://localhost:3000`
- [ ] PostgreSQL database is running
- [ ] `.env.local` has correct Google OAuth credentials
- [ ] `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8080`
- [ ] Google Cloud Console has correct redirect URI configured

---

## Testing the Flow

### Test 1: Backend Health Check
```powershell
curl http://localhost:8080/actuator/health
```

### Test 2: Backend Auth Endpoint (Manual)
```powershell
# This will fail without a valid Google token, but confirms endpoint exists
curl -X POST http://localhost:8080/api/auth/google `
  -H "Content-Type: application/json" `
  -d '{"token":"test"}'
```

Expected: Error response (not connection error)

### Test 3: Full Sign-In Flow
1. Start backend: `cd backend && mvn spring-boot:run`
2. Start frontend: `cd frontend && npm run dev`
3. Visit: `http://localhost:3000/auth/sign-in`
4. Click "Sign in with Google"
5. Complete authentication
6. Should redirect to `/onboarding` (new user) or home page (existing user)

---

## Need More Help?

Check the logs:
- **Backend logs**: Look for errors in the terminal where `mvn spring-boot:run` is running
- **Frontend logs**: Check browser console (F12) and terminal where `npm run dev` is running
- **NextAuth logs**: Look for `[auth][error]` messages in frontend terminal















