import { supabase } from '@/integrations/supabase/client';

export interface VideoInfo {
  id: string;
  title: string;
  author: string;
  authorUrl: string;
  thumbnail: string;
  thumbnailHQ: string;
  thumbnailMQ: string;
  embedUrl: string;
  watchUrl: string;
  downloadOptions: {
    video: DownloadOption[];
    audio: DownloadOption[];
  };
}

export interface DownloadOption {
  quality: string;
  format: string;
  estimatedSize: string;
}

export interface DownloadInfo {
  videoId: string;
  quality: string;
  format: string;
  type: 'audio' | 'video';
  message: string;
  instructions?: string[];
  status: string;
  downloadUrl?: string;
  fallbackUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetches video information from YouTube
 * @param url - YouTube video URL
 * @returns Video information including title, author, thumbnails and download options
 */
export async function getVideoInfo(url: string): Promise<ApiResponse<VideoInfo>> {
  try {
    const { data, error } = await supabase.functions.invoke('youtube-info', {
      body: { url },
    });

    if (error) {
      console.error('Error fetching video info:', error);
      return { success: false, error: error.message };
    }

    return data;
  } catch (error) {
    console.error('Error calling youtube-info function:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch video info',
    };
  }
}

/**
 * Initiates a download request for a video
 * @param url - YouTube video URL
 * @param quality - Desired quality (e.g., '1080p', '720p', '320kbps')
 * @param format - Desired format ('MP4' or 'MP3')
 * @returns Download information and status
 */
export async function requestDownload(
  url: string,
  quality: string,
  format: string
): Promise<ApiResponse<DownloadInfo>> {
  try {
    const { data, error } = await supabase.functions.invoke('youtube-download', {
      body: { url, quality, format },
    });

    if (error) {
      console.error('Error requesting download:', error);
      return { success: false, error: error.message };
    }

    return data;
  } catch (error) {
    console.error('Error calling youtube-download function:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process download',
    };
  }
}

/**
 * Validates if a URL is a valid YouTube URL
 * @param url - URL to validate
 * @returns boolean indicating if URL is valid
 */
export function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)[a-zA-Z0-9_-]+/,
  ];
  
  return patterns.some(pattern => pattern.test(url));
}

/**
 * Extracts video ID from a YouTube URL
 * @param url - YouTube URL
 * @returns Video ID or null if invalid
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
