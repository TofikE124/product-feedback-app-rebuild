"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCreateReply = (feedbackId: string, commentId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["comments", commentId, "replies"],
    mutationFn: ({ content }: { content: string }) =>
      axios.post("/api/comments", { content, feedbackId, parentId: commentId }),
    onMutate: async ({ content }) => {},
    onError: (error) => {
      console.log(error);
    },
    onSettled: (data, error) => {
      queryClient.prefetchQuery({
        queryKey: ["comments", commentId, "replies"],
      });
      queryClient.invalidateQueries({
        queryKey: ["feedbacks", feedbackId, "comments"],
      });
    },
  });

  return mutation;
};
