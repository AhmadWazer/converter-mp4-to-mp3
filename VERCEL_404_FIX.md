# 🔧 Fixing 404 NOT_FOUND Error on Vercel

## ✅ The Fix

**Error:** `404: NOT_FOUND` when accessing your Vercel deployment

**Solution:** Fixed route configuration in `vercel.json` and ensured Express app exports correctly.

---

## 🔍 Root Cause Analysis

### **What Was Happening:**

1. **Route Order Issue:**
   - The catch-all route `"/(.*)"` was too broad
   - It might have been catching API routes before they could be processed
   - Static file serving wasn't properly configured

2. **Route Specificity:**
   - Routes need to be ordered from most specific to least specific
   - API routes should be handled first
   - Static files should be served from `/public`
   - Root route should go to Express app

### **What Should Happen:**

1. `/api/*` routes → Express app (`server.js`)
2. `/` (root) → Express app (serves `index.html`)
3. Static assets (`*.html`, `*.css`, etc.) → `/public` directory
4. Everything else → Express app (for SPA routing)

---

## 📋 The Fix Applied

### **Updated `vercel.json` Routes:**

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/",
      "dest": "/server.js"
    },
    {
      "src": "/(.*\\.(html|css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))",
      "dest": "/public/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

**Route Order (Most Specific → Least Specific):**
1. ✅ `/api/*` → Express app (API endpoints)
2. ✅ `/` → Express app (root page)
3. ✅ Static files → `/public` directory
4. ✅ Everything else → Express app (catch-all)

### **Updated `server.js` Export:**

- ✅ Only starts HTTP server in local development
- ✅ Exports Express app for Vercel serverless
- ✅ Proper environment detection

---

## 🎯 Why This Works

### **Vercel Route Matching:**

Vercel matches routes **in order** and uses the **first match**:

1. **`/api/health`** → Matches `/api/(.*)` → Goes to `server.js` ✅
2. **`/`** → Matches `/` → Goes to `server.js` ✅
3. **`/index.html`** → Matches static file pattern → Served from `/public` ✅
4. **`/some-route`** → Matches catch-all `/(.*)` → Goes to `server.js` ✅

### **Express App Export:**

For `@vercel/node`:
- ✅ `module.exports = app` is correct
- ✅ Vercel wraps it as a serverless function
- ✅ No need for explicit handler function

---

## 🚨 Common 404 Causes

### **1. Route Order Wrong:**

```json
// ❌ BAD - Catch-all catches everything first
{
  "src": "/(.*)",
  "dest": "/server.js"
},
{
  "src": "/api/(.*)",
  "dest": "/server.js"  // Never reached!
}

// ✅ GOOD - Specific routes first
{
  "src": "/api/(.*)",
  "dest": "/server.js"
},
{
  "src": "/(.*)",
  "dest": "/server.js"
}
```

### **2. Missing Routes:**

```json
// ❌ BAD - No root route
{
  "src": "/api/(.*)",
  "dest": "/server.js"
}
// "/" returns 404!

// ✅ GOOD - Includes root
{
  "src": "/api/(.*)",
  "dest": "/server.js"
},
{
  "src": "/",
  "dest": "/server.js"
}
```

### **3. Wrong Export:**

```javascript
// ❌ BAD - Starts server in serverless
app.listen(PORT);  // Won't work on Vercel!
module.exports = app;

// ✅ GOOD - Conditional server start
if (!isVercel) {
  app.listen(PORT);
}
module.exports = app;
```

### **4. Build Configuration:**

```json
// ❌ BAD - Missing build config
{
  "routes": [...]
}

// ✅ GOOD - Includes builds
{
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [...]
}
```

---

## 🧪 Testing the Fix

### **1. Test Root Route:**
```bash
curl https://your-app.vercel.app/
```
Should return: HTML page (index.html)

### **2. Test API Health:**
```bash
curl https://your-app.vercel.app/api/health
```
Should return: JSON with status

### **3. Test API Convert:**
```bash
curl -X POST https://your-app.vercel.app/api/convert
```
Should return: Error about missing file (not 404!)

### **4. Check Vercel Logs:**
- Go to: Vercel Dashboard → Functions → Logs
- Look for route matching
- Check for any errors

---

## 🔄 Alternative: Modern Serverless Functions

If you continue having issues, consider converting to individual serverless functions:

### **Structure:**
```
api/
  ├── index.js          # Root handler
  ├── health.js         # /api/health
  ├── convert.js        # /api/convert
  └── download.js        # /api/download/:filename
```

### **Pros:**
- ✅ Better Vercel integration
- ✅ Automatic routing
- ✅ Better cold start performance

### **Cons:**
- ❌ Requires code restructuring
- ❌ More files to maintain
- ❌ Shared code is harder

**Recommendation:** Try the current fix first. Only restructure if issues persist.

---

## 📝 Troubleshooting Checklist

If you still get 404 errors:

- [ ] ✅ Routes are in correct order (specific → general)
- [ ] ✅ Root route (`/`) is included
- [ ] ✅ API routes (`/api/*`) are included
- [ ] ✅ `builds` configuration is present
- [ ] ✅ Express app is exported correctly
- [ ] ✅ Server only starts in local dev
- [ ] ✅ Check Vercel deployment logs
- [ ] ✅ Verify file structure matches routes
- [ ] ✅ Test routes individually

---

## 🚀 Next Steps

1. **Deploy:**
   ```bash
   vercel deploy
   ```

2. **Test Routes:**
   - Root: `https://your-app.vercel.app/`
   - Health: `https://your-app.vercel.app/api/health`
   - Convert: `https://your-app.vercel.app/api/convert`

3. **Monitor:**
   - Check Vercel logs for route matching
   - Verify no 404 errors in logs
   - Test all endpoints

---

## 📚 Summary

**The Error:** `404: NOT_FOUND`

**The Cause:**
1. Route order in `vercel.json` was incorrect
2. Catch-all route was too broad
3. Static file serving wasn't configured properly

**The Fix:**
1. ✅ Reordered routes (specific → general)
2. ✅ Added explicit root route
3. ✅ Added static file pattern
4. ✅ Fixed Express app export for serverless

**Your routes are now correctly configured!** 🎯

