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

  console.log('🔍 Buscando links de download para:', url);

  // Try Cobalt API for video qualities
  const qualities = ['1080', '720', '480', '360'];
  
  for (const quality of qualities) {
    try {
      console.log(`📹 Tentando buscar qualidade ${quality}p...`);
      
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

      console.log(`📹 Resposta ${quality}p - Status:`, response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(`📹 Dados ${quality}p:`, data);
        
        if (data.status === 'redirect' && data.url) {
          videoLinks.push({
            quality: `${quality}p`,
            format: 'MP4',
            url: data.url,
          });
          console.log(`✅ Link ${quality}p adicionado!`);
        } else if (data.status === 'stream' && data.url) {
          videoLinks.push({
            quality: `${quality}p`,
            format: 'MP4',
            url: data.url,
          });
          console.log(`✅ Link ${quality}p (stream) adicionado!`);
        } else {
          console.log(`⚠️ Status não esperado para ${quality}p:`, data.status);
        }
      } else {
        console.error(`❌ Erro HTTP ${quality}p:`, response.status);
      }
    } catch (e) {
      console.error(`❌ Erro ao buscar ${quality}p:`, e);
    }
  }

  // Try audio format
  try {
    console.log('🎵 Tentando buscar áudio MP3...');
    
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

    console.log('🎵 Resposta áudio - Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('🎵 Dados áudio:', data);
      
      if ((data.status === 'redirect' || data.status === 'stream') && data.url) {
        // Add multiple bitrate entries (they all point to the same URL from Cobalt)
        audioLinks.push(
          { quality: '320kbps', format: 'MP3', url: data.url },
          { quality: '192kbps', format: 'MP3', url: data.url },
          { quality: '128kbps', format: 'MP3', url: data.url }
        );
        console.log('✅ Links de áudio adicionados!');
      } else {
        console.log('⚠️ Status não esperado para áudio:', data.status);
      }
    } else {
      console.error('❌ Erro HTTP áudio:', response.status);
    }
  } catch (e) {
    console.error('❌ Erro ao buscar áudio:', e);
  }

  console.log(`📊 Total de links encontrados - Vídeo: ${videoLinks.length}, Áudio: ${audioLinks.length}`);

  return { video: videoLinks, audio: audioLinks };
}

export async function downloadWithCobalt(
  url: string,
  quality: string,
  format: string
): Promise<ApiResponse<DownloadInfo>> {
  try {
    console.log('🚀 Iniciando download:', { url, quality, format });
    
    const isAudio = format === 'MP3';
    const videoQuality = quality.replace('p', '').replace('kbps', '');

    console.log('📤 Enviando requisição para Cobalt API...');
    
    const requestBody = {
      url: url,
      vQuality: videoQuality,
      filenamePattern: 'basic',
      isAudioOnly: isAudio,
      aFormat: isAudio ? 'mp3' : undefined,
      disableMetadata: false,
    };
    
    console.log('📦 Body da requisição:', requestBody);

    const response = await fetch(COBALT_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Resposta recebida - Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📋 Dados recebidos:', data);

    if (data.status === 'redirect' && data.url) {
      console.log('✅ Link redirect encontrado!');
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
    } else if (data.status === 'stream' && data.url) {
      console.log('✅ Link stream encontrado!');
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
    } else if (data.status === 'picker' && data.picker && data.picker.length > 0) {
      console.log('✅ Picker encontrado com', data.picker.length, 'opções');
      return {
        success: true,
        data: {
          videoId: extractVideoId(url) || '',
          quality,
          format,
          type: isAudio ? 'audio' : 'video',
          downloadUrl: data.picker[0].url,
          message: 'Download pronto!',
          status: 'ready',
        },
      };
    } else if (data.status === 'error') {
      console.error('❌ API retornou erro:', data.text);
      throw new Error(data.text || 'Erro ao processar o vídeo');
    } else {
      console.error('⚠️ Status desconhecido:', data.status, data);
      throw new Error(data.text || `Status não suportado: ${data.status}`);
    }
  } catch (error) {
    console.error('❌ Erro no download:', error);
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
