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
  console.log('🔍 Buscando links de download reais...');
  
  const videoId = extractVideoId(url);
  if (!videoId) {
    return {
      success: false,
      error: 'URL inválida do YouTube',
    };
  }

  try {
    // Use ytdl API to get real download links
    const apiUrl = `https://api.ytdl.org/api/get?url=${encodeURIComponent(url)}`;
    
    console.log('🌐 Consultando API ytdl...');
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('API não disponível');
    }

    const data = await response.json();
    console.log('📊 Resposta da API:', data);

    const videoLinks: DownloadLink[] = [];
    const audioLinks: DownloadLink[] = [];

    // Parse video formats
    if (data.formats && Array.isArray(data.formats)) {
      // Filter video formats with audio
      const videoFormats = data.formats.filter((f: any) => 
        f.mimeType?.includes('video') && f.hasAudio
      );

      // Add video options
      if (videoFormats.length > 0) {
        const qualities = ['1080p', '720p', '480p', '360p'];
        qualities.forEach(quality => {
          const format = videoFormats.find((f: any) => f.qualityLabel === quality);
          if (format && format.url) {
            videoLinks.push({
              quality,
              format: 'MP4',
              url: format.url,
            });
          }
        });
      }

      // Filter audio formats
      const audioFormats = data.formats.filter((f: any) => 
        f.mimeType?.includes('audio')
      );

      // Add audio options
      if (audioFormats.length > 0) {
        audioLinks.push(
          {
            quality: '320kbps',
            format: 'MP3',
            url: audioFormats[0]?.url || '',
          },
          {
            quality: '192kbps',
            format: 'MP3',
            url: audioFormats[0]?.url || '',
          },
          {
            quality: '128kbps',
            format: 'MP3',
            url: audioFormats[0]?.url || '',
          }
        );
      }
    }

    console.log('✅ Links encontrados:', { video: videoLinks.length, audio: audioLinks.length });

    return {
      success: true,
      data: {
        video: videoLinks,
        audio: audioLinks,
      },
    };
  } catch (error) {
    console.error('❌ Erro ao buscar links:', error);
    
    // Fallback: return empty to trigger fallback mode
    return {
      success: true,
      data: {
        video: [],
        audio: [],
      },
    };
  }
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
