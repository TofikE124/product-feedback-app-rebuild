import { useGetFeedbackId } from "@/hooks/useGetFeedbackId";
import { useRemoveUpvote } from "@/hooks/useRemoveUpvote";
import { useUpvote } from "@/hooks/useUpvote";
import { FeedbackWith_UpVotes_Comments } from "@/types/Feedback";
import { UpVote } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { memo, useRef } from "react";
import FeedbackType from "./FeedbackType";
import UpVoteButton from "./UpVote";
import CommentsIcon from "/public/shared/icon-comments.svg";
import { twMerge } from "tailwind-merge";

interface FeedbackSummaryProps {
  feedback: FeedbackWith_UpVotes_Comments;
  myUpVotes: UpVote[];
  commentsNumber?: number;
  to?: string;
  className?: string;
}

const FeedbackSummary = memo(
  ({ feedback, commentsNumber, to, className }: FeedbackSummaryProps) => {
    const { data } = useGetFeedbackId(feedback.id, feedback);
    const ref = useRef<HTMLDivElement>(null);

    const router = useRouter();

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
        className={twMerge(
          `relative bg-white rounded-[10px] h-fit lgmd:p-8 sm:p-6 w-full ${
            to ? "cursor-pointer" : ""
          }`,
          className
        )}
      >
        <div className="relative grid z-[2] lgmd:grid-cols-[max-content,1fr,max-content] lgmd:gap-10 sm:grid-cols-[1fr,max-content] sm:gap-y-4">
          <div className="lgmd:col-start-1 sm:row-start-2">
            <UpVoteButton feedbackId={feedback.id}></UpVoteButton>
          </div>
          <div className="lgmd:col-start-2 flex flex-col">
            <h3 className="h3 text-navy-blue lgmd:mb-1 sm:mb-2">
              {data?.title}
            </h3>
            <p className="body1 text-steel-blue lgmd:mb-3 sm:mb-2">
              {data?.description}
            </p>
            <FeedbackType
              category={data?.category!}
              onClick={handleCategoryClick}
            ></FeedbackType>
          </div>
          <div className="lgmd:col-start-3 sm:row-start-2 flex items-center gap-2 ml-auto self-center">
            <Image src={CommentsIcon} alt="Comments Icon" />
            <p className="body1 text-navy-blue font-bold">
              {data?.comments.length}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

FeedbackSummary.displayName = "FeedbackSummary";
export default FeedbackSummary;
