import { NextResponse } from "next/server";
import { extractVideoId, getTopComments } from "@/lib/youtube";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { youtubeUrl } = body;

    if (!process.env.YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: "YouTube API is not configured" },
        { status: 500 }
      );
    }

    const videoId = await extractVideoId(youtubeUrl);
    const comments = await getTopComments(videoId);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        videoId,
        comments
      }
    });
  } catch (error) {
    console.error('Error processing video:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to process video";
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}