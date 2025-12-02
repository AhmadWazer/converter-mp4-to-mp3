# 📥 How to Download Converted Files

## 🎯 Quick Answer

After conversion completes, click the **"📥 Download MP3"** button that appears on the web interface!

---

## 🌐 Method 1: Web Interface (Easiest)

### **Step-by-Step:**

1. **Upload your video file**
   - Click "Choose a video file" or drag & drop
   - Select MP4, AVI, MOV, or WMV file

2. **Click "Convert to MP3"**
   - Wait for conversion to complete
   - Progress bar shows conversion status

3. **Click "📥 Download MP3" button**
   - Button appears after successful conversion
   - File downloads automatically
   - Page refreshes after download starts

### **What Happens:**

- ✅ File downloads to your default Downloads folder
- ✅ Filename: `{original-filename}.mp3`
- ✅ File is deleted from server after download
- ✅ Page refreshes for next conversion

---

## 🔧 Method 2: Direct API Call

### **Using cURL:**

```bash
# Replace {filename} with the actual filename from conversion response
curl -O "https://your-app.vercel.app/api/download/{filename}?original={original-name}.mp4"
```

**Example:**
```bash
curl -O "https://your-app.vercel.app/api/download/a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp3?original=my-video.mp4"
```

### **Using Browser:**

Simply open the download URL in your browser:
```
https://your-app.vercel.app/api/download/{filename}?original={original-name}
```

**Example:**
```
https://your-app.vercel.app/api/download/a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp3?original=my-video.mp4
```

### **Using JavaScript (Fetch API):**

```javascript
async function downloadFile(filename, originalName) {
  const url = `/api/download/${filename}?original=${encodeURIComponent(originalName)}`;
  
  const response = await fetch(url);
  const blob = await response.blob();
  
  // Create download link
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${originalName.replace(/\.[^/.]+$/, '')}.mp3`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}
```

---

## 💻 Method 3: Programmatic Download

### **Complete Example (Node.js):**

```javascript
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function convertAndDownload(inputPath, outputPath) {
  // Step 1: Upload and convert
  const formData = new FormData();
  formData.append('video', fs.createReadStream(inputPath));
  
  const convertResponse = await axios.post(
    'https://your-app.vercel.app/api/convert',
    formData,
    { headers: formData.getHeaders() }
  );
  
  if (convertResponse.data.success) {
    const { downloadUrl, filename, originalName } = convertResponse.data;
    
    // Step 2: Download the converted file
    const downloadResponse = await axios({
      method: 'GET',
      url: `https://your-app.vercel.app${downloadUrl}?original=${encodeURIComponent(originalName)}`,
      responseType: 'stream'
    });
    
    // Step 3: Save to file
    const writer = fs.createWriteStream(outputPath);
    downloadResponse.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } else {
    throw new Error('Conversion failed');
  }
}

// Usage
convertAndDownload('./input.mp4', './output.mp3')
  .then(() => console.log('Download complete!'))
  .catch(err => console.error('Error:', err));
```

---

## 📋 API Endpoint Details

### **Download Endpoint:**

```
GET /api/download/:filename?original={original-name}
```

### **Parameters:**

- **`:filename`** (required) - The UUID filename from conversion response
  - Example: `a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp3`

- **`original`** (optional) - Original filename for download
  - Example: `my-video.mp4`
  - Used to set the download filename

### **Response:**

- **Content-Type:** `audio/mpeg`
- **Content-Disposition:** `attachment; filename="{original-name}.mp3"`
- **Body:** MP3 file stream

### **Example Request:**

```bash
GET /api/download/a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp3?original=my-video.mp4
```

### **Example Response:**

```
HTTP/1.1 200 OK
Content-Type: audio/mpeg
Content-Disposition: attachment; filename="my-video.mp3"

