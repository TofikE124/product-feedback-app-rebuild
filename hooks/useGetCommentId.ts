import { CommentWith_User_RepliesLength } from "@/types/Comment";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetCommentId = (feedbackId: string, commentId: string) => {
  const query = useQuery({
    queryKey: ["feedbacks", feedbackId, "comments", commentId],
    queryFn: () =>
      axios
        .get(`/api/comments/${commentId}`)
        .then((res) => res.data as CommentWith_User_RepliesLength),
  });

  return query;
};
