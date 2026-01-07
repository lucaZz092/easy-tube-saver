import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract video ID from various YouTube URL formats
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

// Quality to itag mapping for YouTube
const qualityToItag: Record<string, number> = {
  '1080p': 137,
  '720p': 22,
  '480p': 135,
  '360p': 18,
  '320kbps': 140,
  '192kbps': 140,
  '128kbps': 140,
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, quality, format } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid YouTube URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing download request:', { videoId, quality, format });

    const isAudio = format === 'MP3';
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Try to use cobalt.tools API
    try {
      const cobaltResponse = await fetch('https://api.cobalt.tools/api/json', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: videoUrl,
          vQuality: quality.replace('p', ''), // 1080p -> 1080
          filenamePattern: 'basic',
          isAudioOnly: isAudio,
          aFormat: isAudio ? 'mp3' : undefined,
        }),
      });

      if (cobaltResponse.ok) {
        const cobaltData = await cobaltResponse.json();
        
        if (cobaltData.status === 'redirect' || cobaltData.status === 'stream') {
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                videoId,
                quality,
                format,
                type: isAudio ? 'audio' : 'video',
                downloadUrl: cobaltData.url,
                message: 'Download pronto!',
                status: 'ready',
              },
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    } catch (cobaltError) {
      console.error('Cobalt API error:', cobaltError);
    }
    
    // Fallback: Use alternative services
    const fallbackUrls = {
      video: `https://www.y2mate.com/youtube/${videoId}`,
      audio: `https://ytmp3.nu/5N2L/`,
    };
    
    const downloadInfo = {
      videoId,
      quality,
      format,
      type: isAudio ? 'audio' : 'video',
      fallbackUrl: isAudio ? fallbackUrls.audio : fallbackUrls.video,
      message: `Preparando download ${format} ${quality}...`,
      instructions: [
        '1. Será aberta uma página externa de download',
        '2. Clique no botão de download/converter',
        '3. Aguarde o processamento e faça o download',
      ],
      status: 'redirect',
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: downloadInfo,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing download:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process download',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
