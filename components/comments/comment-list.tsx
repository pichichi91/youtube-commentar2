import { YouTubeComment } from "@/lib/youtube";
import { CommentCard } from "./comment-card";

interface CommentListProps {
  comments: YouTubeComment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Top Comments</h2>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}