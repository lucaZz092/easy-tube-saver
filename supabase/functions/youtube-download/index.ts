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

    // For a production app, you would integrate with a service like:
    // - cobalt.tools API
    // - y2mate API
    // - Custom server running yt-dlp
    
    // For demonstration, we'll return instructions and a fallback URL
    // In production, you'd call an actual download service here
    
    const isAudio = format === 'MP3';
    
    // Generate a redirect URL to a download service
    // Note: These are example URLs - in production you'd use a real service
    const downloadInfo = {
      videoId,
      quality,
      format,
      type: isAudio ? 'audio' : 'video',
      message: `Preparando download ${format} ${quality}...`,
      instructions: [
        '1. Clique no botão de download abaixo',
        '2. Aguarde o processamento do vídeo',
        '3. O download iniciará automaticamente',
      ],
      // In production, generate actual download link here
      status: 'ready',
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
