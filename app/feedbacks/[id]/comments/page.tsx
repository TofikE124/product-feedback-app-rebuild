"use client";
import Button from "@/components/Button";
import FeedbackSummary from "@/components/FeedbackSummary";
import FeedbackSummaryLoading from "@/components/FeedbackSummaryLoading";
import GoBack from "@/components/GoBack";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useGetComments } from "@/hooks/useGetComments";
import { useGetFeedbackId } from "@/hooks/useGetFeedbackId";
import { useGetUserUpvotes } from "@/hooks/useGetUserUpvotes";
import { createCommentSchema } from "@/schemas/createCommentSchema";
import { CommentWith_User_RepliesLength } from "@/types/Comment";
import { FeedbackWith_UpVotes_Comments } from "@/types/Feedback";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpVote } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Icon from "@/components/Icon";
import DownArrowIconFilled from "/public/shared/icon-arrow-down-filled.svg";
import DownArrowIcon from "/public/shared/icon-arrow-down.svg";
import UpArrowIconFilled from "/public/shared/icon-arrow-up-filled.svg";
import UpArrowIcon from "/public/shared/icon-arrow-up.svg";
import CommentIcon from "/public/shared/icon-comments.svg";
import MinusCircleIcon from "/public/shared/icon-minus-circle.svg";
import PlusCircleIcon from "/public/shared/icon-plus-circle.svg";

import ExpandableTextField from "@/components/ExpandableTextField";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useCommentVote } from "@/hooks/useCommentVote";
import { useCreateReply } from "@/hooks/useCreateReply";
import { useGetCommentVotes } from "@/hooks/useGetCommentVotes";
import { useGetReplies } from "@/hooks/useGetReplies";
import { useIsOwnFeedback } from "@/hooks/useIsOwnFeedback";
import { calculateCommentVotesSum } from "@/utils/calculateCommentVotesSum";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useRemoveCommentVote } from "@/hooks/useRemoveCommentVote";

interface Props {
  params: { id: string };
}

const page = ({ params: { id } }: Props) => {
  const { data: feedback, isLoading: isFeedbackLoading } = useGetFeedbackId(id);
  const { data: upvotes } = useGetUserUpvotes();
  const { data: comments, isLoading: isCommentsLoading } = useGetComments(id);

  return (
    <main className="lg:max-w-[1200px] lgmd:px-10 mx-auto min-h-screen flex mdsm:flex-col lgmd:gap-8 lg:py-[50px] md:pt-[40px] md:pb-[40px] sm:py-[25px] sm:px-4">
      <div className="flex flex-col w-full">
        <Header feedbackId={feedback?.id}></Header>
        <div className="flex flex-col w-full h-full rounded-[10px] overflow-hidden bg-white">
          <CommentsFeedbackSummary
            feedback={feedback!}
            commentsNumber={comments?.length!}
            isFeedbackLoading={isFeedbackLoading}
            upvotes={upvotes}
          ></CommentsFeedbackSummary>
          {feedback ? (
            <AddComment feedbackId={feedback?.id || ""}></AddComment>
          ) : (
            <AddCommentLoading></AddCommentLoading>
          )}
          {isCommentsLoading ? (
            <CommentsLoading></CommentsLoading>
          ) : (
            <Comments comments={comments || []}></Comments>
          )}
        </div>
      </div>
    </main>
  );
};

interface HeaderProps {
  feedbackId?: string;
}

const Header = ({ feedbackId }: HeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between w-full mb-9 h-[45px]">
        <GoBack></GoBack>
        {feedbackId ? (
          <EditFeedback feedbackId={feedbackId}></EditFeedback>
        ) : null}
      </div>
    </>
  );
};

interface EditFeedbackProps {
  feedbackId: string;
}

