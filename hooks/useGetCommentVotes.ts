import { CommentVote, VoteType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetCommentVotes = (commentId: string) => {
  const query = useQuery({
    queryKey: ["comments", commentId, "votes"],
    queryFn: () =>
      axios
        .get(`/api/comments/${commentId}/votes`)
        .then(
          (res) =>
            res.data as { votes: CommentVote[]; myVoteType: VoteType | null }
        ),
  });

  return query;
};
