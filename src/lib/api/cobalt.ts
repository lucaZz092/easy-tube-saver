// Alternative download implementation using cobalt.tools API directly
import { ApiResponse, DownloadInfo } from './youtube';

const COBALT_API_URL = 'https://api.cobalt.tools/api/json';

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

// Fallback: Use y2mate or similar services
export function getDownloadFallback(url: string, isAudio: boolean): string {
  const videoId = extractVideoId(url);
  
  if (isAudio) {
    // Audio download services
    return `https://ytmp3.nu/5N2L/?url=${encodeURIComponent(url)}`;
  } else {
    // Video download services
    return `https://www.y2mate.com/youtube/${videoId}`;
  }
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
