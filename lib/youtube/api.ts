import { google } from 'googleapis';
import { YouTubeComment } from './types';

const youtube = google.youtube('v3');

export async function getTopComments(videoId: string): Promise<YouTubeComment[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    throw new Error('YouTube API key is not configured');
  }

  try {
    const response = await youtube.commentThreads.list({
      key: apiKey,
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
    if (error instanceof Error) {
      if (error.message.includes('quotaExceeded')) {
        throw new Error('YouTube API quota exceeded. Please try again later.');
      }
      if (error.message.includes('invalidRequest')) {
        throw new Error('Invalid YouTube video ID');
      }
      if (error.message.includes('commentsDisabled')) {
        throw new Error('Comments are disabled for this video');
      }
    }
    throw new Error('Failed to fetch comments. Please try again later.');
  }
}