const EditFeedback = ({ feedbackId }: EditFeedbackProps) => {
  const { data: isOwn, fetchStatus } = useIsOwnFeedback(feedbackId);
  return isOwn ? (
    <Link href={`/feedbacks/${feedbackId}/edit`}>
      <Button color="dark-sky-blue">Edit Feedback</Button>
    </Link>
  ) : null;
};

interface CommentsFeedbackSummaryProps {
  isFeedbackLoading: boolean;
  feedback: FeedbackWith_UpVotes_Comments;
  upvotes: UpVote[];
  commentsNumber: number;
}

const CommentsFeedbackSummary = ({
  commentsNumber,
  feedback,
  isFeedbackLoading,
  upvotes,
}: CommentsFeedbackSummaryProps) => {
  return (
    <div>
      {isFeedbackLoading ? (
        <FeedbackSummaryLoading className="rounded-none"></FeedbackSummaryLoading>
      ) : (
        <FeedbackSummary
          feedback={feedback}
          commentsNumber={commentsNumber}
          myUpVotes={upvotes}
          className="rounded-none"
        ></FeedbackSummary>
      )}
    </div>
  );
};

interface AddCommentProps {
  feedbackId: string;
  onSubmitted?: () => void;
}

const AddComment = ({
  feedbackId,
  onSubmitted = () => {},
}: AddCommentProps) => {
  type createCommentType = z.infer<typeof createCommentSchema>;
  const {
    register,
    formState: { errors },
    clearErrors,
    handleSubmit,
    setValue,
    resetField,
  } = useForm<createCommentType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      feedbackId,
      content: "",
    },
  });

  const { mutate, status } = useCreateComment(feedbackId);

  const onSubmit = async (data: createCommentType) => {
    mutate(data);
    resetField("content");
    onSubmitted();
  };

  const handleCancel = async () => {
    setValue("content", "");
    clearErrors("content");
  };

  return (
    <div className="px-8">
      <ExpandableTextField
        isLoading={status == "pending"}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        placeholder="Add a comment"
        actionLabel="Comment"
        textarea
        errorMessage={errors.content?.message}
        {...register("content")}
      ></ExpandableTextField>
    </div>
  );
};

const AddCommentLoading = () => {
  return (
    <div className="px-8 py-2">
      <LoadingSkeleton
        height={64}
        className="h-[64px]"
        borderRadius={99999}
      ></LoadingSkeleton>
    </div>
  );
};

interface CommentProps {
  comments: CommentWith_User_RepliesLength[];
}

const Comments = ({ comments }: CommentProps) => {
  return (
    <div className="pt-6 px-8 pb-12">
      <div className="mb-6">
        <h3 className="text-navy-blue h3">{comments.length} Comments</h3>
        {!comments.length ? (
          <h3 className="text-navy-blue h3 mt-2">Be the first to comment</h3>
        ) : null}
      </div>

      <div className="flex flex-col">
        {comments.map((comment) => (
          <CommentSummary comment={comment} key={comment.id}></CommentSummary>
        ))}
      </div>
    </div>
  );
};

interface CommentsLoadingProps {
  count?: number;
}

const CommentsLoading = ({ count = 3 }: CommentsLoadingProps) => {
  const arr = new Array(count).fill(0);

  return (
    <div className="pt-6 px-8 pb-12">
      <LoadingSkeleton
        width={150}
        height={26}
        borderRadius={5}
        containerClassName="h-[26px] w-[150px]"
        className="mb-6"
      ></LoadingSkeleton>
      <div className="flex flex-col gap-4">
        {arr.map((x, index) => (
          <CommentSummaryLoading key={index}></CommentSummaryLoading>
        ))}
      </div>
    </div>
  );
};

interface RepliesLoadingProps {
  count?: number;
}
const RepliesLoading = ({ count = 3 }: RepliesLoadingProps) => {
  const arr = new Array(count).fill(0);

  return (
    <div className="flex flex-col gap-4">
      {arr.map((x, index) => (
        <CommentSummaryLoading key={index}></CommentSummaryLoading>
      ))}
    </div>
  );
};

