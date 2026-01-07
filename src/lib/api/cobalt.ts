// Direct download implementation using multiple APIs
import { ApiResponse, DownloadInfo } from './youtube';

const COBALT_API_URL = 'https://api.cobalt.tools/api/json';

interface DownloadLink {
  quality: string;
  format: string;
  url: string;
  filesize?: string;
}

export async function getDirectDownloadLinks(
  url: string
): Promise<ApiResponse<{ video: DownloadLink[]; audio: DownloadLink[] }>> {
  try {
    // Try to get direct download links from multiple sources
    const links = await fetchDownloadLinksFromAPIs(url);
    
    if (links.video.length > 0 || links.audio.length > 0) {
      return {
        success: true,
        data: links,
      };
    }

    throw new Error('No download links available');
  } catch (error) {
    console.error('Error getting download links:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get download links',
    };
  }
}

async function fetchDownloadLinksFromAPIs(url: string): Promise<{ video: DownloadLink[]; audio: DownloadLink[] }> {
  const videoLinks: DownloadLink[] = [];
  const audioLinks: DownloadLink[] = [];

  // Try Cobalt API for all qualities
  try {
    const qualities = ['1080', '720', '480', '360'];
    
    for (const quality of qualities) {
      try {
        const response = await fetch(COBALT_API_URL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            vQuality: quality,
            filenamePattern: 'basic',
            isAudioOnly: false,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.status === 'redirect' || data.status === 'stream') {
            videoLinks.push({
              quality: `${quality}p`,
              format: 'MP4',
              url: data.url,
            });
          }
        }
      } catch (e) {
        console.error(`Error fetching ${quality}p:`, e);
      }
    }

    // Try audio formats
    const audioQualities = ['320', '192', '128'];
    
    for (const quality of audioQualities) {
      try {
        const response = await fetch(COBALT_API_URL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            filenamePattern: 'basic',
            isAudioOnly: true,
            aFormat: 'mp3',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.status === 'redirect' || data.status === 'stream') {
            audioLinks.push({
              quality: `${quality}kbps`,
              format: 'MP3',
              url: data.url,
            });
            break; // Only need one audio link, Cobalt doesn't differentiate by bitrate
          }
        }
      } catch (e) {
        console.error(`Error fetching audio ${quality}kbps:`, e);
      }
    }
  } catch (error) {
    console.error('Cobalt API error:', error);
  }

  return { video: videoLinks, audio: audioLinks };
}

export async function downloadWithCobalt(
  url: string,
  quality: string,
  format: string
): Promise<ApiResponse<DownloadInfo>> {
  try {
    const isAudio = format === 'MP3';
    const videoQuality = quality.replace('p', '').replace('kbps', '');

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
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'redirect' || data.status === 'stream') {
      return {
        success: true,
        data: {
          videoId: extractVideoId(url) || '',
          quality,
          format,
          type: isAudio ? 'audio' : 'video',
          downloadUrl: data.url,
          message: 'Download pronto!',
          status: 'ready',
        },
      };
    } else if (data.status === 'picker') {
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
      throw new Error(data.text || 'Download não disponível');
    }
  } catch (error) {
    console.error('Download error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Falha no download',
    };
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
