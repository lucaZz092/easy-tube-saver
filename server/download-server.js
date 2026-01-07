import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Directory to store temporary downloads
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

// Clean up old files periodically (older than 1 hour)
setInterval(() => {
  const files = fs.readdirSync(DOWNLOAD_DIR);
  const now = Date.now();
  files.forEach(file => {
    const filePath = path.join(DOWNLOAD_DIR, file);
    const stats = fs.statSync(filePath);
    if (now - stats.mtimeMs > 3600000) { // 1 hour
      fs.unlinkSync(filePath);
      console.log(`Deleted old file: ${file}`);
    }
  });
}, 600000); // Run every 10 minutes

// Extract video ID from URL
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Check if yt-dlp is installed
app.get('/health', async (req, res) => {
  try {
    await execPromise('yt-dlp --version');
    res.json({ status: 'ok', message: 'yt-dlp is available' });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'yt-dlp not installed. Please install it first.',
      instructions: 'Run: pip install yt-dlp or brew install yt-dlp'
    });
  }
});

// Get video info
app.post('/api/video-info', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });
    }

    const command = `yt-dlp --dump-json "${url}"`;
    const { stdout } = await execPromise(command);
    const info = JSON.parse(stdout);

    const videoFormats = info.formats
      .filter(f => f.vcodec !== 'none' && f.acodec !== 'none')
      .sort((a, b) => (b.height || 0) - (a.height || 0));

    const audioFormats = info.formats
      .filter(f => f.acodec !== 'none' && f.vcodec === 'none')
      .sort((a, b) => (b.abr || 0) - (a.abr || 0));

    res.json({
      success: true,
      data: {
        id: videoId,
        title: info.title,
        author: info.uploader || info.channel,
        thumbnail: info.thumbnail,
        duration: info.duration,
        formats: {
          video: videoFormats.slice(0, 4).map(f => ({
            quality: f.height ? `${f.height}p` : 'unknown',
            format: f.ext?.toUpperCase() || 'MP4',
            filesize: f.filesize ? `${(f.filesize / 1024 / 1024).toFixed(0)} MB` : 'N/A',
          })),
          audio: audioFormats.slice(0, 3).map(f => ({
            quality: f.abr ? `${Math.round(f.abr)}kbps` : '128kbps',
            format: 'MP3',
            filesize: f.filesize ? `${(f.filesize / 1024 / 1024).toFixed(0)} MB` : 'N/A',
          })),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Download video
app.post('/api/download', async (req, res) => {
  try {
    const { url, quality, format } = req.body;
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });
    }

    const isAudio = format === 'MP3';
    const timestamp = Date.now();
    const filename = `${videoId}_${timestamp}`;
    const outputPath = path.join(DOWNLOAD_DIR, filename);

    let command;
    if (isAudio) {
      // Extract audio and convert to MP3
      command = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputPath}.%(ext)s" "${url}"`;
    } else {
      // Download video with specific quality
      const height = quality.replace('p', '');
      command = `yt-dlp -f "bestvideo[height<=${height}]+bestaudio/best[height<=${height}]" --merge-output-format mp4 -o "${outputPath}.%(ext)s" "${url}"`;
    }

    console.log('Executing command:', command);
    
    // Execute download
    await execPromise(command, { maxBuffer: 1024 * 1024 * 100 }); // 100MB buffer

    // Find the downloaded file
    const files = fs.readdirSync(DOWNLOAD_DIR).filter(f => f.startsWith(filename));
    
    if (files.length === 0) {
      throw new Error('Download failed - file not found');
    }

    const downloadedFile = files[0];
    const filePath = path.join(DOWNLOAD_DIR, downloadedFile);

    res.json({
      success: true,
      data: {
        videoId,
        quality,
        format,
        filename: downloadedFile,
        downloadUrl: `/api/file/${downloadedFile}`,
        message: 'Download pronto!',
        status: 'ready',
      },
    });
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve downloaded file
app.get('/api/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(DOWNLOAD_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Error sending file:', err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Download server running on http://localhost:${PORT}`);
  console.log(`Download directory: ${DOWNLOAD_DIR}`);
});
