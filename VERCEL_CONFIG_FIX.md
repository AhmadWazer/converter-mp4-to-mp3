# 🔧 Fixing Vercel Configuration Error

## ✅ The Fix

**Error:** `The functions property cannot be used in conjunction with the builds property`

**Solution:** Removed `functions` property from `vercel.json`. Function settings (maxDuration, memory) should be configured via Vercel Dashboard.

---

## 📋 Why This Happened

### **What Was Wrong:**

Vercel has two configuration systems:
1. **Legacy (`builds`)** - Older system for build configuration
2. **Modern (`functions`)** - Newer system for function configuration

**You cannot use both together!**

### **The Conflict:**

```json
{
  "builds": [...],      // ❌ Legacy system
  "functions": {...}    // ❌ Modern system
  // Can't use both!
}
```

---

## 🎯 Correct Configuration

### **For Express Apps (Your Case):**

Use `builds` for Express apps, then configure function settings via:

1. **Vercel Dashboard** (Recommended):
   - Go to: Project → Settings → Functions
   - Set `maxDuration`: 300 seconds
   - Set `memory`: 3008 MB (if available on your plan)

2. **Or via Environment Variables:**
   - `VERCEL_FUNCTION_MAX_DURATION=300`

### **Current `vercel.json` (Fixed):**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
```

---

## 🔄 Alternative: Modern Approach (If You Want)

If you prefer the modern approach, you'd need to:

1. **Remove `builds`** and restructure as serverless functions
2. **Move routes to `api/` directory** as individual functions
3. **Use `functions` property** for configuration

**But this requires significant code restructuring!**

**Recommendation:** Stick with `builds` approach (current fix) - it's simpler for Express apps.

---

## 📝 Setting Function Configuration

### **Via Vercel Dashboard:**

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Functions**
4. Configure:
   - **Max Duration**: 300 seconds (5 minutes)
   - **Memory**: 3008 MB (if on Pro plan)

### **Via CLI (Alternative):**

```bash
vercel env add VERCEL_FUNCTION_MAX_DURATION
# Enter: 300
```

---

## 🚨 Important Notes

### **FFmpeg Binary Inclusion:**

With the `builds` approach, Vercel automatically includes `node_modules`, so the FFmpeg binary should be included. However, if you still get "binary not found" errors:

1. **Check build logs** - Verify `node_modules/ffmpeg-static` is being included
2. **Verify binary exists** - The Linux binary should be in the package
3. **Check function size** - If it exceeds limits, binary might be excluded

### **Function Size Limits:**

- **Hobby Plan**: 50MB function size limit
- **Pro Plan**: 250MB function size limit
- **Enterprise**: Custom limits

**FFmpeg binary is ~50-100MB**, so you might hit limits on Hobby plan.

**If function size is an issue:**
- Upgrade to Pro plan (250MB limit)
- Or use FFmpeg.wasm (smaller package)
- Or use external conversion service

### **If Function Size Exceeds Limits:**

1. **Upgrade to Pro plan** (250MB limit)
2. **Or use FFmpeg.wasm** (smaller, but slower)
3. **Or external service** (Docker with FFmpeg)

---

## ✅ Next Steps

1. **Deploy:**
   ```bash
   vercel deploy
   ```

2. **Configure Function Settings:**
   - Go to Vercel Dashboard → Settings → Functions
   - Set maxDuration to 300 seconds

3. **Monitor:**
   - Check deployment logs
   - Verify function size
   - Test conversion endpoint

---

## 📚 Summary

**The Error:** Using both `builds` and `functions` properties

**The Fix:** 
- ✅ Removed `functions` property
- ✅ Kept `builds` (appropriate for Express apps)
- ✅ Configure function settings via Dashboard

**Your `vercel.json` is now correct!** 🎯

