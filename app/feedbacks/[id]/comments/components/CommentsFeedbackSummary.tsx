import FeedbackSummary from "@/components/FeedbackSummary";
import { FeedbackWith_UpVotes_Comments } from "@/types/Feedback";
import { UpVote } from "@prisma/client";

interface CommentsFeedbackSummaryProps {
  feedback: FeedbackWith_UpVotes_Comments;
  upvotes: UpVote[];
  commentsNumber: number;
}

const CommentsFeedbackSummary = ({
  commentsNumber,
  feedback,
  upvotes,
}: CommentsFeedbackSummaryProps) => {
  return (
    <FeedbackSummary
      feedback={feedback}
      commentsNumber={commentsNumber}
      myUpVotes={upvotes}
      className="rounded-none"
    ></FeedbackSummary>
  );
};

export default CommentsFeedbackSummary;
