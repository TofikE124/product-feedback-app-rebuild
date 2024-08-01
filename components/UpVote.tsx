import React, { useEffect } from "react";
import Icon from "./Icon";
import UpArrow from "/public/shared/icon-caret-up.svg";
import { useRemoveUpvote } from "@/hooks/useRemoveUpvote";
import { useUpvote } from "@/hooks/useUpvote";
import { useGetUserUpvotes } from "@/hooks/useGetUserUpvotes";
import { FeedbackWith_UpVotes_Comments } from "@/types/Feedback";
import { useGetFeedbackId } from "@/hooks/useGetFeedbackId";

interface UpVoteProps {
  feedbackId: string;
  horizontal?: boolean;
}

const UpVoteButton = ({ feedbackId, horizontal }: UpVoteProps) => {
  const { data: feedback } = useGetFeedbackId(feedbackId);
  const { data: myUpVotes } = useGetUserUpvotes();
  const { mutate: handleUpVote, isPending: isUpVoting } = useUpvote(feedbackId);
  const { mutate: handleRemoveUpvote, isPending: isRemovingUpVoting } =
    useRemoveUpvote(feedbackId);

  const isUpvoted = () =>
    myUpVotes.some((vote) => vote.feedbackId == feedbackId);

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpvoted()) handleRemoveUpvote();
    else handleUpVote();
  };

  return (
    <div
      className={`flex items-center w-fit rounded-[10px] cursor-pointer select-none ${
        isUpvoted() ? "bg-dark-sky-blue " : "bg-soft-white hover:bg-[#CFD7FF]"
      }
        ${
          horizontal
            ? "flex-row gap py-[6px] pr-3 pl-4 gap-[10px]"
            : "lgmd:flex-col lgmd:gap-2 lgmd:px-3 lgmd:pb-2 lgmd:pt-3 sm:flex-row sm:gap-[10px] sm:py-[6px] sm:pr-3 sm:pl-4 "
        }`}
      onClick={handleUpvoteClick}
    >
      <Icon icon={UpArrow} color={isUpvoted() ? "#fff" : "#4661E6"}></Icon>
      <p
        className={`text-[13px] font-bold tracking-[-0.18px] ${
          isUpvoted() ? "text-white" : "text-navy-blue"
        }`}
      >
        {feedback?.upVotes.length}
      </p>
    </div>
  );
};

export default UpVoteButton;