const CommentSummaryLoading = () => {
  return (
    <div className="relative flex gap-8 w-full items-start">
      <LoadingSkeleton
        width={40}
        height={40}
        borderRadius={99999}
        containerClassName="h-[40px] w-[40px]"
      ></LoadingSkeleton>

      <div className="flex flex-col w-full">
        <div className="relative flex flex-col w-full">
          <div className="flex items-end justify-between mb-4">
            <div className="flex gap-2">
              <LoadingSkeleton
                width={80}
                height={20}
                containerClassName="h-[20px]"
              ></LoadingSkeleton>
            </div>
          </div>
        </div>
        <LoadingSkeleton
          width={250}
          height={10}
          containerClassName="h-[10px]"
        ></LoadingSkeleton>
        <LoadingSkeleton
          width={250}
          height={10}
          containerClassName="h-[10px] mt-1"
        ></LoadingSkeleton>
        <div className="flex items-center gap-2 mt-2">
          <LoadingSkeleton
            width={16}
            height={16}
            containerClassName="h-[16]"
            borderRadius={4}
          ></LoadingSkeleton>
          <LoadingSkeleton
            width={50}
            height={16}
            containerClassName="h-[16]"
            borderRadius={4}
          ></LoadingSkeleton>
          <LoadingSkeleton
            width={16}
            height={16}
            containerClassName="h-[16]"
            borderRadius={4}
          ></LoadingSkeleton>
          <LoadingSkeleton
            width={60}
            height={16}
            containerClassName="h-[16]"
            borderRadius={4}
          ></LoadingSkeleton>
        </div>
      </div>
    </div>
  );
};

interface CommentSummaryProps {
  comment: CommentWith_User_RepliesLength;
  index?: number;
  isReply?: boolean;
  isLast?: boolean;
}

export const CommentSummary = ({
  comment,
  index,
  isReply,
  isLast,
}: CommentSummaryProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [areRepliesExpanded, setAreRepliesExpanded] = useState(false);

  const queryClient = useQueryClient();

  const viewReplies = () => {
    if (!queryClient.getQueryState(["comments", comment.id, "replies"])?.data)
      queryClient.prefetchQuery({
        queryKey: ["comments", comment.id, "replies"],
      });
  };

  const toggleReplies = () => {
    viewReplies();
    setAreRepliesExpanded(!areRepliesExpanded);
  };

  const handleReply = () => {
    setAreRepliesExpanded(true);
    setIsReplying(false);
  };

  const isCreatingReply = () => {
    return Boolean(
      queryClient.isMutating({
        mutationKey: ["comments", comment.id, "replies"],
      })
    );
  };

  return (
    <div
      className="relative flex gap-8 py-2 w-full items-start"
      data-comment-id={comment.id}
      data-index={index}
    >
      <CommentSummaryUserImage
        userImage={comment.user.image}
        userName={comment.user.name}
        isReply={isReply}
      ></CommentSummaryUserImage>
      <div className="flex flex-col w-full">
        <div className="relative flex flex-col w-full">
          <CommentSummaryHeader
            userName={comment.user.name}
            createdAt={comment.createdAt}
            haveReplies={Boolean(comment.replies.length)}
            areRepliesExpanded={areRepliesExpanded}
            onToggleReplies={toggleReplies}
          ></CommentSummaryHeader>
          <div className="relative flex flex-col w-full">
            <p className="body2 text-steel-blue mb-2">{comment.content}</p>
            <CommentFooter
              commentId={comment.id}
              onReplyClick={() => setIsReplying(true)}
            ></CommentFooter>
          </div>
        </div>
        <div className="flex flex-col w-full">
          {isReplying || isCreatingReply() ? (
            <CommentReply
              onReply={handleReply}
              closeReply={() => setIsReplying(false)}
              feedbackId={comment.feedbackId}
              parentId={comment.id}
              leftBorder={comment.replies.length != 0}
            ></CommentReply>
          ) : null}
          <CommentSummaryReplies
            areRepliesExpanded={areRepliesExpanded}
            commentId={comment.id}
            isCreatingReply={isCreatingReply()}
          ></CommentSummaryReplies>
        </div>
      </div>
      {isReply && !isLast ? <ReplyLeftBorder></ReplyLeftBorder> : null}
    </div>
  );
};

