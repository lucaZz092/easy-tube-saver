// Alternative download implementation using cobalt.tools API directly
import { ApiResponse, DownloadInfo } from './youtube';

const COBALT_API_URL = 'https://api.cobalt.tools/api/json';

// Multiple fallback services for better reliability
const FALLBACK_SERVICES = {
  video: [
    { name: 'SaveFrom', url: (videoUrl: string) => `https://en.savefrom.net/#url=${encodeURIComponent(videoUrl)}` },
    { name: '9xbuddy', url: (videoUrl: string) => `https://9xbuddy.org/process?url=${encodeURIComponent(videoUrl)}` },
    { name: 'Y2Mate', url: (videoUrl: string) => `https://y2mate.com/youtube/${extractVideoId(videoUrl)}` },
  ],
  audio: [
    { name: 'YTMP3', url: (videoUrl: string) => `https://ytmp3.cc/en2/${extractVideoId(videoUrl)}/` },
    { name: 'MP3Juice', url: (videoUrl: string) => `https://mp3juices.cc/?q=${encodeURIComponent(videoUrl)}` },
    { name: 'AudioDownloader', url: (videoUrl: string) => `https://320ytmp3.com/en/download?v=${extractVideoId(videoUrl)}` },
  ],
};

export async function downloadWithCobalt(
  url: string,
  quality: string,
  format: string
): Promise<ApiResponse<DownloadInfo>> {
  try {
    const isAudio = format === 'MP3';
    const videoQuality = quality.replace('p', ''); // 1080p -> 1080

    const response = await fetch(COBALT_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        vQuality: videoQuality,
        filenamePattern: 'basic',
        isAudioOnly: isAudio,
        aFormat: isAudio ? 'mp3' : 'mp4',
        disableMetadata: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cobalt API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'redirect' || data.status === 'stream') {
      // Direct download available
      return {
        success: true,
        data: {
          videoId: extractVideoId(url) || '',
          quality,
          format,
          type: isAudio ? 'audio' : 'video',
          downloadUrl: data.url,
          message: 'Download pronto! O arquivo será baixado automaticamente.',
          status: 'ready',
        },
      };
    } else if (data.status === 'picker') {
      // Multiple options available (for playlists, etc.)
      return {
        success: true,
        data: {
          videoId: extractVideoId(url) || '',
          quality,
          format,
          type: isAudio ? 'audio' : 'video',
          downloadUrl: data.picker[0]?.url || data.url,
          message: 'Download pronto!',
          status: 'ready',
        },
      };
    } else {
      throw new Error(data.text || 'Download failed');
    }
  } catch (error) {
    console.error('Cobalt download error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to download video',
    };
  }
}

// Get fallback download service URL
export function getDownloadFallback(url: string, isAudio: boolean): string {
  const services = isAudio ? FALLBACK_SERVICES.audio : FALLBACK_SERVICES.video;
  // Return the first service (most reliable)
  return services[0].url(url);
}

// Get all available fallback services
export function getAllFallbackServices(url: string, isAudio: boolean) {
  const services = isAudio ? FALLBACK_SERVICES.audio : FALLBACK_SERVICES.video;
  return services.map(service => ({
    name: service.name,
    url: service.url(url),
  }));
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
