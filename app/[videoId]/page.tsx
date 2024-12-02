"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Youtube } from "lucide-react";
import { CommentList } from "@/components/comments/comment-list";
import type { YouTubeComment } from "@/lib/youtube";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VideoPage({ params }: { params: { videoId: string } }) {
  const [comments, setComments] = useState<YouTubeComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch("/api/process-video", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            youtubeUrl: `https://youtube.com/watch?v=${params.videoId}`,
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to process video");
        }
        
        setComments(data.data.comments);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error processing video:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [params.videoId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Youtube className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl font-bold">YouTube Comments</h1>
          </div>
          <Link href="/">
            <Button variant="outline">Try Another Video</Button>
          </Link>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading comments...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <CommentList comments={comments} />
      </Card>
    </main>
  );
}
