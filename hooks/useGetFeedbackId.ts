"use client";
import { FeedbackWith_UpVotes_Comments } from "@/types/Feedback";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetFeedbackId = (
  id: string,
  initialData?: FeedbackWith_UpVotes_Comments
) => {
  const query = useQuery({
    queryKey: ["feedbacks", id],
    queryFn: () =>
      axios
        .get(`/api/feedback/${id}`)
        .then((res) => res.data as FeedbackWith_UpVotes_Comments),
    initialData,
    refetchOnMount: false,
  });
  return query;
};
