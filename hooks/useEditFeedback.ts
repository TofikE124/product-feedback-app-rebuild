import { feedbackSchema } from "@/schemas/feedbackSchema";
import { Feedback } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { Axios } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";

type feedbackType = z.infer<typeof feedbackSchema>;

export const useEditFeedback = (feedbackId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["feedbacks", feedbackId],
    mutationFn: (feedback: feedbackType) =>
      axios.patch(`/api/feedback/${feedbackId}`, { ...feedback }),
    onMutate: async (feedback: feedbackType) => {
      await queryClient.cancelQueries({ queryKey: ["feedbacks", feedbackId] });

      const oldFeedback = queryClient.getQueryData(["feedbacks", feedbackId]);

      queryClient.setQueryData(["feedbacks", feedbackId], (old: Feedback) => ({
        ...old,
        ...feedback,
      }));

      return { oldFeedback };
    },
    onError: (error, {}, context) => {
      queryClient.setQueryData(["feedbacks", feedbackId], context?.oldFeedback);
      toast.error("Error editing feedback");
    },
    onSuccess: () => {
      toast.success("Changes Saved Successfully");
      router.push(`/feedbacks/${feedbackId}/comments`);
      queryClient.invalidateQueries({ queryKey: ["feedbacks", feedbackId] });
    },
  });

  return mutation;
};
