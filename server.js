const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure FFmpeg to use the static binary
ffmpeg.setFfmpegPath(ffmpegStatic);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const convertedDir = path.join(__dirname, 'converted');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(convertedDir)) fs.mkdirSync(convertedDir, { recursive: true });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'audio/mp4', 'video/avi', 'video/mov', 'video/wmv'];
    const allowedExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.m4v'];

    const mimeTypeValid = allowedTypes.includes(file.mimetype);
    const extensionValid = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());

    if (mimeTypeValid || extensionValid) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, AVI, MOV, and WMV files are allowed.'));
    }
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MP4 to MP3 Converter API is running',
    ffmpeg: {
      type: 'ffmpeg-static',
      path: ffmpegStatic,
      available: fs.existsSync(ffmpegStatic)
    }
  });
});

// Convert endpoint
app.post('/api/convert', upload.single('video'), async (req, res) => {
  try {
    console.log('Convert request received');
    console.log('Files:', req.files);
    console.log('File:', req.file);

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const inputPath = req.file.path;
    const outputFilename = `${uuidv4()}.mp3`;
    const outputPath = path.join(convertedDir, outputFilename);

    console.log(`Converting: ${req.file.originalname} -> ${outputFilename}`);
    console.log(`Input: ${inputPath} (exists: ${fs.existsSync(inputPath)})`);
    console.log(`Output: ${outputPath}`);

    // Convert video to MP3
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat('mp3')
        .audioCodec('libmp3lame')
        .audioBitrate(192)
        .audioFrequency(44100)
        .audioChannels(2)
        .on('progress', (progress) => {
          const percent = progress.percent ? Math.round(progress.percent) : 'processing';
          console.log(`Processing: ${percent}% done`);
        })
        .on('end', () => {
          console.log('Conversion completed successfully');
          console.log(`Output file exists: ${fs.existsSync(outputPath)}`);
          resolve();
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .save(outputPath);
    });

    // Clean up input file
    console.log('Cleaning up input file...');
    fs.unlinkSync(inputPath);
    console.log('Input file cleaned up');

    // Generate download URL
    const downloadUrl = `/api/download/${outputFilename}`;
    console.log('Download URL generated:', downloadUrl);

    const responseData = {
      success: true,
      message: 'Conversion completed successfully',
      downloadUrl: downloadUrl,
      filename: outputFilename,
      originalName: req.file.originalname,
      size: req.file.size
    };

    console.log('About to send response:', JSON.stringify(responseData, null, 2));

    res.json(responseData);
    console.log('Response sent successfully');

  } catch (error) {
    console.error('Conversion error:', error);

    // Clean up files on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: 'Conversion failed',
      message: error.message
    });
  }
});

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(convertedDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      error: 'File not found'
    });
  }

  // Set headers for file download
  const originalName = req.query.original || 'converted.mp3';
  res.setHeader('Content-Disposition', `attachment; filename="${originalName.replace(/\.[^/.]+$/, '')}.mp3"`);
  res.setHeader('Content-Type', 'audio/mpeg');

  console.log(`Starting download: ${filename} -> ${originalName}.mp3`);

  // Stream the file
  const fileStream = fs.createReadStream(filePath);

  // Handle successful download completion
  res.on('finish', () => {
    console.log(`Download completed, removing file: ${filename}`);
    // Immediately delete the file after download completes
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`File removed from storage: ${filename}`);
      } catch (error) {
        console.error(`Failed to remove file ${filename}:`, error);
      }
    }
  });

  // Handle download errors
  res.on('error', (error) => {
    console.error(`Download error for ${filename}:`, error);
    // Still try to clean up the file on error
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`File removed from storage after error: ${filename}`);
      } catch (cleanupError) {
        console.error(`Failed to cleanup file after error ${filename}:`, cleanupError);
      }
    }
  });

  // Handle client disconnect
  req.on('close', () => {
    if (!res.finished) {
      console.log(`Download interrupted, cleaning up: ${filename}`);
      // Clean up if download was interrupted
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`File removed from storage after interruption: ${filename}`);
        } catch (error) {
          console.error(`Failed to cleanup interrupted download ${filename}:`, error);
        }
      }
    }
  });

  fileStream.pipe(res);
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'Maximum file size is 500MB'
      });
    }
  }

  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🎵 MP4 to MP3 Converter Server');
  console.log('==============================');
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`FFmpeg path: ${ffmpegStatic}`);
  console.log(`FFmpeg available: ${fs.existsSync(ffmpegStatic) ? '✅' : '❌'}`);
  console.log('');
  console.log('Ready to convert MP4 files to MP3!');
});

module.exports = app;
