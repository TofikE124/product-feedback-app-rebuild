import { FeedbackWithUpVotes } from "@/types/Feedback";
import { Feedback, UpVote } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const useUpvote = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["upvotes"],
    mutationFn: () => axios.post(`/api/feedback/${id}/upVote`),
    onMutate: async () => {
      const oldFeedback = queryClient.getQueryData([
        "feedbacks",
        id,
      ]) as FeedbackWithUpVotes;
      const oldUpvotes = queryClient.getQueryData(["upvotes"]) as UpVote[];

      let newUpvotes: UpVote[] = [];

      const newUpVote = {
        feedbackId: id,
        id: crypto.randomUUID(),
        userId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      newUpvotes = [...oldUpvotes, newUpVote];

      queryClient.setQueryData(["feedbacks", id], {
        ...oldFeedback,
        upVotes: [...oldFeedback.upVotes, newUpVote],
      });
      queryClient.setQueryData(["upvotes"], newUpvotes);

      return { oldUpvotes, oldFeedback };
    },
    onError: (error, variables, context) => {
      toast.error("Error upvoting");
      queryClient.setQueryData(["feedbacks", id], context?.oldFeedback);
      queryClient.setQueryData(["upvotes"], context?.oldUpvotes);
    },
    onSettled: () => {
      console.log("settled upvoting");
      queryClient.invalidateQueries({ queryKey: ["feedbacks", id] });
      queryClient.invalidateQueries({ queryKey: ["upvotes"] });
    },
  });

  return mutation;
};
