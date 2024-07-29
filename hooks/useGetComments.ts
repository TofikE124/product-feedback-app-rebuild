import { CommentWithUser } from "@/types/Comment";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetComments = (feedbackId: string) => {
  const query = useQuery({
    queryKey: ["comments", feedbackId],
    queryFn: () =>
      axios
        .get(`/api/feedback/${feedbackId}/comments`)
        .then((res) => res.data as CommentWithUser[]),
  });

  return query;
};
