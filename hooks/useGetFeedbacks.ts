"use client";
import { FeedbackWithUpVotesAndComments } from "@/types/Feedback";
import { Feedback } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useLoadFeedbacks = () => {
  const query = useQuery({
    queryKey: ["feedbacks"],
    queryFn: () =>
      axios
        .get("/api/feedback")
        .then((res) => res.data as FeedbackWithUpVotesAndComments[]),
  });

  return query;
};
