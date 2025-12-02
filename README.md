# 🎵 MP4 to MP3 Converter v2.0

A complete, production-ready MP4 to MP3 converter with automatic FFmpeg installation (ffmpeg-static), modern web interface, and robust API.

## ✨ Features

### 🚀 **Automatic FFmpeg Setup**
- One-command FFmpeg installation for Windows
- Automatic path configuration
- No manual setup required

### 🌐 **Modern Web Interface**
- Beautiful, responsive design
- Drag & drop file upload
- Real-time conversion progress
- Instant download with auto-refresh
- Mobile-friendly
- Clean interface reset after each conversion

### 🔧 **Robust API**
- RESTful endpoints
- Comprehensive error handling
- File validation & size limits
- Automatic cleanup
- CORS enabled

### 📁 **Supported Formats**
- MP4 (video/mp4, audio/mp4)
- AVI (video/avi)
- MOV (video/mov)
- WMV (video/wmv)
- Maximum file size: 500MB

### 🗂️ **File Management**
- Uploaded MP4 files are **immediately deleted** after conversion
- Converted MP3 files are **immediately deleted** after successful download
- Automatic cleanup on download errors, interruptions, or client disconnects
- **Zero storage accumulation** - files are removed as soon as they're no longer needed
- Memory-efficient streaming for large files
- **Auto-refresh** - page refreshes after download for clean interface

### 🎯 **Quality Output**
- MP3 format (192kbps)
- 44.1kHz sample rate
- Stereo audio
- High-quality encoding

---

## 🛠️ Installation & Setup

### **Step 1: Install Dependencies**
```bash
npm install
```
*This automatically installs FFmpeg via ffmpeg-static - no manual setup required!*

### **Step 3: Start the Server**
```bash
npm start
```

### **Step 4: Open Web Interface**
Visit: `http://localhost:3000`

---

## 📖 Manual FFmpeg Installation (Alternative)

If automatic setup fails, install FFmpeg manually:

1. **Download:** https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
2. **Extract to:** `C:\ffmpeg\`
3. **Move files:** Copy `ffmpeg.exe`, `ffplay.exe`, `ffprobe.exe` to `C:\ffmpeg\`
4. **Add to PATH:** Add `C:\ffmpeg` to your system PATH
5. **Test:** `ffmpeg -version`

---

## 🎮 Usage

### **Web Interface (Recommended)**
1. Open `http://localhost:3000`
2. Click "Choose a video file" or drag & drop
3. Click "Convert to MP3"
4. Wait for conversion to complete
5. Click "Download MP3" (page refreshes automatically after download)

### **API Usage**
```bash
# Convert file via API
curl -X POST -F "video=@example.mp4" http://localhost:3000/api/convert

# Check server status
curl http://localhost:3000/api/health

# Download converted file
curl -O "http://localhost:3000/api/download/filename.mp3"
```

### **Programmatic Usage**
```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function convertVideo(inputPath) {
    const formData = new FormData();
    formData.append('video', fs.createReadStream(inputPath));

    const response = await axios.post('http://localhost:3000/api/convert', formData, {
        headers: formData.getHeaders()
    });

    if (response.data.success) {
        // Download the MP3
        const downloadUrl = `http://localhost:3000${response.data.downloadUrl}`;
        // ... download logic
    }
}
```

---

## 📋 API Endpoints

### **GET /** - Web Interface
Serves the main web application.

### **GET /api/health** - Health Check
```json
{
  "status": "OK",
  "message": "MP4 to MP3 Converter API is running",
  "ffmpeg": {
    "path": "C:\\ffmpeg\\ffmpeg.exe",
    "available": true
  }
}
```

### **POST /api/convert** - Convert Video
Upload and convert a video file to MP3.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `video` field with video file

**Response (Success):**
```json
{
  "success": true,
  "message": "Conversion completed successfully",
  "downloadUrl": "/api/download/uuid.mp3",
  "filename": "uuid.mp3",
  "originalName": "input.mp4",
  "size": 12345678
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Conversion failed",
  "message": "Specific error message"
}
```

### **GET /api/download/:filename** - Download MP3
Download the converted MP3 file.

**Parameters:**
- `filename`: The filename from conversion response

---

## 🧪 Testing

### **Run System Tests**
```bash
npm run test
```

This checks:
- ✅ Node.js dependencies
- ✅ FFmpeg installation
- ✅ Required directories
- ✅ Server configuration
- ✅ Web interface files

### **Test API Endpoints**
```bash
# Health check
curl http://localhost:3000/api/health

# Test with sample file (replace with actual file)
curl -X POST -F "video=@test.mp4" http://localhost:3000/api/convert
```

---

## ⚙️ Configuration

### **Environment Variables**
- `PORT`: Server port (default: 3000)
- `FFMPEG_PATH`: Custom FFmpeg executable path

### **File Limits**
- Maximum file size: 500MB
- Supported formats: MP4, AVI, MOV, WMV
- Output format: MP3 (192kbps, 44.1kHz, stereo)

### **Directories**
- `uploads/`: Temporary upload storage
- `converted/`: Converted MP3 files
- `public/`: Web interface assets

---

## 🚨 Troubleshooting

### **"Cannot find ffmpeg"**
```bash
# Check FFmpeg installation
npm run test

# Re-run setup
node setup.js

# Manual check
ffmpeg -version
```

### **"Connection failed"**
```bash
# Make sure server is running
npm start

# Check server status
curl http://localhost:3000/api/health

# Try different port
PORT=8080 npm start
```

### **"File too large"**
- Maximum file size is 500MB
- Compress your video file or split into smaller parts

### **Conversion fails**
```bash
# Check FFmpeg can process the file
ffmpeg -i "yourfile.mp4" -f null -

# Check server logs for detailed errors
npm start  # Look at console output
```

### **Web interface not loading**
- Clear browser cache
- Try incognito mode
- Check firewall settings
- Verify server is running on correct port

---

## 🏗️ Project Structure

```
mp4-to-mp3-converter/
├── server.js              # Main server application
├── setup.js               # FFmpeg setup script
├── test.js                # System test script
├── package.json           # Dependencies & scripts
├── README.md              # This documentation
├── public/
│   └── index.html         # Web interface
├── uploads/               # Temporary uploads (auto-created)
├── converted/             # Converted files (auto-created)
└── node_modules/          # Dependencies (npm install)
```

---

## 📄 License

MIT License - Free to use, modify, and distribute.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

## 🆘 Support

- **Issues:** GitHub Issues
- **Documentation:** This README
- **API Docs:** `/api/health` endpoint

---

**🎉 Happy converting! Your MP4 to MP3 converter is ready to use.**
