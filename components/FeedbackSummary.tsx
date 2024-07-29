import { useGetFeedbackId } from "@/hooks/useGetFeedbackId";
import { useRemoveUpvote } from "@/hooks/useRemoveUpvote";
import { useUpvote } from "@/hooks/useUpvote";
import { FeedbackWithUpVotesAndComments } from "@/types/Feedback";
import { UpVote } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { memo, useRef } from "react";
import FeedbackType from "./FeedbackType";
import UpVoteButton from "./UpVote";
import CommentsIcon from "/public/shared/icon-comments.svg";

interface FeedbackSummaryProps {
  feedback: FeedbackWithUpVotesAndComments;
  myUpVotes: UpVote[];
  commentsNumber?: number;
  to?: string;
}

const FeedbackSummary = memo(
  ({ feedback, myUpVotes, commentsNumber, to }: FeedbackSummaryProps) => {
    const { data } = useGetFeedbackId(feedback.id, feedback);
    const ref = useRef<HTMLDivElement>(null);

    const router = useRouter();

    const isUpvoted = () =>
      myUpVotes.some((vote) => vote.feedbackId == feedback.id);

    const { mutate: handleUpVote, isPending: isUpVoting } = useUpvote(
      feedback.id
    );

    const { mutate: handleRemoveUpvote, isPending: isRemovingUpVoting } =
      useRemoveUpvote(feedback.id);

    const handleUpvoteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isUpvoted()) handleRemoveUpvote();
      else handleUpVote();
    };

    const handleCategoryClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    const handleBackgroundClick = (e: React.MouseEvent) => {
      if (to) router.push(to);
    };

    return (
      <div
        onClick={handleBackgroundClick}
        ref={ref}
        className={`relative bg-white rounded-[10px] h-fit lgmd:p-8 sm:p-6 w-full ${
          to ? "cursor-pointer" : ""
        }`}
      >
        <div className="relative grid z-[2] lgmd:grid-cols-[max-content,max-content,1fr] lgmd:gap-10 sm:grid-cols-2 sm:gap-y-4">
          <div className="lgmd:col-start-1 sm:row-start-2">
            <UpVoteButton
              votes={data?.upVotes.length || 0}
              active={isUpvoted()}
              onClick={handleUpvoteClick}
            ></UpVoteButton>
          </div>
          <div className="lgmd:col-start-2 flex flex-col">
            <h3 className="h3 text-navy-blue lgmd:mb-1 sm:mb-2">
              {data?.title}
            </h3>
            <p className="body1 text-steel-blue lgmd:mb-3 sm:mb-2">
              {data?.description}
            </p>
            <FeedbackType
              text={data?.category || ""}
              onClick={handleCategoryClick}
            ></FeedbackType>
          </div>
          <div className="lgmd:col-start-3 sm:row-start-2 flex items-center gap-2 ml-auto self-center">
            <Image src={CommentsIcon} alt="Comments Icon" />
            <p className="body1 text-navy-blue font-bold">
              {commentsNumber ?? data?.comments.length}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

export default FeedbackSummary;
