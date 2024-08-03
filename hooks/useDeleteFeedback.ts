import { Feedback } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useDeleteFeedback = (feedbackId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["feedbacks", feedbackId],
    mutationFn: () => axios.delete(`/api/feedback/${feedbackId}`),
    onMutate: async () => {},
    onError: () => {},
    onSettled: () => {
      queryClient.setQueriesData(
        {
          queryKey: ["feedbacks", "DateUpdated", "desc", null],
        },
        (old: Feedback[] = []) => []
      );

      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      toast.success("Feedback Deleted Successfully");
      router.push("/");
    },
  });

  return mutation;
};
