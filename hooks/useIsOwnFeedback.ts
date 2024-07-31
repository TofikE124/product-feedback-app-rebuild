import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useIsOwnFeedback = (feedbackId: string) => {
  const query = useQuery({
    queryKey: ["feedbacks", feedbackId, "isOwn"],
    queryFn: () =>
      axios.get(`/api/feedback/${feedbackId}/isOwn`).then((res) => res.data),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
  return query;
};
