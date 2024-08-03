"use client";
import { FeedbackWith_UpVotes_Comments } from "@/types/Feedback";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export const useLoadFeedbacks = (useFilters = true) => {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy");
  const sortDirection = searchParams.get("sortDirection");
  const category = searchParams.get("category");

  const query = useQuery({
    queryKey: useFilters
      ? ["feedbacks", sortBy, sortDirection, category]
      : ["feedbacks"],
    queryFn: () => {
      return axios
        .get("/api/feedback", {
          params: useFilters ? { sortBy, sortDirection, category } : {},
        })
        .then((res) => res.data as FeedbackWith_UpVotes_Comments[]);
    },
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
