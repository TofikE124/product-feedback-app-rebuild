"use client";
import Button from "@/components/Button";
import FeedbackSummary from "@/components/FeedbackSummary";
import FeedbackSummaryLoading from "@/components/FeedbackSummaryLoading";
import GoBack from "@/components/GoBack";
import TextField from "@/components/TextField";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useGetComments } from "@/hooks/useGetComments";
import { useGetFeedbackId } from "@/hooks/useGetFeedbackId";
import { useGetUserUpvotes } from "@/hooks/useGetUserUpvotes";
import { createCommentSchema } from "@/schemas/createCommentSchema";
import { CommentWithUserAndRepliesLength } from "@/types/Comment";
import { FeedbackWithUpVotesAndComments } from "@/types/Feedback";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpVote } from "@prisma/client";
import moment from "moment";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Icon from "@/components/Icon";
import DownArrowIcon from "/public/shared/icon-arrow-down.svg";
import UpArrowIcon from "/public/shared/icon-arrow-up.svg";
import CommentIcon from "/public/shared/icon-comments.svg";
import PlusIcon from "/public/shared/icon-plus.svg";

import { useState } from "react";

interface Props {
  params: { id: string };
}

const page = ({ params: { id } }: Props) => {
  const { data: feedback, isLoading } = useGetFeedbackId(id);
  const { data: upvotes } = useGetUserUpvotes();
  const { data: comments } = useGetComments(id);

  return (
    <main className="lg:max-w-[1200px] lgmd:px-10 mx-auto min-h-screen flex mdsm:flex-col lgmd:gap-8 lg:py-[94px] md:pt-[94px] md:pb-[40px] sm:pb-[50px]">
      <div className="flex flex-col w-full">
        <Header
          feedback={feedback!}
          commentsNumber={comments?.length}
          isLoading={isLoading}
          upvotes={upvotes}
        ></Header>
        {feedback ? (
          <AddComment feedbackId={feedback?.id || ""}></AddComment>
        ) : null}
        <Comments comments={comments || []}></Comments>
      </div>
    </main>
  );
};

interface HeaderProps {
  isLoading: boolean;
  feedback: FeedbackWithUpVotesAndComments;
  upvotes: UpVote[];
  commentsNumber?: number;
}

const Header = ({
  feedback,
  commentsNumber,
  isLoading,
  upvotes,
}: HeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between w-full mb-9">
        <GoBack></GoBack>
        <Button color="dark-sky-blue">Edit Feedback</Button>
      </div>
      <div>
        {isLoading ? (
          <FeedbackSummaryLoading></FeedbackSummaryLoading>
        ) : (
          <FeedbackSummary
            feedback={feedback}
            commentsNumber={commentsNumber}
            myUpVotes={upvotes}
          ></FeedbackSummary>
        )}
      </div>
    </>
  );
};

interface AddCommentProps {
  feedbackId: string;
}

const AddComment = ({ feedbackId }: AddCommentProps) => {
  type createCommentType = z.infer<typeof createCommentSchema>;
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    resetField,
  } = useForm<createCommentType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      feedbackId,
      content: "",
    },
  });

  const MAX_CHARS = 250;

  const { mutate } = useCreateComment(feedbackId);

  const onSubmit = (data: createCommentType) => {
    mutate(data);
    resetField("content");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white pt-6 px-8 pb-8 rounded-[10px] mt-2"
    >
      <h3 className="text-navy-blue h3 mb-6">Add Comment</h3>
      <TextField
        textarea
        placeholder="Type your comment here"
        errorMessage={errors.content?.message}
        {...register("content")}
      ></TextField>
      <div className="flex items-center justify-between mt-4 ">
        <p>{MAX_CHARS - watch("content").length} Charachters left</p>
        <Button color="violet">Comment</Button>
      </div>
    </form>
  );
};

interface CommentProps {
  comments: CommentWithUserAndRepliesLength[];
}

const Comments = ({ comments }: CommentProps) => {
  return (
    <div className="bg-white pt-6 px-8 pb-12 rounded-[10px] mt-6">
      <h3 className="text-navy-blue h3 mb-6">{comments.length} Comments</h3>

      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <CommentSummary comment={comment} key={comment.id}></CommentSummary>
        ))}
      </div>
    </div>
  );
};

