import ExpandableTextField from "@/components/ExpandableTextField";
import Icon from "@/components/Icon";
import { PANELS } from "@/constants/panels";
import { useCommentVote } from "@/hooks/useCommentVote";
import { useCreateReply } from "@/hooks/useCreateReply";
import { useGetCommentVotes } from "@/hooks/useGetCommentVotes";
import { useGetFeedbackId } from "@/hooks/useGetFeedbackId";
import { useGetReplies } from "@/hooks/useGetReplies";
import { useRemoveCommentVote } from "@/hooks/useRemoveCommentVote";
import { usePanel } from "@/providers/PanelProvider";
import { createCommentSchema } from "@/schemas/createCommentSchema";
import { CommentWith_User_RepliesLength } from "@/types/Comment";
import { calculateCommentVotesSum } from "@/utils/calculateCommentVotesSum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CommentSummaryLoading from "./CommentsSummaryLoading";
import moment from "moment";
import Image from "next/image";

import DownArrowIconFilled from "/public/shared/icon-arrow-down-filled.svg";
import DownArrowIcon from "/public/shared/icon-arrow-down.svg";
import UpArrowIconFilled from "/public/shared/icon-arrow-up-filled.svg";
import UpArrowIcon from "/public/shared/icon-arrow-up.svg";
import CommentIcon from "/public/shared/icon-comments.svg";
import MinusCircleIcon from "/public/shared/icon-minus-circle.svg";
import PlusCircleIcon from "/public/shared/icon-plus-circle.svg";
import ReplyLeftBorder from "./ReplyLeftBorder";
import ImageLeftBorder from "./ImageLeftBorder";
import { useGetComments } from "@/hooks/useGetComments";

interface CommentProps {
  comments: CommentWith_User_RepliesLength[];
  feedbackId: string;
  showCommentsNumber?: boolean;
  autoSeeReplies?: boolean;
  areCommentsFetching: boolean;
}

