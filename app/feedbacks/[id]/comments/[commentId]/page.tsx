"use client";
import FeedbackSummaryLoading from "@/components/FeedbackSummaryLoading";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useGetCommentId } from "@/hooks/useGetCommentId";
import { useGetFeedbackId } from "@/hooks/useGetFeedbackId";
import { useGetUserUpvotes } from "@/hooks/useGetUserUpvotes";
import { useRouter } from "next/navigation";
import Comments from "../components/Comments";
import CommentsFeedbackSummary from "../components/CommentsFeedbackSummary";
import CommentsLoading from "../components/CommentsLoading";
import Header from "../components/Header";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  params: { id: string; commentId: string };
  searchParams: { replyingTo: string };
}

const Page = ({
  params: { id, commentId },
  searchParams: { replyingTo },
}: Props) => {
  const { data: feedback, isLoading: isFeedbackLoading } = useGetFeedbackId(id);
  const { data: upvotes } = useGetUserUpvotes();
  const { data: comment, isLoading: isCommentsLoading } = useGetCommentId(
    id,
    commentId
  );

  return (
    <main className="lg:max-w-[1200px] lgmd:px-10 mx-auto min-h-screen flex mdsm:flex-col lgmd:gap-8 lg:py-[50px] md:pt-[40px] md:pb-[40px] sm:py-[25px] sm:px-4">
      <div className="flex flex-col w-full">
        <Header feedbackId={feedback?.id}></Header>
        <div className="flex flex-col w-full h-full rounded-[10px] overflow-hidden bg-white">
          {isFeedbackLoading ? (
            <FeedbackSummaryLoading className="rounded-none"></FeedbackSummaryLoading>
          ) : (
            <>
              <CommentsFeedbackSummary
                feedback={feedback!}
                commentsNumber={feedback!.comments.length}
                upvotes={upvotes}
              ></CommentsFeedbackSummary>
              <SeeFullPost feedbackId={id}></SeeFullPost>
            </>
          )}
          {isCommentsLoading ? (
            <CommentsLoading
              showCommentsNumber={false}
              count={1}
            ></CommentsLoading>
          ) : null}
          {comment ? (
            <Comments
              comments={[comment!]}
              feedbackId={id}
              showCommentsNumber={false}
              autoSeeReplies={!replyingTo}
            ></Comments>
          ) : null}
        </div>
      </div>
    </main>
  );
};

interface SeeFullPostProps {
  feedbackId: string;
}

const SeeFullPost = ({ feedbackId }: SeeFullPostProps) => {
  const router = useRouter();

  return (
    <div className="w-full px-6 grid lgmd:grid-cols-[max-content,1fr,max-content]">
      <h4 className="h4 text-dark-sky-blue text-wrap sm:hidden">
        Single comment thread
      </h4>
      <div className="relative mx-2 sm:hidden">
        <div className="absolute top-1/2 -translate-y-1/2 h-[1px] left-0 right-0 bg-steel-blue/20"></div>
      </div>
      <div
        className="lgmd:h4 sm:h3 font-bold text-dark-sky-blue hover:underline cursor-pointer text-wrap"
        onClick={() => {
          router.push(`/feedbacks/${feedbackId}/comments`);
        }}
      >
        See full Post
      </div>
    </div>
  );
};

const SeeFullPostLoading = () => {
  return <LoadingSkeleton></LoadingSkeleton>;
};

export default Page;
