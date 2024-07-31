import { CommentVote, VoteType } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";

export const useRemoveCommentVote = (commentId: string) => {
  const queryClient = useQueryClient();
  let cancelTokenSource: CancelTokenSource | null = null;

  const mutation = useMutation({
    mutationKey: ["comments", commentId, "votes"],
    mutationFn: () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel("Operation canceled due to new mutation.");
      }
      cancelTokenSource = axios.CancelToken.source();
      const config: AxiosRequestConfig = {
        cancelToken: cancelTokenSource.token,
      };

      return axios.post(`/api/comments/${commentId}/removeVote`, config);
    },
    onMutate: async () => {
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

      newVotes.splice(
        votes.findIndex((vote) => vote.voteType == myVoteType),
        1
      );

      queryClient.setQueryData(["comments", commentId, "votes"], {
        votes: newVotes,
        voteType: null,
      });

      return { oldVotes: votes };
    },
    onError: (error, {}, context) => {
      queryClient.setQueryData(["comments", commentId, "votes"], {
        votes: context?.oldVotes,
        voteType: null,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", commentId, "votes"],
      });
    },
  });
  return mutation;
};
