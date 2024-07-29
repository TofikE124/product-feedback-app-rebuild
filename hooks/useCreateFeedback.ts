"use client";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { Feedback } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";

export const useCreateFeedback = () => {
  type feedbackType = z.infer<typeof feedbackSchema>;
  const queryClient = useQueryClient();

  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["feedbacks"],
    mutationFn: (newFeedback: feedbackType) =>
      axios.post("/api/feedback", newFeedback),
    onMutate: async (newFeedback: feedbackType) => {
      await queryClient.cancelQueries({ queryKey: ["feedbacks"] });

      const previousFeedbacks = queryClient.getQueryData(["feedbacks"]);

      queryClient.setQueryData(["feedbacks"], (old: Feedback[] = []) => [
        ...old,
        newFeedback,
      ]);

      return { previousFeedbacks };
    },
    onError: (err, newFeedback, context) => {
      queryClient.setQueryData(["feedbacks"], context?.previousFeedbacks);
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      router.push("/");
    },
  });

  return mutation;
};
