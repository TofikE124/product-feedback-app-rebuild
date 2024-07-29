"use client";
import { Feedback } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetFeedbackId = (feedback: Feedback) => {
  const query = useQuery({
    queryKey: ["feedbacks", feedback.id],
    queryFn: () =>
      axios.get(`/api/feedback/${feedback.id}`).then((res) => res.data),
    initialData: feedback,
    refetchOnMount: false,
  });
  return query;
};