interface CommentSummaryRepliesProps {
  commentId: string;
  areRepliesExpanded: boolean;
  isCreatingReply: boolean;
}

const CommentSummaryReplies = ({
  commentId,
  areRepliesExpanded,
  isCreatingReply,
}: CommentSummaryRepliesProps) => {
  const { data: replies, fetchStatus: repliesFetchStatus } =
    useGetReplies(commentId);

  return repliesFetchStatus == "fetching" ? (
    <RepliesLoading count={1}></RepliesLoading>
  ) : areRepliesExpanded ? (
    <div className="flex flex-col">
      {isCreatingReply && replies?.length ? (
        <div className="mb-2">
          <CommentSummaryLoading></CommentSummaryLoading>
        </div>
      ) : null}
      {replies?.map((reply, index) => (
        <CommentSummary
          comment={reply}
          index={index}
          isReply
          isLast={index == replies.length - 1}
        ></CommentSummary>
      ))}
    </div>
  ) : null;
};

interface CommentSummaryHeaderProps {
  createdAt: Date;
  userName: string | null;
  haveReplies: boolean;
  onToggleReplies: () => void;
  areRepliesExpanded: boolean;
}

const CommentSummaryHeader = ({
  userName,
  createdAt,
  haveReplies,
  onToggleReplies,
  areRepliesExpanded,
}: CommentSummaryHeaderProps) => {
  return (
    <div className="flex items-end justify-between mb-4">
      <div className="flex gap-2">
        <h4 className="h4 text-navy-blue">{userName}</h4>
        <h4 className="h4 text-steel-blue fpont-normal">
          {moment(createdAt).fromNow()}
        </h4>
      </div>
      {haveReplies ? (
        <CommentLeftBorder
          onToggle={onToggleReplies}
          areRepliesExpanded={areRepliesExpanded}
        ></CommentLeftBorder>
      ) : null}
    </div>
  );
};

interface CommentSummaryUserImageProps {
  userImage: string | null;
  userName: string | null;
  isReply?: boolean;
}

const CommentSummaryUserImage = ({
  userImage,
  userName,
  isReply,
}: CommentSummaryUserImageProps) => {
  return (
    <div className="relative">
      <Image
        src={userImage || ""}
        alt={`${userName}'s image`}
        width={40}
        height={40}
        className="rounded-full"
      />
      {isReply ? <ImageLeftBorder></ImageLeftBorder> : null}
    </div>
  );
};

interface CommentLeftBorderProps {
  onToggle?: () => void;
  areRepliesExpanded: boolean;
}

