# 🚀 Quick Fix Guide: Vercel Deployment Issues

## 📋 Common Issues

1. **DNS_HOSTNAME_RESOLVED_PRIVATE** - See section below
2. **FFmpeg Binary Not Found** - See `QUICK_FIX_FFMPEG.md`
3. **Functions/Builds Conflict** - See `VERCEL_CONFIG_FIX.md`
4. **404 NOT_FOUND** - See `VERCEL_404_FIX.md`

### ⚡ Quick Fix: 404 NOT_FOUND Error

**Error:** `404: NOT_FOUND` when accessing Vercel deployment

**Fix:** ✅ Already fixed! 
- Reordered routes in `vercel.json` (specific → general)
- Added explicit root route
- Fixed Express app export for serverless

**Test:**
```bash
curl https://your-app.vercel.app/api/health
```

### ⚡ Quick Fix: Functions/Builds Error

**Error:** `The functions property cannot be used in conjunction with the builds property`

**Fix:** ✅ Already fixed! Removed `functions` property from `vercel.json`

**Next Step:** Configure function settings via Vercel Dashboard:
1. Go to: Project → Settings → Functions
2. Set `maxDuration`: 300 seconds
3. Set `memory`: 3008 MB (if on Pro plan)

---

## 1️⃣ DNS_HOSTNAME_RESOLVED_PRIVATE

## ⚡ Immediate Fix (5 minutes)

### Step 1: Check Vercel Environment Variables
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. **Look for and REMOVE/UPDATE any variables containing:**
   - `localhost`
   - `127.0.0.1`
   - `192.168.x.x`
   - `10.x.x.x`
   - `172.16.x.x` to `172.31.x.x`

### Step 2: Run Diagnostic Script
```bash
cd "converter mp4 to mp3"
npm run check-dns
```

This will show you any issues in your code.

### Step 3: Redeploy
```bash
vercel deploy
```

---

## ✅ Your Code is Already Good!

Your code uses **relative URLs** (`/api/convert`), which is perfect! The issue is almost certainly in Vercel's environment variables.

---

## 🔍 Common Culprits

| Environment Variable | ❌ Bad Value | ✅ Good Value |
|---------------------|--------------|---------------|
| `API_URL` | `http://localhost:3000` | `/api` or `https://your-app.vercel.app/api` |
| `DATABASE_URL` | `mongodb://localhost:27017` | `mongodb://your-public-db.com` |
| `WEBHOOK_URL` | `http://127.0.0.1:3000/webhook` | `https://your-app.vercel.app/webhook` |
| `BASE_URL` | `http://localhost:3000` | `https://your-app.vercel.app` |

---

## 📚 Full Documentation

See `VERCEL_DNS_ERROR_FIX.md` for complete explanation and alternatives.

