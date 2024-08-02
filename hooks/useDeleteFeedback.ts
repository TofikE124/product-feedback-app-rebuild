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
    onMutate: () => {},
    onError: () => {},
    onSettled: () => {
      toast.success("Feedback Deleted Successfully");
      router.push("/");
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });

  return mutation;
};
