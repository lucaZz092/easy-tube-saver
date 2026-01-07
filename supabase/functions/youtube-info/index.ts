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

// Fetch video info using YouTube's oEmbed API (no API key required)
async function getVideoInfo(videoId: string) {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  
  const response = await fetch(oembedUrl);
  
  if (!response.ok) {
    throw new Error('Video not found or unavailable');
  }
  
  const data = await response.json();
  
  return {
    id: videoId,
    title: data.title,
    author: data.author_name,
    authorUrl: data.author_url,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    thumbnailHQ: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    thumbnailMQ: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

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

    console.log('Fetching info for video:', videoId);

    const videoInfo = await getVideoInfo(videoId);

    // Generate download options (these are external service URLs)
    const downloadOptions = {
      video: [
        { quality: '1080p', format: 'MP4', estimatedSize: '~250 MB' },
        { quality: '720p', format: 'MP4', estimatedSize: '~150 MB' },
        { quality: '480p', format: 'MP4', estimatedSize: '~80 MB' },
        { quality: '360p', format: 'MP4', estimatedSize: '~40 MB' },
      ],
      audio: [
        { quality: '320kbps', format: 'MP3', estimatedSize: '~10 MB' },
        { quality: '192kbps', format: 'MP3', estimatedSize: '~7 MB' },
        { quality: '128kbps', format: 'MP3', estimatedSize: '~4 MB' },
      ],
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...videoInfo,
          downloadOptions,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching video info:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch video info',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
