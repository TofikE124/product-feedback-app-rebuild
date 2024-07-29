"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCreateComment = (feedbackId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["comments", feedbackId],
    mutationFn: ({
      feedbackId,
      content,
    }: {
      feedbackId: string;
      content: string;
    }) => axios.post("/api/comments", { content, feedbackId }),
    onError: () => {},
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", feedbackId] });
    },
  });

  return mutation;
};
