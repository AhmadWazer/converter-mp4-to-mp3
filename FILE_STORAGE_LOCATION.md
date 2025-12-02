# 📁 Where Converted Files Are Saved

## 📍 File Storage Locations

### **Local Development (Your Computer):**

**Location:** `{project_directory}/converted/`

**Full Path Example:**
```
D:\Curser\New folder\converter mp4 to mp3\converted\
```

**Files saved as:**
- `{uuid}.mp3` (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp3`)

---

### **Vercel Production (Serverless):**

**Location:** `/tmp/converted/`

**Why `/tmp`?**
- Vercel serverless functions have a **read-only file system**
- Only `/tmp` directory is writable
- Files are **temporary** and **automatically cleaned up**

**Files saved as:**
- `{uuid}.mp3` (same format as local)

---

## ⚠️ Important: Files Are Temporary!

### **Automatic Cleanup:**

Converted files are **automatically deleted** in these scenarios:

1. ✅ **After successful download** - File is deleted immediately
2. ✅ **On download error** - File is cleaned up
3. ✅ **On client disconnect** - File is removed
4. ✅ **Function timeout** - Vercel cleans up `/tmp` between invocations

### **Why This Design?**

- ✅ **No storage accumulation** - Files don't pile up
- ✅ **Privacy** - Files aren't stored permanently
- ✅ **Cost efficiency** - No long-term storage costs
- ✅ **Security** - Temporary files reduce attack surface

---

## 🔍 How to Check File Location

### **Method 1: Check Server Logs**

When you convert a file, check the console logs:

```javascript
console.log(`Output: ${outputPath}`);
```

**Local Development:**
```
Output: D:\Curser\New folder\converter mp4 to mp3\converted\a1b2c3d4.mp3
```

**Vercel:**
```
Output: /tmp/converted/a1b2c3d4.mp3
```

### **Method 2: Check Health Endpoint**

```bash
curl https://your-app.vercel.app/api/health
```

Response includes:
```json
{
  "environment": {
    "isVercel": true,
    "baseDir": "/tmp"
  }
}
```

### **Method 3: Check Code**

Look at `server.js` line 61:
```javascript
const convertedDir = path.join(baseDir, 'converted');
```

Where `baseDir` is:
- **Local:** `__dirname` (project directory)
- **Vercel:** `/tmp`

---

## 📂 File Lifecycle

### **Step-by-Step Process:**

1. **Upload** → Saved to `uploads/` directory
   - Local: `{project}/uploads/{uuid}.mp4`
   - Vercel: `/tmp/uploads/{uuid}.mp4`

2. **Conversion** → Saved to `converted/` directory
   - Local: `{project}/converted/{uuid}.mp3`
   - Vercel: `/tmp/converted/{uuid}.mp3`

3. **Download** → User downloads file
   - File streamed to user
   - File deleted immediately after download

4. **Cleanup** → File removed
   - Local: Deleted from `converted/` directory
   - Vercel: Deleted from `/tmp/converted/` (or cleaned up by Vercel)

---

## 🎯 Accessing Files

### **You Cannot Directly Access Files On:**

- ❌ **Vercel** - `/tmp` is ephemeral and not accessible
- ❌ **After download** - Files are deleted
- ❌ **Between function invocations** - `/tmp` is cleared

### **You Can Access Files On:**

- ✅ **Local development** - Before download
- ✅ **Via download endpoint** - `/api/download/{filename}`
- ✅ **During conversion** - Before cleanup

---

## 💡 If You Need Persistent Storage

If you need to **keep files longer**, consider:

### **Option 1: Cloud Storage (Recommended)**

Store files in:
- AWS S3
- Google Cloud Storage
- Cloudinary
- Vercel Blob Storage

**Example with S3:**
```javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// After conversion
await s3.upload({
  Bucket: 'your-bucket',
  Key: outputFilename,
  Body: fs.createReadStream(outputPath)
}).promise();
```

### **Option 2: Database Storage**

Store file metadata in database:
- File ID
- Download URL
- Expiration time
- User association

### **Option 3: Custom Storage Service**

Use external service for file storage:
- Firebase Storage
- Supabase Storage
- DigitalOcean Spaces

---

## 🔧 Changing Storage Location

### **To Change Local Storage:**

Edit `server.js` line 58:
```javascript
// Current
const baseDir = isVercel ? '/tmp' : __dirname;

// Custom location
const baseDir = isVercel ? '/tmp' : '/path/to/custom/directory';
```

### **To Disable Auto-Delete:**

Edit download endpoint in `server.js` (around line 237):
```javascript
// Remove or comment out this section:
res.on('finish', () => {
  // File deletion code here
});
```

**⚠️ Warning:** Disabling auto-delete will cause storage to accumulate!

---

## 📊 Storage Summary

| Environment | Location | Persistent? | Accessible? |
|------------|----------|--------------|-------------|
| **Local Dev** | `{project}/converted/` | ✅ Yes | ✅ Yes (before download) |
| **Vercel** | `/tmp/converted/` | ❌ No | ❌ No (ephemeral) |

**Key Points:**
- ✅ Files are temporary by design
- ✅ Auto-deleted after download
- ✅ No long-term storage
- ✅ Privacy-focused

---

## 🚀 Next Steps

1. **For Temporary Use:** Current setup is perfect ✅
2. **For Persistent Storage:** Implement cloud storage solution
3. **For File Sharing:** Use download URLs (current approach)

---

## 📝 Summary

**Where files are saved:**
- **Local:** `{project_directory}/converted/`
- **Vercel:** `/tmp/converted/`

**Important:**
- Files are **temporary**
- Auto-deleted after download
- Not accessible directly on Vercel
- Use download endpoint to access files

**Your current setup is correct for temporary file conversion!** 🎯

