import { Prisma } from "@prisma/client";

export type CommentWith_User = Prisma.CommentGetPayload<{
  include: { user: true };
}>;

export type CommentWith_User_RepliesLength = Prisma.CommentGetPayload<{
  include: { user: true; replies: { select: { _count: true } } };
}>;

export type CommentWith_User_RepliesLength_VotesType =
  Prisma.CommentGetPayload<{
    include: {
      user: true;
      replies: { select: { _count: true } };
      votes: { select: { voteType: true } };
    };
  }>;

export type CommentWith_VotesType = Prisma.CommentGetPayload<{
  include: { votes: { select: { voteType: true } } };
}>;
