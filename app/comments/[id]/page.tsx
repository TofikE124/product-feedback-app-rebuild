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
import { CommentWithUser } from "@/types/Comment";
import { FeedbackWithUpVotesAndComments } from "@/types/Feedback";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpVote } from "@prisma/client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import moment from "moment";

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
        <Button color="violet">Post Comment</Button>
      </div>
    </form>
  );
};

interface CommentProps {
  comments: CommentWithUser[];
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
  comment: CommentWithUser;
}

export const CommentSummary = ({ comment }: CommentSummaryProps) => {
  console.log(comment);
  return (
    <div className="flex gap-8 w-full items-start">
      <Image
        src={comment.user.image || ""}
        alt={`${comment.user.name}'s image`}
        width={40}
        height={40}
      />
      <div className="flex flex-col w-full gap-4">
        <div className="flex items-end justify-between">
          <div className="flex gap-2">
            <h4 className="h4 text-navy-blue">{comment.user.name}</h4>
            <h4 className="h4 text-steel-blue font-normal">
              {moment(comment.createdAt).fromNow()}
            </h4>
          </div>
          <button className="body3 text-dark-sky-blue">Reply</button>
        </div>
        <p className="body2 text-steel-blue">{comment.content}</p>
      </div>
    </div>
  );
};

export default page;
