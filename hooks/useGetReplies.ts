import { CommentWithUserAndRepliesLength } from "@/types/Comment";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetReplies = (commentId: string) => {
  const query = useQuery({
    queryKey: ["comments", commentId, "replies"],
    queryFn: () =>
      axios
        .get(`/api/comments/${commentId}/replies`)
        .then((res) => res.data as CommentWithUserAndRepliesLength[]),
    enabled: false,
  });

  return query;
};
