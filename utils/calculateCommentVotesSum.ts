import { CommentVote } from "@prisma/client";

export const calculateCommentVotesSum = (votes: CommentVote[]) => {
  return votes.reduce(
    (sum, vote) => sum + (vote.voteType == "UPVOTE" ? 1 : -1),
    0
  );
};
