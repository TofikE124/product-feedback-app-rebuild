import { CommentWith_User_RepliesLength } from "@/types/Comment";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetComments = (feedbackId: string) => {
  const query = useQuery({
    queryKey: ["feedbacks", feedbackId, "comments"],
    queryFn: () =>
      axios
        .get(`/api/feedback/${feedbackId}/comments`)
        .then((res) => res.data as CommentWith_User_RepliesLength[]),
  });

  return query;
};
