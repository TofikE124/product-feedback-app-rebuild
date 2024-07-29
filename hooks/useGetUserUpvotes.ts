import { UpVote } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetUserUpvotes = () => {
  const query = useQuery<UpVote[]>({
    queryKey: ["upvotes"],
    queryFn: () => axios.get("/api/upvotes").then((res) => res.data),
    initialData: [],
  });

  return query;
};
