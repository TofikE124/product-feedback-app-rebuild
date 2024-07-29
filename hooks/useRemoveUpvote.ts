import { FeedbackWithUpVotes } from "@/types/Feedback";
import { UpVote } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export const useRemoveUpvote = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["upvotes"],
    mutationFn: () => axios.post(`/api/feedback/${id}/removeUpVote`),
    onMutate: async () => {
      const oldUpvotes =
        (queryClient.getQueryData(["upvotes"]) as UpVote[]) || [];

      const oldFeedback = queryClient.getQueryData([
        "feedbacks",
        id,
      ]) as FeedbackWithUpVotes;

      let newUpvotes: UpVote[] = [...oldUpvotes];

      const deletedUpvoteIndex = newUpvotes.findIndex(
        (vote) => vote.feedbackId == id
      );

      const deletedUpvote = newUpvotes.splice(deletedUpvoteIndex, 1)[0];

      queryClient.setQueryData(["feedbacks", id], {
        ...oldFeedback,
        upVotes: [...oldFeedback.upVotes].filter(
          (vote: UpVote) => vote.id != deletedUpvote?.id
        ),
      });

      queryClient.setQueryData(["upvotes"], newUpvotes);

      return { oldUpvotes, oldFeedback };
    },
    onError: (error, variables, context) => {
      toast.error("Error removing upvote");
      queryClient.setQueryData(["feedbacks", id], context?.oldFeedback);
      queryClient.setQueryData(["upvotes"], context?.oldUpvotes);
    },
    onSettled: () => {
      console.log("settled remove upvoting");
      queryClient.invalidateQueries({ queryKey: ["feedbacks", id] });
      queryClient.invalidateQueries({ queryKey: ["upvotes"] });
    },
  });

  return mutation;
};
