import { CommentVote, VoteType } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";

export const useCommentVote = (commentId: string) => {
  const queryClient = useQueryClient();
  let cancelTokenSource: CancelTokenSource | null = null;

  const mutate = useMutation({
    mutationKey: ["comments", commentId, "votes"],
    mutationFn: (voteType: VoteType) => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel("Operation canceled due to new mutation.");
      }
      cancelTokenSource = axios.CancelToken.source();
      const config: AxiosRequestConfig = {
        cancelToken: cancelTokenSource.token,
      };

      return axios.post(
        `/api/comments/${commentId}/vote`,
        { voteType },
        config
      );
    },
    onMutate: async (voteType: VoteType) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", commentId, "votes"],
        exact: true,
      });

      const { votes, myVoteType } = queryClient.getQueryData([
        "comments",
        commentId,
        "votes",
      ]) as { votes: CommentVote[]; myVoteType: VoteType | null };

      let newVotes = [...votes];

      let newVote: CommentVote = {
        commentId: commentId,
        id: crypto.randomUUID(),
        userId: "",
        voteType,
      };

      if (myVoteType == "UPVOTE" && voteType == "DOWNVOTE") {
        newVotes.splice(
          newVotes.findIndex((vote) => vote.voteType == "UPVOTE"),
          1
        );
      } else if (myVoteType == "DOWNVOTE" && voteType == "UPVOTE") {
        newVotes.splice(
          newVotes.findIndex((vote) => vote.voteType == "DOWNVOTE"),
          1
        );
      }

      newVotes.push(newVote);

      queryClient.setQueryData(["comments", commentId, "votes"], {
        votes: newVotes,
        myVoteType: voteType,
      });

      return { votes, myVoteType };
    },
    onError: () => {},
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", commentId, "votes"],
      });
    },
  });

  return mutate;
};