const CommentLeftBorder = ({
  onToggle,
  areRepliesExpanded,
}: CommentLeftBorderProps) => {
  return (
    <div className="absolute left-[-52px] top-[44px] bottom-[17.5px] w-[1px] bg-[#8C92B3]/25">
      <div className="relative size-full">
        <div className="absolute top-[100%] left-0 -translate-x-1/2 p-2 -mt-2 hover:bg-steel-blue/10 rounded-full">
          <button
            onClick={onToggle}
            className="rounded-full size-4 flex items-center justify-center"
          >
            {areRepliesExpanded ? (
              <Icon icon={MinusCircleIcon} color="rgb(100,113,150,0.25)"></Icon>
            ) : (
              <Icon icon={PlusCircleIcon} color="rgb(100,113,150,0.25)"></Icon>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ImageLeftBorder = () => {
  return (
    <div className="absolute left-0 -translate-x-full -translate-y-full top-1/2 w-[52px] h-[26px] rounded-bl-3xl  border-[#8C92B3]/25 border-solid border-[1px] border-t-0 border-r-0"></div>
  );
};

const ReplyLeftBorder = () => {
  return (
    <div className="absolute left-[-52px] top-[-2px] bottom-[0px] w-[1px] bg-[#8C92B3]/25"></div>
  );
};

interface CommentFooterProps {
  onReplyClick?: () => void;
  commentId: string;
}

const CommentFooter = ({ onReplyClick, commentId }: CommentFooterProps) => {
  return (
    <div className="flex">
      <CommentVote commentId={commentId}></CommentVote>
      <button
        onClick={onReplyClick}
        className="flex gap-2 items-center hover:bg-steel-blue/10 rounded-full px-4 py-2"
      >
        <Image src={CommentIcon} alt="Comments Icon"></Image>
        <h4 className="body3 text-navy-blue">Reply</h4>
      </button>
    </div>
  );
};

interface CommentVoteProps {
  commentId: string;
}

const CommentVote = ({ commentId }: CommentVoteProps) => {
  const { data } = useGetCommentVotes(commentId);

  const { mutate: voteOnComment } = useCommentVote(commentId);
  const { mutate: removeVoteOnComment } = useRemoveCommentVote(commentId);

  const handleUpvoteClick = () => {
    if (data?.myVoteType == "UPVOTE") {
      removeVoteOnComment();
    } else voteOnComment("UPVOTE");
  };
  const handleDownvoteClick = () => {
    if (data?.myVoteType == "DOWNVOTE") {
      removeVoteOnComment();
    } else voteOnComment("DOWNVOTE");
  };

  return (
    <div className="flex items-center -ml-2">
      <button
        onClick={handleUpvoteClick}
        className="p-2 hover:bg-steel-blue/10 rounded-full cursor-pointer"
      >
        {data?.myVoteType == "UPVOTE" ? (
          <Icon icon={UpArrowIconFilled} color="black" />
        ) : (
          <Icon icon={UpArrowIcon} color="black" />
        )}
      </button>
      <div>
        <h4 className="h4 text-navy-blue">
          {calculateCommentVotesSum(data?.votes || [])}
        </h4>
      </div>
      <button
        onClick={handleDownvoteClick}
        className="p-2 hover:bg-steel-blue/10 rounded-full cursor-pointer"
      >
        {data?.myVoteType == "DOWNVOTE" ? (
          <Icon icon={DownArrowIconFilled} color="black" />
        ) : (
          <Icon icon={DownArrowIcon} color="black" />
        )}
      </button>
    </div>
  );
};

interface CommentReplyProps {
  onReply: () => void;
  parentId: string;
  closeReply: () => void;
  feedbackId: string;
  leftBorder: boolean;
}

const CommentReply = ({
  onReply,
  parentId,
  closeReply,
  feedbackId,
  leftBorder,
}: CommentReplyProps) => {
  const { mutate, status } = useCreateReply(feedbackId, parentId);

  type createCommentType = z.infer<typeof createCommentSchema>;
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
  } = useForm<createCommentType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      feedbackId,
      content: "",
      parentId,
    },
  });

  const onSubmit = (data: createCommentType) => {
    mutate(data);
    closeReply();
    onReply();
  };

  const handleCancel = async () => {
    setValue("content", "");
    clearErrors("content");
    closeReply();
  };

  return (
    <div className="relative py-2">
      <ExpandableTextField
        autoFocus
        textarea
        isLoading={status == "pending"}
        {...register("content")}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        errorMessage={errors.content?.message}
        placeholder="Add a reply"
      ></ExpandableTextField>
      {leftBorder ? (
        <div className="absolute left-[-52px] top-[-2px] bottom-0 w-[1px] bg-[#8C92B3]/25"></div>
      ) : null}
    </div>
  );
};

export default page;