const Comments = ({
  comments,
  feedbackId,
  showCommentsNumber,
  autoSeeReplies,
  areCommentsFetching,
}: CommentProps) => {
  const { data: feedback } = useGetFeedbackId(feedbackId);

  return (
    <div className="pt-6 px-8 pb-12">
      {showCommentsNumber ? (
        <div className="mb-6">
          <h3 className="text-navy-blue h3">
            {feedback?.comments.length} Comments
          </h3>
          {!comments.length ? (
            <h3 className="text-navy-blue h3 mt-2">Be the first to comment</h3>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col">
        {/* when submitting a comment show loading */}
        {areCommentsFetching ? (
          <CommentSummaryLoading></CommentSummaryLoading>
        ) : null}
        {comments.map((comment) => (
          <CommentSummary
            autoSeeReplies={autoSeeReplies}
            comment={comment}
            key={comment.id}
            depth={0}
          ></CommentSummary>
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
        <CommentSummaryLoading
          key={index}
          showLeftBorder={index != arr.length - 1}
          showImageLeftBorder
        ></CommentSummaryLoading>
      ))}
    </div>
  );
};

interface CommentSummaryProps {
  comment: CommentWith_User_RepliesLength;
  index?: number;
  isReply?: boolean;
  isLast?: boolean;
  depth: number;
  autoSeeReplies?: boolean;
}

const CommentSummary = ({
  comment,
  index,
  isReply,
  isLast,
  depth,
  autoSeeReplies,
}: CommentSummaryProps) => {
  const { openPanel } = usePanel();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [areRepliesExpanded, setAreRepliesExpanded] = useState(false);
  const { data: replies, fetchStatus: repliesFetchStatus } = useGetReplies(
    comment.id
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const queryClient = useQueryClient();

  const getMostDepth = () => {
    if (window.innerWidth < 400) return 2;

    const boxWidth = window.innerWidth - 100;
    const commentWidth = 150;
    return Math.floor(boxWidth / commentWidth) - 1;
  };

  const viewReplies = () => {
    if (!queryClient.getQueryState(["comments", comment.id, "replies"])?.data)
      queryClient.prefetchQuery({
        queryKey: ["comments", comment.id, "replies"],
      });
  };

  const checkValidDepth = () => depth + 1 <= getMostDepth();

  const toggleReplies = () => {
    if (!checkValidDepth()) {
      router.push(`/feedbacks/${comment.feedbackId}/comments/${comment.id}`);
      return;
    }
    viewReplies();
    setAreRepliesExpanded(!areRepliesExpanded);
  };

  const handleReplySubmit = () => {
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

  const handleReplyClick = () => {
    if (!checkValidDepth()) {
      router.push(
        `/feedbacks/${comment.feedbackId}/comments/${comment.id}?replyingTo=${comment.id}`
      );
      return;
    }

    if (session?.user) setIsReplying(true);
    else openPanel(PANELS.AUTH_PANEL);
  };

  useEffect(() => {
    if (autoSeeReplies) toggleReplies();
  }, [autoSeeReplies]);

  useEffect(() => {
    const replyingTo = searchParams.get("replyingTo");
    if (replyingTo == comment.id) setIsReplying(true);
  }, [searchParams]);

  useEffect(() => {
    const handleResize = (e: UIEvent) => {
      if (!checkValidDepth()) {
        setAreRepliesExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="relative flex sm:gap-2 md:gap-4 lg:gap-6 py-2 w-full items-start"
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
            repliesNumber={comment.replies.length || replies?.length || 0}
            areRepliesExpanded={areRepliesExpanded}
            onToggleReplies={toggleReplies}
            areRepliesFetched={
              Boolean(replies) || repliesFetchStatus == "fetching"
            }
            isReplying={isReplying}
          ></CommentSummaryHeader>
          <div className="relative flex flex-col max-w-[200px]">
            <div className="body2 text-steel-blue mb-2 max-w-[200px] text-wrap text-ellipsis overflow-hidden">
              {comment.content}
            </div>
            <CommentFooter
              commentId={comment.id}
              onReplyClick={handleReplyClick}
            ></CommentFooter>
          </div>
        </div>
        <div className="flex flex-col w-full">
          {isReplying || isCreatingReply() ? (
            <CommentReply
              onReply={handleReplySubmit}
              closeReply={() => setIsReplying(false)}
              feedbackId={comment.feedbackId}
              parentId={comment.id}
              leftBorder={comment.replies.length != 0}
            ></CommentReply>
          ) : null}
          <CommentSummaryReplies
            depth={depth}
            areRepliesExpanded={areRepliesExpanded}
            commentId={comment.id}
            isCreatingReply={isCreatingReply()}
            isReplying={isReplying}
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
  isReplying: boolean;
  depth: number;
}

const CommentSummaryReplies = ({
  commentId,
  areRepliesExpanded,
  isCreatingReply,
  depth,
}: CommentSummaryRepliesProps) => {
  const { data: replies, fetchStatus: repliesFetchStatus } =
    useGetReplies(commentId);

  return repliesFetchStatus == "fetching" && !replies?.length ? (
    <RepliesLoading count={1}></RepliesLoading>
  ) : areRepliesExpanded ? (
    <div className="flex flex-col">
      {(isCreatingReply && replies?.length) ||
      repliesFetchStatus == "fetching" ? (
        <CommentSummaryLoading showImageLeftBorder></CommentSummaryLoading>
      ) : null}
      {replies?.map((reply, index) => (
        <CommentSummary
          depth={depth + 1}
          comment={reply}
          index={index}
          isReply
          isLast={index == replies.length - 1}
          key={index}
        ></CommentSummary>
      ))}
    </div>
  ) : null;
};

interface CommentSummaryHeaderProps {
  createdAt: Date;
  userName: string | null;
  repliesNumber: number;
  onToggleReplies: () => void;
  areRepliesExpanded: boolean;
  areRepliesFetched: boolean;
  isReplying: boolean;
}

const CommentSummaryHeader = ({
  userName,
  createdAt,
  repliesNumber,
  onToggleReplies,
  areRepliesExpanded,
  areRepliesFetched,
  isReplying,
}: CommentSummaryHeaderProps) => {
  return (
    <div className="flex items-end justify-between mb-4">
      <div className="flex gap-2 sm:flex-col">
        <h4 className="h4 text-navy-blue">{userName}</h4>
        <h4 className="h4 text-steel-blue fpont-normal">
          {moment(createdAt).fromNow()}
        </h4>
      </div>
      {repliesNumber || areRepliesFetched ? (
        <CommentLeftBorder
          firstTime={!areRepliesExpanded && !areRepliesFetched}
          onToggle={onToggleReplies}
          areRepliesExpanded={areRepliesExpanded}
          repliesNumber={repliesNumber}
          isReplying={isReplying}
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
      <div className="size-10 rounded-full bg-transparent bg-steel-blue">
        <Image
          src={userImage || ""}
          alt={`${userName}'s image`}
          width={40}
          height={40}
          className="rounded-full size-10 object-cover bg-white"
        />
      </div>

      {isReply ? <ImageLeftBorder></ImageLeftBorder> : null}
    </div>
  );
};

interface CommentLeftBorderProps {
  onToggle?: () => void;
  areRepliesExpanded: boolean;
  repliesNumber: number;
  firstTime: boolean;
  isReplying: boolean;
}

const CommentLeftBorder = ({
  onToggle,
  areRepliesExpanded,
  repliesNumber,
  firstTime,
  isReplying,
}: CommentLeftBorderProps) => {
  const showMoreReplies = firstTime && !isReplying;

  return (
    <div className="absolute lg:left-[-44px] md:left-[-36px] sm:left-[-28px] top-[44px] bottom-[17.5px] w-[1px] bg-[#8C92B3]/25">
      <div className="relative size-full">
        <div
          className={`group absolute top-[100%] left-0 -translate-x-1/2 p-2 -mt-2 rounded-full cursor-pointer ${
            showMoreReplies ? "translate-y-3 translate-x-[42px]" : ""
          }`}
          onClick={onToggle}
        >
          <button className="group relative rounded-full size-4 flex items-center justify-center">
            {areRepliesExpanded ? (
              <Icon icon={MinusCircleIcon} color="rgb(100,113,150,0.25)"></Icon>
            ) : (
              <Icon icon={PlusCircleIcon} color="rgb(100,113,150,0.25)"></Icon>
            )}
            {!showMoreReplies ? (
              <div className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 bg-steel-blue/0 group-hover:bg-steel-blue/10 rounded-full"></div>
            ) : null}
          </button>
          {showMoreReplies ? (
            <p className="absolute group-hover:underline text-steel-blue/60 body3 top-1/2 -translate-y-1/2 translate-x-[20px] cursor-pointer text-nowrap">
              {repliesNumber}{" "}
              {repliesNumber == 1 ? "more reply" : "more replies"}
            </p>
          ) : null}
        </div>
        {showMoreReplies ? (
          <div className="absolute bottom-0 translate-y-full w-[52px] h-[20px] rounded-bl-3xl  border-[#8C92B3]/25 border-solid border-[1px] border-t-0 border-r-0"></div>
        ) : null}
      </div>
    </div>
  );
};

interface CommentFooterProps {
  onReplyClick?: () => void;
  commentId: string;
}

const CommentFooter = ({ onReplyClick, commentId }: CommentFooterProps) => {
  return (
    <div className="flex pb-2 sm:flex-col">
      <CommentVote commentId={commentId}></CommentVote>
      <button
        onClick={onReplyClick}
        className="flex gap-2 items-center hover:bg-steel-blue/10 rounded-full lgmd:px-4 py-2 w-fit"
      >
        <Image src={CommentIcon} alt="Comments Icon"></Image>
        <div className="body3 text-navy-blue">Reply</div>
      </button>
    </div>
  );
};

interface CommentVoteProps {
  commentId: string;
}

const CommentVote = ({ commentId }: CommentVoteProps) => {
  const { openPanel } = usePanel();
  const { data: session } = useSession();

  const { data } = useGetCommentVotes(commentId);

  const { mutate: voteOnComment } = useCommentVote(commentId);
  const { mutate: removeVoteOnComment } = useRemoveCommentVote(commentId);

  const handleUpvoteClick = () => {
    if (!session?.user) {
      openPanel(PANELS.AUTH_PANEL);
      return;
    }
    if (data?.myVoteType == "UPVOTE") {
      removeVoteOnComment();
    } else voteOnComment("UPVOTE");
  };
  const handleDownvoteClick = () => {
    if (!session?.user) {
      openPanel(PANELS.AUTH_PANEL);
      return;
    }
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
        <div className="absolute lg:left-[-44px] md:left-[-36px] sm:left-[-28px] top-[-2px] bottom-0 w-[1px] bg-[#8C92B3]/25"></div>
      ) : null}
    </div>
  );
};

export default Comments;
