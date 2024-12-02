import { YouTubeComment } from "@/lib/youtube";
import { Card } from "@/components/ui/card";

interface CommentCardProps {
  comment: YouTubeComment;
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start space-x-4">
        <img
          src={comment.authorProfileImageUrl}
          alt={comment.authorDisplayName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{comment.authorDisplayName}</h3>
            <span className="text-sm text-gray-500">
              {new Date(comment.publishedAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-1 text-gray-700">{comment.textDisplay}</p>
          <div className="mt-2 text-sm text-gray-500">
            {comment.likeCount} likes
          </div>
        </div>
      </div>
    </Card>
  );
}