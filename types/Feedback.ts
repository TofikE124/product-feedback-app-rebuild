import { Prisma } from "@prisma/client";

export type FeedbackWith_Comments = Prisma.FeedbackGetPayload<{
  include: { comments: true };
}>;

export type FeedbackWith_UpVotes = Prisma.FeedbackGetPayload<{
  include: { upVotes: true };
}>;

export type FeedbackWith_UpVotes_Comments = Prisma.FeedbackGetPayload<{
  include: { upVotes: true; comments: true };
}>;
