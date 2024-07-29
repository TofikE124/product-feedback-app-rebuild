import { Prisma } from "@prisma/client";

export type FeedbackWithComments = Prisma.FeedbackGetPayload<{
  include: { comments: true };
}>;

export type FeedbackWithUpVotes = Prisma.FeedbackGetPayload<{
  include: { upVotes: true };
}>;

export type FeedbackWithUpVotesAndComments = Prisma.FeedbackGetPayload<{
  include: { upVotes: true; comments: true };
}>;
