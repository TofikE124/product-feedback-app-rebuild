"use client";
import Button from "@/components/Button";
import FeedbackSummary from "@/components/FeedbackSummary";
import FeedbackSummaryLoading from "@/components/FeedbackSummaryLoading";
import GoBack from "@/components/GoBack";
import TextField from "@/components/TextField";
import { useGetFeedbackId } from "@/hooks/useGetFeedbackId";
import { useGetUserUpvotes } from "@/hooks/useGetUserUpvotes";
import { FeedbackWithUpVotesAndComments } from "@/types/Feedback";
import { UpVote } from "@prisma/client";
import { useState } from "react";
import { Comment } from "@prisma/client";

interface Props {
  params: { id: string };
}

const page = ({ params: { id } }: Props) => {
  const { data: feedback, isLoading } = useGetFeedbackId(id);
  const { data: upvotes } = useGetUserUpvotes();

  return (
    <main className="lg:max-w-[1200px] lgmd:px-10 mx-auto min-h-screen flex mdsm:flex-col lgmd:gap-8 lg:py-[94px] md:pt-[94px] md:pb-[40px] sm:pb-[50px]">
      <div className="flex flex-col w-full">
        <Header
          feedback={feedback!}
          isLoading={isLoading}
          upvotes={upvotes}
        ></Header>
        <AddComment></AddComment>
        <Comments comments={feedback?.comments || []}></Comments>
      </div>
    </main>
  );
};

interface HeaderProps {
  isLoading: boolean;
  feedback: FeedbackWithUpVotesAndComments;
  upvotes: UpVote[];
}

const Header = ({ feedback, isLoading, upvotes }: HeaderProps) => {
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
            myUpVotes={upvotes}
          ></FeedbackSummary>
        )}
      </div>
    </>
  );
};

const AddComment = () => {
  const MAX_CHARS = 250;

  const [comment, setComment] = useState("");

  const handleCommentChange = (value: string) => {
    if (value.length <= MAX_CHARS) setComment(value);
  };

  return (
    <div className="bg-white pt-6 px-8 pb-8 rounded-[10px] mt-2">
      <h3 className="text-navy-blue h3 mb-6">Add Comment</h3>
      <TextField
        value={comment}
        onChange={(e) => handleCommentChange(e.target.value)}
        textarea
        placeholder="Type your comment here"
      ></TextField>
      <div className="flex items-center justify-between mt-4 ">
        <p>{MAX_CHARS - comment.length} Charachters left</p>
        <Button color="violet">Post Comment</Button>
      </div>
    </div>
  );
};

interface CommentProps {
  comments: Comment[];
}

const Comments = ({ comments }: CommentProps) => {
  return (
    <div className="bg-white pt-6 px-8 pb-12 rounded-[10px] mt-6">
      <h3 className="text-navy-blue h3 mb-6">{comments.length} Comments</h3>
    </div>
  );
};

export default page;