interface CommentSummaryProps {
  comment: CommentWithUserAndRepliesLength;
}

export const CommentSummary = ({ comment }: CommentSummaryProps) => {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="relative flex gap-8 w-full items-start">
      <CommentLeftBorder
        repliesLength={comment.replies.length}
        isReplying={isReplying}
      ></CommentLeftBorder>
      <Image
        src={comment.user.image || ""}
        alt={`${comment.user.name}'s image`}
        width={40}
        height={40}
      />
      <div className="flex flex-col w-full">
        <div className="flex items-end justify-between mb-4">
          <div className="flex gap-2">
            <h4 className="h4 text-navy-blue">{comment.user.name}</h4>
            <h4 className="h4 text-steel-blue fpont-normal">
              {moment(comment.createdAt).fromNow()}
            </h4>
          </div>
        </div>
        <p className="body2 text-steel-blue mb-2">{comment.content}</p>
        <CommentFooter onReply={() => setIsReplying(true)}></CommentFooter>
        {isReplying ? (
          <CommentReply
            closeReply={() => setIsReplying(false)}
            feedbackId={comment.feedbackId}
            parentId={comment.id}
          ></CommentReply>
        ) : null}
      </div>
    </div>
  );
};

interface CommentLeftBorderProps {
  repliesLength: number;
  isReplying: boolean;
}

const CommentLeftBorder = ({
  repliesLength,
  isReplying,
}: CommentLeftBorderProps) => {
  return repliesLength || isReplying ? (
    <>
      <div className="absolute bg-[#8C92B3]/25 w-[1px] top-[43px] left-[20px] bottom-[20px]">
        <div className="relative size-full">
          <div className="absolute top-[100%] left-0 -translate-x-1/2 p-2 -mt-2 hover:bg-steel-blue/10 rounded-full">
            <button className="border-steel-blue border-solid border opacity-25 rounded-full size-4 flex items-center justify-center">
              <Icon icon={PlusIcon} color="rgb(100,113,150)"></Icon>
            </button>
          </div>
        </div>
      </div>
    </>
  ) : null;
};

interface CommentFooterProps {
  onReply?: () => void;
}

const CommentFooter = ({ onReply }: CommentFooterProps) => {
  return (
    <div className="flex mb-2">
      <CommentVote></CommentVote>
      <button
        onClick={onReply}
        className="flex gap-2 items-center hover:bg-steel-blue/10 rounded-full px-4 py-2"
      >
        <Image src={CommentIcon} alt="Comments Icon"></Image>
        <h4 className="body3 text-navy-blue">Reply</h4>
      </button>
    </div>
  );
};

const CommentVote = () => {
  return (
    <div className="flex items-center -ml-2">
      <div className="p-2 hover:bg-steel-blue/10 rounded-full cursor-pointer">
        <Icon icon={UpArrowIcon} color="black" />
      </div>
      <div>
        <h4 className="h4 text-navy-blue">1.2K</h4>
      </div>
      <div className="p-2 hover:bg-steel-blue/10 rounded-full cursor-pointer">
        <Icon icon={DownArrowIcon} color="black" />
      </div>
    </div>
  );
};

interface CommentReplyProps {
  parentId: string;
  closeReply: () => void;
  feedbackId: string;
}

const CommentReply = ({
  parentId,
  closeReply,
  feedbackId,
}: CommentReplyProps) => {
  const { mutate } = useCreateComment(feedbackId);

  type createCommentType = z.infer<typeof createCommentSchema>;
  const {
    register,
    formState: { errors },
    handleSubmit,
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
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex flex-col gap-2 bg-cloud-white border border-[#8C92B3]/25 rounded-[10px] p-2"
    >
      <TextField
        {...register("content")}
        errorMessage={errors.content?.message}
        autoFocus
        textarea
      ></TextField>
      <div className="w-full flex justify-end gap-2">
        <Button onClick={closeReply} color="crimson">
          Cancel
        </Button>
        <Button>Comment</Button>
      </div>
    </form>
  );
};

export default page;
