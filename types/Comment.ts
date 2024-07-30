import { Prisma } from "@prisma/client";

export type CommentWithUser = Prisma.CommentGetPayload<{
  include: { user: true };
}>;

export type CommentWithUserAndRepliesLength = Prisma.CommentGetPayload<{
  include: { user: true; replies: { select: { _count: true } } };
}>;
