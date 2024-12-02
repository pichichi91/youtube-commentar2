"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Youtube } from "lucide-react";
import { YouTubeForm } from "@/components/youtube-form";
import { CommentList } from "@/components/comments/comment-list";
import type { YouTubeComment } from "@/lib/youtube";

export default function Home() {
  const [comments, setComments] = useState<YouTubeComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: { youtubeUrl: string }) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/process-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error("Failed to process video");
      }
      
      const data = await response.json();
      setComments(data.data.comments);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error processing video:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <Youtube className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-bold text-center">YouTube Comments Fetcher</h1>
        </div>
        
        <YouTubeForm onSubmit={onSubmit} loading={loading} />

        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <CommentList comments={comments} />
      </Card>
    </main>
  );
}