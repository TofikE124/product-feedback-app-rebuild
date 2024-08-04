"use client";
import { useGetComments } from "@/hooks/useGetComments";
import { useGetFeedbackId } from "@/hooks/useGetFeedbackId";
import { useGetUserUpvotes } from "@/hooks/useGetUserUpvotes";

import FeedbackSummaryLoading from "@/components/FeedbackSummaryLoading";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import AddComment from "./components/AddComment";
import AddCommentGuest from "./components/AddCommentGuest";
import AddCommentLoading from "./components/AddCommentLoading";
import Comments from "./components/Comments";
import CommentsFeedbackSummary from "./components/CommentsFeedbackSummary";
import CommentsLoading from "./components/CommentsLoading";
import Header from "./components/Header";

interface Props {
  params: { id: string };
}

const Page = ({ params: { id } }: Props) => {
  const { data: session } = useSession();
  const { data: feedback, isLoading: isFeedbackLoading } = useGetFeedbackId(id);
  const { data: upvotes } = useGetUserUpvotes();
  const { data: comments, isLoading: isCommentsLoading } = useGetComments(id);

  return (
    <main className="lg:max-w-[1200px] lgmd:px-10 mx-auto min-h-screen flex mdsm:flex-col lgmd:gap-8 lg:py-[50px] md:pt-[40px] md:pb-[40px] sm:py-[25px] sm:px-4">
      <div className="flex flex-col w-full">
        <Header feedbackId={feedback?.id}></Header>
        <div className="flex flex-col w-full h-full rounded-[10px] overflow-hidden bg-white">
          {isFeedbackLoading ? (
            <FeedbackSummaryLoading></FeedbackSummaryLoading>
          ) : (
            <CommentsFeedbackSummary
              feedback={feedback!}
              commentsNumber={comments?.length!}
              upvotes={upvotes}
            ></CommentsFeedbackSummary>
          )}

          {feedback ? (
            session?.user ? (
              <AddComment feedbackId={feedback?.id || ""}></AddComment>
            ) : (
              <AddCommentGuest></AddCommentGuest>
            )
          ) : (
            <AddCommentLoading></AddCommentLoading>
          )}
          {isCommentsLoading ? (
            <CommentsLoading></CommentsLoading>
          ) : (
            <Comments comments={comments || []} feedbackId={id}></Comments>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
