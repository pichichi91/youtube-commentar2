import { google } from 'googleapis';

const youtube = google.youtube('v3');

export interface YouTubeComment {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
}

export async function extractVideoId(url: string): Promise<string> {
  const regex = /(?:youtube\.com\/watch\?v=|youtu.be\/)([^&\n?#]+)/;
  const match = url.match(regex);
  
  if (!match) {
    throw new Error('Invalid YouTube URL');
  }
  
  return match[1];
}

export async function getTopComments(videoId: string): Promise<YouTubeComment[]> {
  try {
    const response = await youtube.commentThreads.list({
      key: process.env.YOUTUBE_API_KEY,
      part: ['snippet'],
      videoId: videoId,
      maxResults: 5,
      order: 'relevance',
    });

    if (!response.data.items) {
      return [];
    }

    return response.data.items.map(item => ({
      id: item.id!,
      authorDisplayName: item.snippet!.topLevelComment!.snippet!.authorDisplayName!,
      authorProfileImageUrl: item.snippet!.topLevelComment!.snippet!.authorProfileImageUrl!,
      textDisplay: item.snippet!.topLevelComment!.snippet!.textDisplay!,
      likeCount: item.snippet!.topLevelComment!.snippet!.likeCount!,
      publishedAt: item.snippet!.topLevelComment!.snippet!.publishedAt!,
    }));
  } catch (error) {
    console.error('Error fetching YouTube comments:', error);
    throw error;
  }
}