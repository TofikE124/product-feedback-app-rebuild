"use client";
import { FeedbackWithUpVotesAndComments } from "@/types/Feedback";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export const useLoadFeedbacks = () => {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy");
  const sortDirection = searchParams.get("sortDirection");
  const category = searchParams.get("category");

  const query = useQuery({
    queryKey: ["feedbacks", sortBy, sortDirection, category],
    queryFn: () => {
      return axios
        .get("/api/feedback", { params: { sortBy, sortDirection, category } })
        .then((res) => res.data as FeedbackWithUpVotesAndComments[]);
    },
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
