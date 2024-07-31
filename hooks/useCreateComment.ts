"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCreateComment = (feedbackId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["feedbacks", feedbackId, "comments"],
    mutationFn: ({ content }: { content: string; parentId?: string }) =>
      axios.post("/api/comments", { content, feedbackId }),
    onError: () => {},
    onSettled: (data, error, { parentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["feedbacks", feedbackId, "comments"],
      });
    },
  });

  return mutation;
};
