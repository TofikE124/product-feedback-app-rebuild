"use client";
import {
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

export const useCreateReply = (feedbackId: string, commentId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["comments", commentId, "replies"],
    mutationFn: ({ content }: { content: string }) =>
      axios.post(`/api/comments/${commentId}/reply`, {
        content,
        feedbackId,
        parentId: commentId,
      }),
    onMutate: async ({ content }) => {},
    onError: (error) => {
      console.log(error);
    },
    onSettled: (data, error) => {
      queryClient.invalidateQueries({
        queryKey: ["feedbacks", feedbackId],
      });
      queryClient.prefetchQuery({
        queryKey: ["comments", commentId, "replies"],
      });
    },
  });

  return mutation;
};
