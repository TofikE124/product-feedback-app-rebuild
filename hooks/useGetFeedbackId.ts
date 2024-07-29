"use client";
import { FeedbackWithUpVotesAndComments } from "@/types/Feedback";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetFeedbackId = (
  id: string,
  initialData?: FeedbackWithUpVotesAndComments
) => {
  const query = useQuery({
    queryKey: ["feedbacks", id],
    queryFn: () =>
      axios
        .get(`/api/feedback/${id}`)
        .then((res) => res.data as FeedbackWithUpVotesAndComments),
    initialData,
    refetchOnMount: false,
  });
  return query;
};
