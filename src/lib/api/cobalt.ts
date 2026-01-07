// Download implementation using external services
// Cobalt v7 API was shut down November 2024
import { ApiResponse, DownloadInfo } from './youtube';

interface DownloadLink {
  quality: string;
  format: string;
  url: string;
  filesize?: string;
}

export async function getDirectDownloadLinks(
  url: string
): Promise<ApiResponse<{ video: DownloadLink[]; audio: DownloadLink[] }>> {
  console.log('🔍 Gerando opções de download para:', url);
  
  // Return empty arrays to trigger fallback mode with external services
  return {
    success: true,
    data: {
      video: [],
      audio: [],
    },
  };
}

export async function downloadWithCobalt(
  url: string,
  quality: string,
  format: string
): Promise<ApiResponse<DownloadInfo>> {
  console.log('🚀 Gerando link de download:', { url, quality, format });
  
  const videoId = extractVideoId(url);
  if (!videoId) {
    return {
      success: false,
      error: 'URL inválida do YouTube',
    };
  }

  try {
    const isAudio = format === 'MP3';
    let externalUrl: string;
    
    if (isAudio) {
      // Audio download service
      externalUrl = `https://ytmp3.nu/IwVJ/?url=${encodeURIComponent(url)}`;
    } else {
      // Video download services based on quality
      if (quality === '1080p' || quality === '720p') {
        externalUrl = `https://en.savefrom.net/1-youtube-video-downloader-99/#url=${encodeURIComponent(url)}`;
      } else {
        externalUrl = `https://www.y2mate.com/download?url=${encodeURIComponent(url)}&q=${quality.replace('p', '')}`;
      }
    }

    console.log('✅ Link gerado:', externalUrl);

    return {
      success: true,
      data: {
        videoId,
        quality,
        format,
        type: isAudio ? 'audio' : 'video',
        downloadUrl: externalUrl,
        message: 'Abrindo serviço de download...',
        status: 'redirect',
      },
    };
  } catch (error) {
    console.error('❌ Erro ao gerar link:', error);
    return {
      success: false,
      error: 'Não foi possível gerar o link de download',
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
