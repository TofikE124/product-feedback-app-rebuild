import { Prisma } from "@prisma/client";

export type CommentWithUser = Prisma.CommentGetPayload<{
  include: { user: true };
}>;
