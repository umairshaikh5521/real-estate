# ⚠️ RESTART FRONTEND SERVER REQUIRED

## Problem:
Environment variables changed but dev server still using old values.

## ✅ Solution:

### **Stop and Restart Frontend:**

```bash
# Stop the current dev server
# Press Ctrl+C in the terminal running npm run dev

# Then restart it
cd frontend
npm run dev
```

## Why?
Next.js only reads `.env.local` when the dev server starts. Changes require a restart.

## Verify It Works:
1. Restart frontend server
2. Open browser console (F12)
3. Make an API call (create project)
4. Should see: `http://localhost:8000/api/projects`
5. NOT: `http://localhost:3000/api/projects`

## Alternative Quick Check:
```bash
# In frontend directory
cd frontend
node -e "console.log(process.env.NEXT_PUBLIC_API_URL)"
# Should output: http://localhost:8000
```