[MP3 file binary data]
```

---

## 🔍 Getting the Download URL

### **From Conversion Response:**

After conversion, you get a JSON response:

```json
{
  "success": true,
  "message": "Conversion completed successfully",
  "downloadUrl": "/api/download/a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp3",
  "filename": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp3",
  "originalName": "my-video.mp4",
  "size": 12345678
}
```

**Use:**
- `downloadUrl` - Relative URL for download
- `filename` - The UUID filename
- `originalName` - Original video filename

### **Constructing Full URL:**

```javascript
// Local development
const fullUrl = `http://localhost:3000${downloadUrl}?original=${originalName}`;

// Production (Vercel)
const fullUrl = `https://your-app.vercel.app${downloadUrl}?original=${originalName}`;
```

---

## ⚠️ Important Notes

### **File Availability:**

- ✅ File is available **immediately** after conversion
- ⚠️ File is **deleted** after successful download
- ⚠️ File is **deleted** if download fails
- ⚠️ File is **deleted** if client disconnects
- ⚠️ On Vercel, files in `/tmp` are cleared between invocations

### **Download Timing:**

- ⏱️ **Download immediately** after conversion
- ⏱️ File is temporary - don't wait too long
- ⏱️ On Vercel, download within the same function invocation

### **File Naming:**

- Original filename is preserved (without extension)
- Extension is changed to `.mp3`
- Example: `my-video.mp4` → `my-video.mp3`

---

## 🐛 Troubleshooting

### **Problem: Download Button Not Appearing**

**Check:**
1. ✅ Conversion completed successfully
2. ✅ Check browser console for errors
3. ✅ Verify `downloadUrl` in response
4. ✅ Check if button is hidden by CSS

**Solution:**
```javascript
// Debug in browser console
console.log('Download URL:', downloadUrl);
console.log('Download button:', document.getElementById('downloadBtn'));
```

### **Problem: 404 File Not Found**

**Causes:**
- File was already deleted
- Wrong filename
- File expired (Vercel cleared `/tmp`)

**Solution:**
- Download immediately after conversion
- Verify filename matches conversion response
- Check server logs for file path

### **Problem: Download Starts But Fails**

**Check:**
1. ✅ File size limits
2. ✅ Network connection
3. ✅ Server timeout
4. ✅ Browser download settings

**Solution:**
- Check file size (max 500MB)
- Verify stable network connection
- Check browser download folder permissions

### **Problem: Wrong Filename**

**Check:**
- `original` parameter in URL
- Server response headers
- Browser download settings

**Solution:**
```javascript
// Ensure original name is URL encoded
const url = `/api/download/${filename}?original=${encodeURIComponent(originalName)}`;
```

---

## 📱 Mobile Download

### **On Mobile Browsers:**

1. **Tap the download button**
2. **File downloads to device**
3. **Access via Downloads app** (Android) or **Files app** (iOS)

### **Note:**
- Some mobile browsers may open file in player instead of downloading
- Use "Open in..." or "Share" menu to save file

---

## 🔐 Security Notes

### **File Access:**

- ✅ Files are **temporary** and auto-deleted
- ✅ No persistent storage
- ✅ Files are **not publicly listed**
- ✅ Access requires exact filename (UUID)

### **Privacy:**

- ✅ Files are deleted after download
- ✅ No file history stored
- ✅ Each conversion gets unique UUID
- ✅ Files cannot be accessed without exact URL

---

## 🎯 Quick Reference

### **Web Interface:**
1. Upload file
2. Click "Convert to MP3"
3. Click "📥 Download MP3" button

### **Direct URL:**
```
https://your-app.vercel.app/api/download/{filename}?original={original-name}
```

### **cURL:**
```bash
curl -O "https://your-app.vercel.app/api/download/{filename}?original={original-name}"
```

### **JavaScript:**
```javascript
window.open(`/api/download/${filename}?original=${originalName}`);
```

---

## 📝 Summary

**Easiest Method:** Use the web interface - click the download button after conversion!

**API Method:** Use `/api/download/{filename}?original={original-name}`

**Important:**
- ✅ Download immediately after conversion
- ✅ Files are temporary and auto-deleted
- ✅ Use the `original` parameter for correct filename

**Your download functionality is ready to use!** 🎯

