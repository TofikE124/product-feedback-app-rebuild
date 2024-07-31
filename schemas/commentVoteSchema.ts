import { VoteType } from "@prisma/client";
import { z } from "zod";

const voteValues = Object.values(VoteType) as [string, ...string[]];

export const commentVoteSchema = z.object({
  voteType: z.enum(voteValues),
});
