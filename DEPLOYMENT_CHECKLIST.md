# Vercel Deployment Checklist

## Issue: Authentication not working in production

**Root Cause**: Cookies with `sameSite: 'Lax'` don't work across different domains (frontend and backend on separate Vercel deployments).

**Solution**: Use `sameSite: 'None'` with `secure: true` in production.

## ✅ Fixed in Backend (commit: 77c0120)

- Updated all `setCookie` calls to use `sameSite: 'None'` in production
- Kept `sameSite: 'Lax'` for local development
- Cookie settings now adapt based on `NODE_ENV`

## 🚀 Deployment Steps

### Step 1: Set Backend Environment Variables

In Vercel Dashboard → Your Backend Project → Settings → Environment Variables:

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres.nulddnfkwqdgckditijz:@uMAIR7867@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x2qgYvDk7QxJ7_PfHgJ1pluA5RZfU4KqvDNsQ3ZOrOQ
AUTH_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x2qgYvDk7QxJ7_PfHgJ1pluA5RZfU4KqvDNsQ3ZOrOQ
```

**IMPORTANT - Set after you know your frontend URL:**
```
ALLOWED_ORIGINS=https://your-frontend-app.vercel.app,http://localhost:3000
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### Step 2: Deploy Backend

```bash
cd backend
git push origin main
```

Or use Vercel CLI:
```bash
vercel --prod
```

**Copy the backend URL** (e.g., `https://your-backend.vercel.app`)

### Step 3: Set Frontend Environment Variables

In Vercel Dashboard → Your Frontend Project → Settings → Environment Variables:

```
BACKEND_API_URL=https://your-backend.vercel.app
NEXT_PUBLIC_API_URL=
```

### Step 4: Deploy Frontend

```bash
cd frontend
git push origin main
```

Or use Vercel CLI:
```bash
vercel --prod
```

**Copy the frontend URL** (e.g., `https://your-frontend.vercel.app`)

### Step 5: Update Backend CORS

Go back to backend Vercel settings and update:

```
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
FRONTEND_URL=https://your-frontend.vercel.app
```

Then redeploy backend (Settings → Deployments → ... → Redeploy)

## 🧪 Testing

1. **Clear all cookies** in your browser
2. Open production frontend URL
3. Click **Sign Up** and create an account
4. Should automatically redirect to `/dashboard` ✅
5. **Refresh the page** - should stay logged in ✅
6. Navigate to `/leads` - should show leads page ✅
7. **Open DevTools → Application → Cookies**:
   - Should see `accessToken` and `refreshToken` cookies
   - Both should have `SameSite=None` and `Secure` flags ✅

## ❌ Common Issues

### Issue 1: Still redirecting to login after successful login

**Cause**: `ALLOWED_ORIGINS` doesn't include frontend URL or `NODE_ENV` not set to production

**Fix**:
1. Verify `NODE_ENV=production` in backend
2. Add exact frontend URL to `ALLOWED_ORIGINS`
3. Redeploy backend

### Issue 2: CORS errors in browser console

**Cause**: Frontend URL not in `ALLOWED_ORIGINS`

**Fix**:
1. Check browser console for the exact origin being blocked
2. Add that URL to `ALLOWED_ORIGINS` (no trailing slash)
3. Example: `ALLOWED_ORIGINS=https://abc123.vercel.app,http://localhost:3000`

### Issue 3: Cookies not showing in DevTools

**Cause**: `NODE_ENV` not set to `production` in backend

**Fix**:
1. Go to backend Vercel settings
2. Add `NODE_ENV=production`
3. Redeploy

### Issue 4: Works in Incognito but not in normal browser

**Cause**: Old cookies cached from previous deployments

**Fix**:
1. Clear all cookies for both frontend and backend domains
2. Or use Incognito mode
3. Try again

## 📝 How It Works

### Development (localhost):
```javascript
sameSite: 'Lax'  // Works fine for same-domain
secure: false     // HTTP is okay
```

### Production (cross-domain):
```javascript
sameSite: 'None'  // Required for cross-domain
secure: true      // HTTPS required for sameSite=None
```

## 🔐 Security Notes

- ✅ Cookies are `httpOnly` (JavaScript can't access them)
- ✅ Cookies are `secure` in production (HTTPS only)
- ✅ CORS is restricted to specific origins
- ✅ Tokens expire (15min access, 7 days refresh)

## 📞 Need Help?

If authentication still doesn't work:

1. Check browser console for errors
2. Check Network tab → Look for 401/403 responses
3. Check DevTools → Application → Cookies (should see accessToken and refreshToken)
4. Verify all environment variables are set correctly
5. Clear cookies and try in Incognito mode
